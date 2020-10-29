/**
 * 服务请求类
 */
import request from "utils/request";
//定义接口地址
const URL = {
  // 获取表格数据
  "GET_LIST": `${pom.fe.new.ctx}/mps627/list`,
  "getUserAuth": `${pom.fe.new.ctx}/mps001/getUserAuth`
}
/**
* 获取列表数据
* @param {*} data
*/
export const getList = data => {
  return request(URL.GET_LIST, {
    method: "post",
    data
  });
}
/*
* 监控台携带数据
* @param {*} data
*/
export const getUserAuth = data => {
  return request(URL.getUserAuth, {
    method: "post",
    data
  });
}
export const urls = URL
  