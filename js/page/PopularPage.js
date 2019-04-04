import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { createMaterialTopTabNavigator, createAppContainer } from 'react-navigation'
import FavoritePage from './FavoritePage';
import TrendingPage from './TrendingPage';
import NavigationUtil from '../navigator/NavigationUtil'
type Props = {};

export default class PopularPage extends Component<Props> {
  
  _topBarNavigator (){
    return createMaterialTopTabNavigator(this._genTabs(), {
      tabBarOptions:{
        tabStyle: StyleSheet.tabStyle,
        upperCaseLabel: false, // 是否标签大写
        scrollEnabled: true,
        style:{
          backgroundColor: '#678',
        },
        indicatorStyle: styles.indicatorStyle,
        labelStyle: styles.labelStyle,
      }
    })
  }
  _genTabs(){
    const tabs = {};
    this.tabNames.forEach((item, index)=>{
      tabs[`tab${index}`]={
        // screen: PopularTab,
        screen: (props)=>(<PopularTab {...props} tabBarLabel={item} />),
        navigationOptions:{
          title: item
        }
      }
    })
    return tabs;
  }
  constructor(props){
    super(props);
    console.disableYellowBox = true;
    this.tabNames = ['Java', 'Android', 'iOS', 'React', 'React Native', 'Vue'];
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

const styles = StyleSheet.create({
  tabStyle:{
    minWidth: 50
  },
  indicatorStyle:{
    height: 2,
    backgroundColor: 'white'
  },
  labelStyle:{
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6,
  }
})