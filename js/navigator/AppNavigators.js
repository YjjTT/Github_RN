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
import FetchDemoPage from '../page/FetchDemoPage';
import AsyncStorageDemoPage from '../page/AsyncStorageDemoPage'
import DataStoreDemoPage from '../page/DataStoreDemoPage'
import { connect } from 'react-redux';
import {createReactNavigationReduxMiddleware, createReduxContainer, createNavigationReducer,reduxifyNavigator } from 'react-navigation-redux-helpers'

export const rootCom = 'Init';

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
    },
    FetchDemoPage:{
        screen: FetchDemoPage,
        navigationOptions:{
            title: 'Fetch'
        }
    },
    AsyncStorageDemoPage:{
        screen: AsyncStorageDemoPage,
        navigationOptions:{
            title: 'AsyncStorage'
        }
    },
    DataStoreDemoPage:{
        screen: DataStoreDemoPage,
        navigationOptions:{
            title: 'DataStoreDemoPage'
        }
    }
});

export const RootNavigator = createSwitchNavigator({
        Init: InitNavigator,
        Main: MainNavigator,
},{ initialRouteName: 'Init'})

export const middleware = createReactNavigationReduxMiddleware(
    state => state.nav,
    "root",
)

const App = createReduxContainer(RootNavigator, "root");


const mapStateToProps = (state) => ({
    state: state.nav,
})

export default connect(mapStateToProps)(App);