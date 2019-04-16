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
import EventBus from 'react-native-event-bus'
import EventTypes from '../util/EventTypes'

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
    if(this.Tabs){
      return this.Tabs
    }
    const { PopularPage, TrendingPage, FavoritePage, MyPage } = TABS;
    const tabs = {PopularPage, TrendingPage, FavoritePage, MyPage}; // 根据需要定制显示的tab
    PopularPage.navigationOptions.tabBarLabel = '最新';
    return this.Tabs = createBottomTabNavigator(tabs,{
      tabBarComponent: props=>{
        return <TabBarComponent theme={this.props.theme} {...props} />
      }
    })
  }
  render() {
    NavigationUtil.navigation = this.props.navigation;
    const Tab = createAppContainer(this._tabNavigator());
    return <Tab  onNavigationStateChange={(prevState, newState, action)=>{
      EventBus.getInstance().fireEvent(EventTypes.bottom_tab_select, {
        from: prevState.index,
        to: newState.index,
      })
    }}/>
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
    return(
      <BottomTabBar 
        {...this.props}
        activeTintColor={this.props.theme}
      />
    )
  }
}

const mapStateToProps = (state) => ({
  theme: state.theme.theme,
})

export default connect(mapStateToProps)(DynamicTabNavigator);

