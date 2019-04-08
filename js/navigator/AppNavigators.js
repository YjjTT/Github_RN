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
    }
});

const RootNavigator = createSwitchNavigator({
        Init: InitNavigator,
        Main: MainNavigator,
})
const middleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav
)

const App = createReduxContainer(RootNavigator, 'root');


const mapStateToProps = (state) => ({
    state: state.nav,
})

export default connect(mapStateToProps)(App);