import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  DeviceInfo,
  TouchableOpacity,
  DeviceEventEmitter
} from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import { connect } from "react-redux";
import actions from "../action/index";
import NavigationUtil from "../navigator/NavigationUtil";
import TrendingItem from "../common/TrendingItem";
import Toast from "react-native-easy-toast";
import NavigationBar from "../common/NavigationBar";
import TrendingDialog, { TimeSpans } from "../common/TrendingDialog";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoirteUtil from "../util/FavoirteUtil";
import FavoriteDao from "../expand/dao/FavoriteDao";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_trending);
const EVENT_TYPE_TIME_SPAN_CHANGE = "EVENT_TYPE_TIME_SPAN_CHANGE";
const URL = "https://github.com/trending/";
const QUERY_STR = "?since=daily";
type Props = {};

export default class TrendingPage extends Component<Props> {
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.tabNames = ["All", "C", "C#", "PHP", "JavaScript"];
    this.state = {
      timeSpan: TimeSpans[0]
    };
  }
  _topBarNavigator() {
    if (!this.tabNav) {
      this.tabNav = createMaterialTopTabNavigator(this._genTabs(), {
        tabBarOptions: {
          tabStyle: StyleSheet.tabStyle,
          upperCaseLabel: false, // 是否标签大写
          scrollEnabled: true,
          style: {
            backgroundColor: "#678",
            height: 30
          },
          indicatorStyle: styles.indicatorStyle,
          labelStyle: styles.labelStyle
        }
      });
    }
    return this.tabNav;
  }
  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        // screen: PopularTab,
        screen: props => (
          <TrendingTabPage
            {...props}
            timeSpan={this.state.timeSpan}
            tabBarLabel={item}
          />
        ),
        navigationOptions: {
          title: item
        }
      };
    });
    return tabs;
  }
  renderTitleView() {
    return (
      <View>
        <TouchableOpacity
          ref="button"
          underlayColor="transparent"
          onPress={() => this.dialog.show()}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={{ fontSize: 18, color: "#FFFFFF", fontWeight: "400" }}>
              趋势 {this.state.timeSpan.showText}
            </Text>
            <MaterialIcons
              name={"arrow-drop-down"}
              size={22}
              style={{ color: "white" }}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
  onSelectTimeSpan(tab) {
    this.dialog.dismiss();
    this.setState({
      timeSpan: tab
    });
    DeviceEventEmitter.emit(EVENT_TYPE_TIME_SPAN_CHANGE, tab);
  }
  renderTrendingDialog() {
    return (
      <TrendingDialog
        ref={dialog => (this.dialog = dialog)}
        onSelect={tab => this.onSelectTimeSpan(tab)}
      />
    );
  }
  render() {
    let statusBar = {
      backgroundColor: "#678",
      barStyle: "light-content"
    };
    let navigationBar = (
      <NavigationBar
        titleView={this.renderTitleView()}
        statusBar={statusBar}
        style={{ backgroundColor: "#678" }}
      />
    );

    const TopNav = createAppContainer(this._topBarNavigator());
    return (
      <View
        style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}
      >
        {navigationBar}
        <TopNav />
        {this.renderTrendingDialog()}
      </View>
    );
  }
}

