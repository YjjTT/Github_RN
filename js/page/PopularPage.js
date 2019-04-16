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
} from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import { connect } from "react-redux";
import actions from "../action/index";
import NavigationUtil from "../navigator/NavigationUtil";
import PopularItem from "../common/PopularItem";
import Toast from "react-native-easy-toast";
import NavigationBar from '../common/NavigationBar'
import FavoriteDao from '../expand/dao/FavoriteDao'
import { FLAG_STORAGE } from "../expand/dao/DataStore";
import FavoirteUtil from '../util/FavoirteUtil'
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";


const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";
type Props = {};
export default class PopularPage extends Component<Props> {
  _topBarNavigator() {
    return createMaterialTopTabNavigator(this._genTabs(), {
      tabBarOptions: {
        tabStyle: StyleSheet.tabStyle,
        upperCaseLabel: false, // 是否标签大写
        scrollEnabled: true,
        style: {
          backgroundColor: "#678",
          height: 30 // fix 开启scrollEnabled 后在安卓上初次加载闪烁问题
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    });
  }
  _genTabs() {
    const tabs = {};
    this.tabNames.forEach((item, index) => {
      tabs[`tab${index}`] = {
        // screen: PopularTab,
        screen: props => <PopularTabPage {...props} tabBarLabel={item} />,
        navigationOptions: {
          title: item
        }
      };
    });
    return tabs;
  }
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.tabNames = ["Java", "Android", "iOS", "React", "React Native", "Vue"];
  }
  render() {
    let statusBar = {
      backgroundColor: '#678',
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar title={'最热'} statusBar={statusBar} style={{backgroundColor:'#678'}}/>

    const TopNav = createAppContainer(this._topBarNavigator());
    return (
      <View style={{ flex: 1, marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0 }}>
      {navigationBar}
        <TopNav />
      </View>
    );
  }
}
const pageSize = 10;
class PopularTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { tabBarLabel } = this.props;
    this.storeName = tabBarLabel;
    this.isFavoriteChanged = false;
  }
  componentDidMount() {
    this.loadData();
    EventBus.getInstance().addListener(EventTypes.favorite_changed_popular, this.favoriteChangeListener = data =>{
      this.isFavoriteChanged = true;
    });
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.bottomTabSelectListener = data =>{
      if(data.to === 0 && this.isFavoriteChanged){
        this.loadData(null, true);
      }
    });
  }
  componentWillUnmount(){
    EventBus.getInstance().removeListener(this.favoriteChangeListener)
    EventBus.getInstance().removeListener(this.bottomTabSelectListener)
  }
  loadData(loadMore, refreshFavorite) {
    const { onRefreshPopular, onLoadMorePopular,onFlushPopularFavorite } = this.props;
    const url = this.genFetchUrl(this.storeName);
    const store = this._store();
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        favoriteDao,
        callback => {
          this.refs.toast.show("没有更多了");
        },
      );
    }else if(refreshFavorite){
       onFlushPopularFavorite(this.storeName, store.pageIndex, pageSize, store.items, favoriteDao);
    } else {
      onRefreshPopular(this.storeName, url, pageSize,favoriteDao);
    }
  }
  /**
   * 获取与当前页面有关的数据
   */
  _store() {
    const { popular } = this.props;
    let store = popular[this.storeName];
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
    return URL + key + QUERY_STR;
  }
  renderItem(data) {
    const item = data.item;
    return <PopularItem projectModel={item} onSelect={(callback) => {
      NavigationUtil.goPage({
        projectModel: item,
        flag: FLAG_STORAGE.flag_popular,
        callback,
      }, 'DetailPage')
    }} 
    onFavorite={(item, isFavorite)=>FavoirteUtil.onFavorite(favoriteDao, item, isFavorite, FLAG_STORAGE.flag_popular)}
    />;
  }
  genIndicator() {
    return this._store().hideLoadingMore ? null : 
      <View style={styles.indicatorContainer}>
        <ActivityIndicator style={styles.indicator} />
        <Text>正在加载更多</Text>
      </View>
    ;
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
            setTimeout(()=>{
              if(this.canLoadMore){
                this.loadData(true);
                this.canLoadMore = false;
              }
            }, 100)
          }}
          onEndReachedThreshold={0.5}

          // 防止多次调用onEndReached, 一次滚动加载一次
          onMomentumScrollBegin={()=>{
            this.canLoadMore = true;
          }}
        />
        <Toast ref={"toast"} position={"center"} />
      </View>
    );
  }
}

const mapState = state => ({
  popular: state.popular
});
const mapDispatch = dispatch => ({
  onRefreshPopular: (storeName, url, pageSize, favoriteDao) =>
    dispatch(actions.onRefreshPopular(storeName, url, pageSize,favoriteDao)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items,favoriteDao ,callback) =>
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items,favoriteDao, callback)),
  onFlushPopularFavorite: (storeName, pageIndex, pageSize, items,favoriteDao) => 
    dispatch(actions.onFlushPopularFavorite(storeName, pageIndex, pageSize, items,favoriteDao))
});
const PopularTabPage = connect(
  mapState,
  mapDispatch
)(PopularTab);

const styles = StyleSheet.create({
  tabStyle: {
    // minWidth: 50 // fix minWidth 会导致tabStyle初次加载时闪烁
    padding: 0,
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: "white"
  },
  labelStyle: {
    fontSize: 13,
    margin: 0,
  },
  indicatorContainer: {
    alignItems: "center"
  },
  indicator: {
    color: "red",
    margin: 10
  }
});
