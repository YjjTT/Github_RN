import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import PopularPage from '../page/PopularPage';
import FavoritePage from '../page/FavoritePage';
import TrendingPage from '../page/TrendingPage';
import MyPage from '../page/MyPage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import NavigationUtil from '../navigator/NavigationUtil';
import { BottomTabBar } from 'react-navigation-tabs';
import { connect} from 'react-redux';

type Props = {};

const TABS = {
  PopularPage:{
    screen: PopularPage,
    navigationOptions:{
      tabBarLabel: '最热',
      tabBarIcon:({tintColor, focused})=>(
        <Ionicons name={'ios-people'} size={26} style={{color: tintColor}}/>
      )
    }
  },
  FavoritePage:{
    screen: FavoritePage,
    navigationOptions:{
      tabBarLabel: '收藏',
      tabBarIcon:({tintColor, focused})=>(
        <Ionicons name={'ios-heart'} size={26} style={{color: tintColor}}/>
      )
    }
  },
  TrendingPage:{
    screen: TrendingPage,
    navigationOptions:{
      tabBarLabel: '趋势',
      tabBarIcon:({tintColor, focused})=>(
        <Ionicons name={'ios-trending-up'} size={26} style={{color: tintColor}}/>
      )
    }
  },
  MyPage:{
    screen: MyPage,
    navigationOptions:{
      tabBarLabel: '我的',
      tabBarIcon:({tintColor, focused})=>(
        <Ionicons name={'ios-aperture'} size={26} style={{color: tintColor}}/>
      )
    }
  }
}
class DynamicTabNavigator extends Component<Props> {
    constructor(props){
        super(props);
        console.disableYellowBox = true;
    }
  _tabNavigator(){
    const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage}; // 根据需要定制显示的tab
    PopularPage.navigationOptions.tabBarLabel = '最新';
    return createBottomTabNavigator(tabs,{
      tabBarComponent: props=>{
        return <TabBarComponent theme={this.props.theme} {...props} />
      }
    })
  }
  render() {
    NavigationUtil.navigation = this.props.navigation;
    const Tab = createAppContainer(this._tabNavigator());
    return <Tab />
  }
}

class TabBarComponent extends Component{
  constructor(props){
    super(props);
    this.theme = {
      tintColor: props.activeTintColor,
      updateTime: new Date().getTime(),
    }
  }
  render (){
    const { routes, index } = this.props.navigation.state;
      if(routes[index].params){
        // 以最新的更新时间为主
        const {theme} = routes[index].params;
        if(theme&&theme.updateTime>this.theme.updateTime){
          this.theme = theme;
        }
      }
    return(
      <BottomTabBar 
        {...this.props}
        activeTintColor={this.theme.tintColor||this.props.activeTintColor}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme.theme,
})

export default connect(mapStateToProps)(DynamicTabNavigator);

