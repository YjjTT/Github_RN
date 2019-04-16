import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  TouchableOpacity,
  DeviceInfo,
  ScrollView
} from "react-native";
import NavigationBar from "../common/NavigationBar";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import NavigationUtil from "../navigator/NavigationUtil";
import { MORE_MENU } from "../common/MORE_MENU";
import GlobalStyles from "../res/GlobalStyles";
import ViewUtil from "../util/ViewUtil";

const THEME_COLOR = "#678";

type Props = {};
export default class MyPage extends Component<Props> {
  onClick(menu) {
    let RouteName,
      params = {};
    switch (menu) {
      case MORE_MENU.Tutorial:
        RouteName = "WebViewPage";
        params.title = "教程";
        params.url = "https://www.github.com/yjjtt";
        break;
      case MORE_MENU.About:
        RouteName = 'AboutPage';
        break;
  }
  if (RouteName) {
    NavigationUtil.goPage(params, RouteName);
  }
}

  getItem(menu) {
    return ViewUtil.getMenuItem(() => this.onClick(menu), menu, THEME_COLOR);
  }
  render() {
    let statusBar = {
      backgroundColor: "#678",
      barStyle: "light-content"
    };
    let navigationBar = (
      <NavigationBar
        title={"我的"}
        statusBar={statusBar}
        style={{ backgroundColor: THEME_COLOR }}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <ScrollView>
          <TouchableOpacity
            onPress={() => this.onClick(MORE_MENU.About)}
            style={styles.item}
          >
            <View style={styles.about_left}>
              <Ionicons
                name={MORE_MENU.About.icon}
                size={40}
                style={{ marginRight: 10, color: THEME_COLOR }}
              />
              <Text>Github Popular</Text>
            </View>
            <Ionicons
              name={"ios-arrow-forward"}
              size={16}
              style={{
                marginRight: 10,
                alignSelf: "center",
                color: THEME_COLOR
              }}
            />
          </TouchableOpacity>
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Tutorial)}
          {/*趋势管理*/}
          <Text style={styles.groupTitle}>趋势管理</Text>
          {/*自定义语言*/}
          {this.getItem(MORE_MENU.Custom_Language)}
          {/*语言排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Language)}

          {/*最热管理*/}
          <Text style={styles.groupTitle}>最热管理</Text>
          {/*自定义标签*/}
          {this.getItem(MORE_MENU.Custom_Key)}
          {/*标签排序*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Sort_Key)}
          {/*标签移除*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.Remove_Key)}

          {/*设置*/}
          <Text style={styles.groupTitle}>设置</Text>
          {/*自定义主题*/}
          {this.getItem(MORE_MENU.Custom_Theme)}
          {/*关于作者*/}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.About_Author)}
          <View style={GlobalStyles.line} />
          {/*反馈*/}
          {this.getItem(MORE_MENU.Feedback)}
          <View style={GlobalStyles.line} />
          {this.getItem(MORE_MENU.CodePush)}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f4",
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
  about_left: {
    alignItems: "center",
    flexDirection: "row"
  },
  item: {
    backgroundColor: "white",
    padding: 10,
    height: 90,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row"
  },
  groupTitle: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 5,
    fontSize: 12,
    color: "gray"
  }
});
