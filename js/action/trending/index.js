import Types from "../types";
import DataStore, { FLAG_STORAGE } from "../../expand/dao/DataStore";
import { handleData, _projectModels } from "../ActionUtil";

/**
 * 获取最热数据的异步action
 * @param {*} storeName
 * @param {*} url
 * @param {每页显示多少} pageSize
 */
export function onRefreshTrending(storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({
      type: Types.TRENDING_REFRESH,
      storeName: storeName
    });
    let dataStore = new DataStore();
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_trending)
      .then(data => {
        handleData(
          Types.TRENDING_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
          favoriteDao
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: Types.TRENDING_REFRESH_FAIL,
          storeName,
          error
        });
      });
  };
}
/**
 *
 * @param {*} storeName
 * @param {第几页} pageIndex
 * @param {每页显示多少数据} pageSize
 * @param {原始数据} dataArray
 * @param {回调函数} callback
 */
export function onLoadMoreTrending(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callback
) {
  return dispatch => {
    setTimeout(() => {
      // 模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        // 已加载玩全部数据
        if (typeof callback === "function") {
          callback("no more");
        }
        dispatch({
          type: Types.TRENDING_LOAD_MORE_FAIL,
          error: "no more",
          storeName: storeName,
          pageIndex: --pageIndex
        });
      } else {
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageIndex * pageSize;
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.TRENDING_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data
          });
        });
      }
    }, 500);
  };
}
/**
 * 刷新收藏状态
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onFlushTrendingFavorite(storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return dispatch => {
      //本次和载入的最大数量
      let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex;
      _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
              type: Types.FLUSH_TRENDING_FAVORITE,
              storeName,
              pageIndex,
              projectModels: data,
          })
      })
  }
}