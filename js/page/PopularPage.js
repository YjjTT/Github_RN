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
  }
  componentDidMount() {
    this.loadData(false);
  }
  loadData(loadMore) {
    const { onRefreshPopular, onLoadMorePopular } = this.props;
    const url = this.genFetchUrl(this.storeName);
    const store = this._store();
    console.log(store.pageIndex)
    if (loadMore) {
      onLoadMorePopular(
        this.storeName,
        ++store.pageIndex,
        pageSize,
        store.items,
        callback => {
          this.refs.toast.show("没有更多了");
        }
      );
    } else {
      onRefreshPopular(this.storeName, url, pageSize);
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
        projectModes: [], // 要显示的数据
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
    return <PopularItem item={item} onSelect={() => {}} />;
  }
  genIndicator() {
    console.log(this._store().hideLoadingMore);
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
          data={store.projectModes}
          renderItem={data => this.renderItem(data)}
          keyExtractor={item => {
            "" + (item.id || item.fullName);
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
  onRefreshPopular: (storeName, url, pageSize) =>
    dispatch(actions.onRefreshPopular(storeName, url, pageSize)),
  onLoadMorePopular: (storeName, pageIndex, pageSize, items, callback) =>
    dispatch(actions.onLoadMorePopular(storeName, pageIndex, pageSize, items, callback))
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
