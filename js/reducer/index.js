import {combineReducers} from 'redux';
import theme from './theme'
import popular from './popular'
import trending from './trending'
import favorite from './favorite'
import { rootCom, RootNavigator } from '../navigator/AppNavigators';

/**
 * 指定默认state
 */
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(rootCom));

/**
 * 创建自己的navigation reducer
 * @param {} state 
 * @param {} action 
 */
const navReducer = (state = navState, action) => {
    const nextState = RootNavigator.router.getStateForAction(action, state);
    // 如果`nextState`为null或未定义，只需返回原始`state`
    return nextState || state;
};

const index = combineReducers({
    nav: navReducer,
    theme: theme,
    popular: popular,
    trending: trending,
    favorite: favorite,
})

export default index;