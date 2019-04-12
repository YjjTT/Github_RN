/*
 * @Author: yjjtt 
 * @Date: 2019-04-09 15:59:47 
 * @Last Modified by: yjjtt
 * @Last Modified time: 2019-04-12 10:17:25
 */
import {AsyncStorage} from 'react-native'
import Trending from 'GitHubTrending'
export const FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending'};
export default class DataStore{
  /**
   * 获取数据, 先获取本地数据(不为null并且时间在有效期之内),失败则获取网络数据
   * @param {key} url 
   * @param {flag} flag
   * @returns {Promise}
   */
  fetchData(url, flag){
    return(
      new Promise((resolve, reject)=>{
        this.fetchLocalData(url).then((wrapData)=>{
          if(wrapData && DataStore.checkTimestampValid(wrapData.timestamp)){
            resolve(wrapData);
          }else{
            this.fetchNetData(url, flag).then((data)=>{
              resolve(this._wrapData(data));
            }).catch((e)=>{
              reject(e)
            })
          }
        }).catch((e)=>{
          this.fetchNetData(url, flag).then((data)=>{
            resolve(this._wrapData(data));
          }).catch((e)=>{
            reject(e)
          })
        })
      })
    )
  }

  /**
   * 保存数据
   * @param {KEY} url 
   * @param {DATA} data 
   * @param {回调函数} callback 
   */
  saveData(url, data, callback){
    if(!data || !url) return;
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data), callback))
  }
  _wrapData(data){
    return {data: data, timestamp: new Date().getTime()};
  }
  /**
   * 获取本地数据
   * @param {key} url 
   * @returns {Promise}
   */
  fetchLocalData(url){
    return (
      new Promise((resolve, reject) =>{
        AsyncStorage.getItem(url, (error, result)=>{
          if(!error){
            try{
              resolve(JSON.parse(result));
            }catch(e){
              reject(e);
              console.log(e);
            }
          }else{
            reject(error);
            console.log(error);
          }
        })
      })
    )
  }
  /**
   * 获取网络数据
   * @param {key} url
   * @returns {Promise} 
   */
  fetchNetData(url, flag){
    return new Promise((resolve, reject)=>{
      if(flag !== FLAG_STORAGE.flag_trending){
        fetch(url).then((response)=>{
          if(response.ok){
            return response.json();
          }
          throw new Error('error');
        }).then((responseText)=>{
          this.saveData(url, responseText)
          resolve(responseText)
        })
        .catch((error)=>{
          reject(error);
        })
      }else{
        new Trending().fetchTrending(url).then(items=>{
          if(!items){
            throw new Error('response is null');
          }
          this.saveData(url, items);
          resolve(items);
        }).catch(error=>{
          reject(error);
        })
      }
      
    })
  }

  /**
   * 检查timestamp是否在有效期内
   * @param {项目更新时间} timestamp 
   * @returns {boolean} true 不需要更新, false 需要更新
   */
  static checkTimestampValid(timestamp){
    const currentDate = new Date()
    const targetDate = new Date()
    targetDate.setTime(timestamp)
    if(currentDate.getMonth() !== targetDate.getMonth()) return false
    if(currentDate.getDate() !== targetDate.getDate()) return false
    if(currentDate.getHours() - targetDate.getHours() > 4) return false
    return true
  }
}