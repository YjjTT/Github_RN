import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";

type Props = {};
export default class MyPage extends Component<Props> {
  render() {
    return (
      <View style={styles.container}>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
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
