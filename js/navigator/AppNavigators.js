import {
  createStackNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createMaterialTopTabNavigator
} from "react-navigation";
import React from 'react';
import HomePage from '../page/HomePage';
import DetailPage from '../page/DetailPage';
import Welcome from '../page/Welcome';

const InitNavigator = createStackNavigator({
    Welcome:{
        screen: Welcome,
        navigationOptions:{
            header: null
        }
    }
});

const MainNavigator = createStackNavigator({
    HomePage:{
        screen: HomePage,
        navigationOptions:{
            header: null
        }
    },
    DetailPage:{
        screen: DetailPage,
        navigationOptions:{
            title: '详情'
        }
    }
});

export default createSwitchNavigator(
    {
        Init: InitNavigator,
        Main: MainNavigator,
    },
    {
        initialRouteName: 'Init'
    }
)