const pageSize = 10;
class TrendingTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { tabBarLabel, timeSpan } = this.props;
    this.storeName = tabBarLabel;
    this.timeSpan = timeSpan;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData(false);
    this.timeSpanChangeListener = DeviceEventEmitter.addListener(
      EVENT_TYPE_TIME_SPAN_CHANGE,
      timeSpan => {
        this.timeSpan = timeSpan;
        this.loadData();
      }
    );
    EventBus.getInstance().addListener(
      EventTypes.favorite_changed_trending,
      (this.favoriteChangeListener = () => {
        this.isFavoriteChanged = true;
      })
    );
    EventBus.getInstance().addListener(
      EventTypes.bottom_tab_select,
      (this.bottomTabSelectListener = data => {
        if (data.to === 1 && this.isFavoriteChanged) {
          this.loadData(null, true);
        }
      })
    );
  }
  componentWillUnmount() {
    if (this.timeSpanChangeListener) {
      this.timeSpanChangeListener.remove();
    }
    EventBus.getInstance().removeListener(this.favoriteChangeListener);
    EventBus.getInstance().removeListener(this.bottomTabSelectListener);
  }
  loadData(loadMore, refreshFavorite) {
    const {
      onRefreshTrending,
      onLoadMoreTrending,
      onFlushTrendingFavorite
    } = this.props;
    const url = this.genFetchUrl(this.storeName);
    const store = this._store();
    if (loadMore) {
      onLoadMoreTrending(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
        callback => {
          this.refs.toast.show("没有更多了");
        }
      );
    } else if (refreshFavorite) {
      onFlushTrendingFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
      this.isFavoriteChanged = false;
    } else {
      onRefreshTrending(this.storeName, url, pageSize, favoriteDao);
    }
  }
  /**
   * 获取与当前页面有关的数据
   */
  _store() {
    const { trending } = this.props;
    let store = trending[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
        hideLoadingMore: true // 默认隐藏加载更多
      };
    }
    return store;
  }
  genFetchUrl(key) {
    return URL + key + "?" + this.timeSpan.searchText;
  }
  renderItem(data) {
    const item = data.item;
    return (
      <TrendingItem
        projectModel={item}
        onSelect={callback => {
          NavigationUtil.goPage(
            {
              projectModel: item,
              flag: FLAG_STORAGE.flag_trending,
              callback
            },
            "DetailPage"
          );
        }}
        onFavorite={(item, isFavorite) =>
          FavoirteUtil.onFavorite(
            favoriteDao,
            item,
            isFavorite,
            FLAG_STORAGE.flag_trending
          )
        }
      />
    );
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null : (
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    );
  }
  render() {
    let store = this._store(); // 动态获取state

    return (
      <View>
        <FlatList
          data={store.projectModels}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => {
            "" + (item.item.id || item.item.fullName);
          }}
          refreshControl={
            <RefreshControl
              title={"Loading"}
              titleColor={"red"}
              colors={["red"]}
              refreshing={store.isLoading}
              onRefresh={() => this.loadData()}
              tintColor={"red"}
            />
          }
          ListFooterComponent={() => this.genIndicator()}
          onEndReached={() => {
            setTimeout(() => {
              if (this.canLoadMore) {
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100);
          }}
          onEndReachedThreshold={0.5}
          // 防止多次调用onEndReached, 一次滚动加载一次
          onMomentumScrollBegin={() => {
            this.canLoadMore = true;
          }}
        />
        <Toast ref={"toast"} position={"center"} />
      </View>
    );
  }
}

const mapState = state => ({
  trending: state.trending
});
const mapDispatch = dispatch => ({
  onRefreshTrending: (storeName, url, pageSize) =>
    dispatch(actions.onRefreshTrending(storeName, url, pageSize, favoriteDao)),
  onLoadMoreTrending: (storeName, pageIndex, pageSize, items, callback) =>
    dispatch(
      actions.onLoadMoreTrending(
        storeName,
        pageIndex,
        pageSize,
        items,
        favoriteDao,
        callback
      )
    ),
    onFlushTrendingFavorite: (storeName, pageIndex, pageSize, items, favoriteDao) => 
    dispatch(actions.onFlushTrendingFavorite(storeName, pageIndex, pageSize, items, favoriteDao)),
});
const TrendingTabPage = connect(
  mapState,
  mapDispatch
)(TrendingTab);

const styles = StyleSheet.create({
  tabStyle: {
    // minWidth: 50
    padding: 0
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: "white"
  },
  labelStyle: {
    fontSize: 13,
    margin: 0
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: "red",
    margin: 10
  }
});
