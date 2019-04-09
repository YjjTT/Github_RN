import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducer';
import {middleware} from '../navigator/AppNavigators';

const middlewares = [
    middleware,
    thunk,
]

/**
 * 创建store
 */
export default createStore(reducers, applyMiddleware(...middlewares));