import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, FlatList, RefreshControl } from "react-native";
import {
  createMaterialTopTabNavigator,
  createAppContainer
} from "react-navigation";
import {connect} from 'react-redux'
import actions from '../action/index'
import NavigationUtil from "../navigator/NavigationUtil";

const URL = 'https://api.github.com/search/repositories?q=';
const QUERY_STR = '&sort=stars';
type Props = {};
export default class PopularPage extends Component<Props> {
  _topBarNavigator() {
    return createMaterialTopTabNavigator(this._genTabs(), {
      tabBarOptions: {
        tabStyle: StyleSheet.tabStyle,
        upperCaseLabel: false, // 是否标签大写
        scrollEnabled: true,
        style: {
          backgroundColor: "#678"
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
    const TopNav = createAppContainer(this._topBarNavigator());
    return (
      <View style={{ flex: 1, marginTop: 30 }}>
        <TopNav />
      </View>
    );
  }
}

class PopularTab extends Component<Props> {
  constructor(props){
    super(props);
    const { tabBarLabel } = this.props;
    this.storeName = tabBarLabel;
  }
  componentDidMount(){
    this.loadData();
  }
  loadData(){
    const { onLoadPopularData } = this.props;
    const url = this.genFetchUrl(this.storeName);
    onLoadPopularData(this.storeName, url);
  }
  genFetchUrl(key){
    return URL + key + QUERY_STR;
  }
  renderItem(data){
    const item = data.item;
    return <View style={{marginBottom: 10}}>
      <Text>{JSON.stringify(item)}</Text>
    </View>
  }
  render() {
    const { popular,tabBarLabel } = this.props;
    let store = popular[this.storeName]; // 动态获取state
    if(!store){
      store={
        items: [],
        isLoading: false
      }
    }
    return (
      <View>
        <Text style={{ textAlign: "center" }}>{tabBarLabel}</Text>
        <FlatList 
          data={store.item}
          renderItem={data=>this.renderItem(data)}
          keyExtractor={item=>""+item.id}
          RefreshControl={
            <RefreshControl 
              title={'Loading'}
              titleColor={'red'}
              colors={['red']}
              refreshind={store.isLoading}
              onRefresh={()=>this.loadData()}
              tintColor={'red'}
            />
          }
        />
      </View>
    );
  }
}

const mapState = (state) => ({
  popular: state.popular
})
const mapDispatch = (dispatch) => ({
  onLoadPopularData: (storeName, url) => dispatch(actions.onLoadPopularData(storeName, url))
})
const PopularTabPage = connect(mapState, mapDispatch)(PopularTab)

const styles = StyleSheet.create({
  tabStyle: {
    minWidth: 50
  },
  indicatorStyle: {
    height: 2,
    backgroundColor: "white"
  },
  labelStyle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 6
  }
});
