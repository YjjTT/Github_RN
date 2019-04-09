import Types from '../types';
/**
 * 获取最热数据的异步action
 * @param {*} storeName 
 * @param {*} url 
 */
export default function onLoadPopularData(storeName, url){
    return dispatch=>{
        dispatch({type: Types.POPULAT_REFRESH, storeName: storeName})
    }
}