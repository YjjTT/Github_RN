/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import { Provider } from 'react-redux';
import AppNavigators from './navigator/AppNavigators';
import store from './store';

type Props = {};
export default class App extends Component<Props> {
  render() {
   /**
    * 将store传给App框架
    */
   return (
     <Provider store={store}>
      <AppNavigators />
     </Provider>
   )
  }
}
