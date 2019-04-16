import Types from "../types";
import DataStore, { FLAG_STORAGE } from "../../expand/dao/DataStore";
import { _projectModels, handleData } from "../ActionUtil";
import FavoriteDao from "../../expand/dao/FavoriteDao";
import ProjectModel from "../../model/ProjectModel";

/**
 * 加载收藏的项目
 * @param {标识} flag
 * @param {是否显示loading} isShowLoading
 */
export function OnLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({ type: Types.FAVORITE_LOAD_DATA, storeName: flag });
    }
    let dataStore = new DataStore();
    new FavoriteDao(flag)
      .getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0; i < items.length; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag
        });
      })
      .catch(e => {
        dispatch({
          type: Types.FAVORITE_LOAD_FAIL,
          error: e,
          storeName: flag
        });
      });
  };
}
