import Types from '../types';
import DataStore from '../../expand/dao/DataStore'

/**
 * 获取最热数据的异步action
 * @param {*} storeName 
 * @param {*} url 
 * @param {每页显示多少} pageSize
 */
export function onRefreshPopular(storeName, url, pageSize){
    return dispatch=>{
        dispatch({
            type: Types.POPULAR_REFRESH, 
            storeName: storeName,
        })
        let dataStore = new DataStore()
        dataStore.fetchData(url).then(data=>{
            handleData(dispatch, storeName, data, pageSize)
        }).catch(error=>{
            console.log(error);
            dispatch({
                type: Types.POPULAR_REFRESH_FAIL, 
                storeName,
                error
            })
        })
    }
}
function handleData(dispatch, storeName, data, pageSize){
    let fixItems = [];
    if(data&&data.data){
        fixItems = data.data.items;
    }
    dispatch({
        type: Types.POPULAR_REFRESH_SUCCESS,
        projectModes: pageSize> fixItems.length ? fixItems : fixItems.slice(0, pageSize), // 第一次要加载的数据
        storeName,
        pageIndex: 1,
        items: fixItems,
    })
}
/**
 * 
 * @param {*} storeName
 * @param {第几页} pageIndex 
 * @param {每页显示多少数据} pageSize 
 * @param {原始数据} dataArray 
 * @param {回调函数} callback 
 */
export function onLoadMorePopular(storeName, pageIndex, pageSize, dataArray=[], callback){
    return dispatch=>{
        setTimeout(()=>{ // 模拟网络请求
            if((pageIndex-1)*pageSize >= dataArray.length){ // 已加载玩全部数据
                if(typeof callback === 'function'){
                    callback('no more')
                }
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })
            }else{
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
                dispatch({
                    type: Types.POPULAR_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max)
                })
            }
        }, 500)
    }
}