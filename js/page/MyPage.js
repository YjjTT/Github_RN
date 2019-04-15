import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button, TouchableOpacity,DeviceInfo } from "react-native";
import NavigationBar from '../common/NavigationBar'
import Feather from 'react-native-vector-icons/Feather'
import Ionicons from 'react-native-vector-icons/Ionicons' 
import NavigationUtil from '../navigator/NavigationUtil'
const THEME_COLOR = '#678';

type Props = {};
export default class MyPage extends Component<Props> {
  getRightButton(){
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={()=>{

        }}>
          <View style={{padding: 5, marginRight: 8}}>
            <Feather name={'search'} size={24} style={{color: 'white'}}/>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  getLeftButton(callBack){
    return (
      <TouchableOpacity style={{padding: 8, paddingLeft: 12}} onPress={callBack}>
        <Ionicons name={'ios-arrow-back'} size={26} style={{color: 'white'}}/>
      </TouchableOpacity>
    )
  }
  render() {
    let statusBar = {
      backgroundColor: '#678',
      barStyle: 'light-content'
    }
    let navigationBar = 
      <NavigationBar 
        title={'我的'} 
        statusBar={statusBar} 
        style={{backgroundColor: THEME_COLOR}} 
        rightButton={this.getRightButton()} 
        leftButton={this.getLeftButton()}
      />
    return (
      <View style={styles.container}>
      {navigationBar}
        <Text style={styles.welcome}>MyPage</Text>
        <Text
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              "DetailPage"
            );
          }}
        >
          跳转到详情页
        </Text>
        <Button
          title="Fetch使用"
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              "FetchDemoPage"
            );
          }}
        />
        <Button
          title="AsyncStorage使用"
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              "AsyncStorageDemoPage"
            );
          }}
        />
        <Button
          title="DataStore使用"
          onPress={() => {
            NavigationUtil.goPage(
              {navigation: this.props.navigation},
              "DataStoreDemoPage"
            );
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
