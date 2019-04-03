import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import FavoritePage from './FavoritePage';
import TrendingPage from './TrendingPage';
import NavigationUtil from '../navigator/NavigationUtil'
type Props = {};

export default class PopularPage extends Component<Props> {
  _topBarNavigator (){
    return createMaterialTopTabNavigator({
      PopularTab1:{
        screen: PopularTab,
        navigationOptions:{
          title: 'Tab1'
        }
      },
      PopularTab2:{
        screen: PopularTab,
        navigationOptions:{
          title: 'Tab2'
        }
      }
    })
  }
  render() {
    const TopNav = createAppContainer(this._topBarNavigator())
    return <View style={{flex:1, marginTop: 30}}>
      <TopNav />
    </View>
  }
}

class PopularTab extends Component<Props>{
  render(){
    const { tabBarLabel } = this.props;
    return (
      <View>
        <Text style={{textAlign:'center'}}>{tabBarLabel}</Text>
        <Text onPress={()=>{
          NavigationUtil.goPage({
            navigation: this.props.navigation
          }, 'DetailPage')
        }}>跳转到详情页</Text>
      </View>
    )
  }
}