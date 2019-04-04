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


type Props = {};
export default class DynamicTabNavigator extends Component<Props> {
    constructor(props){
        super(props);
        console.disableYellowBox = true;
    }
  _tabNavigator(){
    return createBottomTabNavigator({
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
    },{
      tabBarOptions: {
        activeTintColor: Platform.OS === 'ios' ? '#e91e63' : '#fff',
      }
    })
  }
  render() {
    NavigationUtil.navigation = this.props.navigation;
    const Tab = createAppContainer(this._tabNavigator());
    return <Tab />
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
