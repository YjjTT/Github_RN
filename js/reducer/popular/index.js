import Types from "../../action/types";

const defaultState = {};

/**
 * popular{
 *   java:{
 *      items:[],
 *      isLoading: false
 *   },
 *   ios:{
 *      items:[],
 *      isLoading: false
 *   }
 * }
 * state树, 横向扩展
 * 如果动态的设置store, 和动态获取store(难点: store key不固定)
 * @param {state} state
 * @param {action} action
 */
export default function OnAction(state = defaultState, action) {
  switch (action.type) {
    case Types.LOAD_POPULAT_SUCCESS:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          items: action.items,
          isLoading: false
        }
      };
    case Types.POPULAT_REFRESH:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          isLoading: true
        }
      };
    case Types.LOAD_POPULAT_FAIL:
      return {
        ...state,
        [action.storeName]: {
          ...[action.storeName],
          isLoading: false
        }
      };
    default:
      return state;
  }
}
