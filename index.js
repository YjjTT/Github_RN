/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Welcome from './js/page/Welcome'
import AppNavigators from './js/navigator/AppNavigators'
import { createAppContainer } from 'react-navigation'

const AppStackNavigatorContainer = createAppContainer(AppNavigators)

AppRegistry.registerComponent(appName, () => AppStackNavigatorContainer);
