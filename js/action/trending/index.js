import Types from '../types';
import DataStore, { FLAG_STORAGE } from '../../expand/dao/DataStore'
import {handleData} from '../ActionUtil'
/**
 * 获取最热数据的异步action
 * @param {*} storeName 
 * @param {*} url 
 * @param {每页显示多少} pageSize
 */
export function onRefreshTrending(storeName, url, pageSize){
    return dispatch=>{
        dispatch({
            type: Types.TRENDING_REFRESH, 
            storeName: storeName,
        })
        let dataStore = new DataStore()
        dataStore.fetchData(url, FLAG_STORAGE.flag_trending).then(data=>{
            handleData(Types.TRENDING_REFRESH_SUCCESS,dispatch, storeName, data, pageSize)
        }).catch(error=>{
            console.log(error);
            dispatch({
                type: Types.TRENDING_REFRESH_FAIL, 
                storeName,
                error
            })
        })
    }
}
/**
 * 
 * @param {*} storeName
 * @param {第几页} pageIndex 
 * @param {每页显示多少数据} pageSize 
 * @param {原始数据} dataArray 
 * @param {回调函数} callback 
 */
export function onLoadMoreTrending(storeName, pageIndex, pageSize, dataArray=[], callback){
    return dispatch=>{
        setTimeout(()=>{ // 模拟网络请求
            if((pageIndex-1)*pageSize >= dataArray.length){ // 已加载玩全部数据
                if(typeof callback === 'function'){
                    callback('no more')
                }
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_FAIL,
                    error: 'no more',
                    storeName: storeName,
                    pageIndex: --pageIndex,
                })
            }else{
                let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageIndex * pageSize
                dispatch({
                    type: Types.TRENDING_LOAD_MORE_SUCCESS,
                    storeName,
                    pageIndex,
                    projectModes: dataArray.slice(0, max)
                })
            }
        }, 500)
    }
}