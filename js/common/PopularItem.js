import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image
} from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import BaseItem from "./BaseItem";

export default class PopularItem extends BaseItem {
  render() {
    const { projectModel } = this.props;
    const item = projectModel;
    if (!item || !item.owner) return null;
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.cell_container}>
          <Text style={styles.title}>{item.full_name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <View style={styles.row}>
            <View style={styles.row}>
              <Text>Author:</Text>
              <Image
                style={{ height: 22, width: 22 }}
                source={{ uri: item.owner.avatar_url }}
              />
            </View>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text>Start:</Text>
              <Text>{item.stargazers_count}</Text>
            </View>
            {this._favoriteIcon()}
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}
const styles = StyleSheet.create({
  row: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center"
  },
  cell_container: {
    backgroundColor: "white",
    padding: 10,
    marginLeft: 5,
    marginRight: 5,
    marginVertical: 3,
    borderColor: "#dddddd",
    borderWidth: 0.5,
    borderRadius: 2,
    shadowColor: "gray",
    shadowOffset: { width: 0.5, height: 0.5 },
    shadowRadius: 1,
    shadowOpacity: 0.4,
    elevation: 2 // Android
  },
  title: {
    fontSize: 16,
    marginBottom: 2,
    color: "#212121"
  },
  description: {
    fontSize: 14,
    marginBottom: 2,
    color: "#212121"
  }
});
