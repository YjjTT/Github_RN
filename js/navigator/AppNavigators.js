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
import WebViewPage from '../page/WebViewPage'
import AboutPage from '../page/about/AboutPage'
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
            header: null,
        }
    },
    WebViewPage:{
        screen: WebViewPage,
        navigationOptions:{
            header: null,
        }
    },
    AboutPage:{
        screen: AboutPage,
        navigationOptions:{
            header: null,
        }
    },
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