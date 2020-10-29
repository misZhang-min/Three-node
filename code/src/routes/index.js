/**
 * 前端路由说明：
 * 1、基于浏览器 History 的前端 Hash 路由
 */
import React from "react";
import mirror, { Route, connect } from 'mirrorx';
// 页面组件引入  
import MPS62701 from './MPS62701';
// 数据模型引入
import model from './model'
// 数据和组件UI关联、绑定
mirror.model(model);

const MPS62701Container = connect(state => state.mps627)(MPS62701); 

export default () => {
  return (
    <div className="route-content" style={{ 'height': '100%' }}>
      <Route exact path="/" component={MPS62701Container} /> 
    </div>
  )
}
