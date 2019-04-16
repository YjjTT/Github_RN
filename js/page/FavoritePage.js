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
import TrendingItem from "../common/TrendingItem";
import EventBus from "react-native-event-bus";
import EventTypes from "../util/EventTypes";

const favoriteDao = new FavoriteDao(FLAG_STORAGE.flag_popular);
const URL = "https://api.github.com/search/repositories?q=";
const QUERY_STR = "&sort=stars";
type Props = {};
export default class FavoritePage extends Component<Props> {
  _topBarNavigator() {
    return createMaterialTopTabNavigator({
      'Popular': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_popular}/>,
        navigationOptions:{
          title: '最热',
        }
      },
      'Trending': {
        screen: props => <FavoriteTabPage {...props} flag={FLAG_STORAGE.flag_trending}/>,
        navigationOptions:{
          title: '趋势',
        }
      }
    }, {
      tabBarOptions: {
        tabStyle: StyleSheet.tabStyle,
        upperCaseLabel: false, // 是否标签大写
        style: {
          backgroundColor: "#678",
          height: 30 // fix 开启scrollEnabled 后在安卓上初次加载闪烁问题
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle
      }
    });
  }
  constructor(props) {
    super(props);
    console.disableYellowBox = true;
    this.tabNames = ["最热", '趋势'];
  }
  render() {
    let statusBar = {
      backgroundColor: '#678',
      barStyle: 'light-content'
    }
    let navigationBar = <NavigationBar title={'收藏'} statusBar={statusBar} style={{backgroundColor:'#678'}}/>

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
class FavoriteTab extends Component<Props> {
  constructor(props) {
    super(props);
    const { flag } = this.props;
    this.storeName = flag;
    this.favoriteDao = new FavoriteDao(flag);
  }
  componentDidMount() {
    this.loadData(true);
    EventBus.getInstance().addListener(EventTypes.bottom_tab_select, this.listener = data => {
      if(data.to === 2){
        this.loadData(false);
      }
    })
  }
  componentWillUnmount(){
    EventBus.getInstance().removeListener(this.listener);
  }
  loadData(isShowLoading) {
    const { OnLoadFavoriteData } = this.props;
    OnLoadFavoriteData(this.storeName, isShowLoading);
  }
  /**
   * 获取与当前页面有关的数据
   */
  _store() {
    const { favorite } = this.props;
    let store = favorite[this.storeName];
    if (!store) {
      store = {
        items: [],
        isLoading: false,
        projectModels: [], // 要显示的数据
      };
    }
    return store;
  }
  onFavorite(item, isFavorite){
    FavoirteUtil.onFavorite(this.favoriteDao, item, isFavorite, this.props.flag);
    if(this.storeName === FLAG_STORAGE.flag_popular){
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_popular);
    }else{
      EventBus.getInstance().fireEvent(EventTypes.favorite_changed_trending);
    }
  }
  renderItem(data) {
    const item = data.item;
    const Item = this.storeName === FLAG_STORAGE.flag_popular ? PopularItem : TrendingItem;
    return <Item projectModel={item} onSelect={(callback) => {
      NavigationUtil.goPage({
        projectModel: item,
        flag: this.storeName,
        callback,
      }, 'DetailPage')
    }} 
    onFavorite={(item, isFavorite)=>this.onFavorite(item, isFavorite)}
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
              onRefresh={() => this.loadData(true)}
              tintColor={"red"}
            />
          }
        />
        <Toast ref={"toast"} position={"center"} />
      </View>
    );
  }
}

const mapState = state => ({
  favorite: state.favorite
});
const mapDispatch = dispatch => ({
  OnLoadFavoriteData: (storeName, isShowLoading) =>
    dispatch(actions.OnLoadFavoriteData(storeName, isShowLoading)),
});
const FavoriteTabPage = connect(
  mapState,
  mapDispatch
)(FavoriteTab);

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
