import {Platform, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons' 
import React, { Component } from 'react'

export default class ViewUtil {
  /**
   * 获取左侧返回按钮
   * @param {*} callBack 
   */
  static getLeftBackButton(callBack){
    return <TouchableOpacity
            style={{padding: 8, paddingLeft: 12}}
            onPress={callBack}>
            <Ionicons
                name={'ios-arrow-back'}
                size={26}
                style={{color: 'white'}}/>
        </TouchableOpacity>
  }

  static getShareButton(callBack){
    return (
      <TouchableOpacity underlayColor={'transparent'} onPress={callBack}>
        <Ionicons name={'md-share'} size={20} style={{opacity: 0.9, marginRight: 10, color: 'white'}}/>
      </TouchableOpacity>
    )
  }
}