/**
 * 整个应用的入口，包含路由，数据管理加载
 */

import React from "react";
import mirror, { render, Router } from "mirrorx";
import Routes from './routes'

// 全局样式
import 'styles/ac-theme.less';
import 'ac-header/build/AcHeader.css';
import 'ac-btns/build/Btns.css';
import 'ac-tips/build/AcTips.css';
import 'ac-datepicker/build/Datepicker.css';
import 'ac-search-cn/build/AcSearchPanel.css';
import 'ac-split-area/build/SplitArea.css';
import 'ac-form-layout/build/FormLayout.css';
import 'ac-gridcn/build/Gridcn.css';
import 'bee-modal/build/Modal.css';

import "./app.less";
mirror.defaults({
  historyMode: "hash"
});

render(<Router>
    <Routes />
  </Router>, document.querySelector("#app"));
