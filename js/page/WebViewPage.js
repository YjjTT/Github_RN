import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  WebView,
  DeviceInfo
} from "react-native";
import NavigationBar from "../common/NavigationBar";
import ViewUtil from "../util/ViewUtil";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import NavigationUtil from "../navigator/NavigationUtil";
import BackPressComponent from "../common/BackPressComponent";
import FavoriteDao from "../expand/dao/FavoriteDao";

type Props = {};
export default class WebViewPage extends Component<Props> {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
    const { title, url } = this.params;
    this.state = {
      title: title,
      url: url,
      canGoBack: false // 是否可以返回上一页
    };
    this.backPress = new BackPressComponent({
      backPress: () => this.onBackPress()
    });
  }
  componentDidMount() {
    this.backPress.componentDidMount();
  }
  componentWillUnmount() {
    this.backPress.componentWillUnmount();
  }
  onBackPress() {
    this.onBack();
    return true;
  }
  onBack() {
    if (this.state.canGoBack) {
      this.webView.goBack();
    } else {
      NavigationUtil.goBack(this.props.navigation);
    }
  }

  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url
    });
  }
  render() {
    const titleLayoutStyle =
      this.state.title.length > 20 ? { paddingRight: 30 } : null;
    let navigationBar = (
      <NavigationBar
        title={this.state.title}
        style={{ backgroundColor: "#678" }}
        leftButton={ViewUtil.getLeftBackButton(()=>this.onBackPress())}
      />
    );
    return (
      <View style={styles.container}>
        {navigationBar}
        <WebView
          ref={webView => (this.webView = webView)}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: this.state.url }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  }
});
