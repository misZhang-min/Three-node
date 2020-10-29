/**
 * 数据模型类
 */
import { actions } from "mirrorx";
// 引入services，如不需要接口请求可不写
import * as api from "./service";
// 引入工具方法
import { processData, getPowerBtn, Danger } from 'utils';
// import { changeCheckboxBoo } from "../../../../../../../ucf-common/src/utils";
import { changeCheckboxBoo, changeCheckboxYN } from "utils";

const initTable = {
  list: [],
  pageIndex: 1,
  pageSize: 10,
  totalPages: 0,
  total: 0,
}
export default {
  // 确定 Store 中的数据模型作用域
  name: "mps627",
  // 设置当前 Model 所需的初始化 state
  initialState: {
    showLoading: false,    // 页面加载动画
    queryObj: {            // 表格初始化数据
      ...initTable
    },
    powerBtns: [],         // 按钮权限
    detailObj: {},         // 详情数据 
  },
  reducers: {
    /**
     * 纯函数，相当于 Redux 中的 Reducer，只负责对数据的更新。
     * @param {*} state
     * @param {*} data  
     */
    updateState(state, data) { //更新state
      return {
        ...state,
        ...data
      };
    }
  },
  
  effects: { 
    /**
         * 加载列表数据
         * @param {*} param
         * @param {*} getState
         */
    async loadData(params, getState) {
      actions.mps627.updateState({ showLoading: true }); 
      let { result } = processData(await api.getList(params));
      if(!result.data.sucess) {
        Danger(result.data.message)
        return ;
      }
      let data = result.data;
      let queryObj = { ...initTable }; 
      if (data && data.content) {
        queryObj = {
          total: data.totalElements,
          totalPage: data.totalPages,
          pageSize: data.size,
          pageIndex: params.pageIndex,
          list: data.content,
        }
      }
      actions.mps627.updateState({ showLoading: false, queryObj });
    },
    /**
     * 发送消息
     * @param {} params
     */
    async getSendMsg(params) {
      actions.mps627.updateState({ showLoading: true });
      processData(await api.sendMsg(params), '发送成功');
      actions.mps627.updateState({ showLoading: false });
    },

    /**
     * 按钮权限
     * @param {} params
    */
    async getPower(params) {
      const { result } = processData(await getPowerBtn(params));
      if (result.data && result.data.authperm) {
        actions.mps627.updateState({
          powerBtns: result.data.authperm
        })
      }
    },  
  }
};
