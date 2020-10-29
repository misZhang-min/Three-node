import React, { Component } from 'react';
import { actions } from "mirrorx";
import moment from 'moment';
import {
  ButtonGroup,
  Loading,
} from "tinper-bee";
import AcHeader from "ac-header";
import { Grid } from 'ac-gridcn';
import AcTips from 'ac-tips';
import Modal from 'bee-modal';
import Btns from 'components/Btns';
import SearchArea from './Components/SearchArea';
import headIcon from 'static/images/headerIcon/ReportQuery/3.svg';
import { getQueryString, Danger } from 'utils';
import * as api  from "../service"
import './index.less';
const dataNumObj = {
  "5": 0,
  "10": 1,
  "15": 2,
  "20": 3,
  "25": 4,
  "50": 5,
  "1": 6,
}
let arrays = [];
const formatYearRule = "YYYY"; // 格式化年
class MPS627 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterable: false,
      showModal: false,
      record: {}, // 存储关联数据信息
      pageobjs: {
        pageSize: 10,
        pageIndex: 0
      },
      dataObj: {},
      datas: [],
      total: 0,
      obj: {}
    }
  }
  selectList = [];//选中的数据
  gridColumn = [ // tab 头
    {
      title: "物料号",
      dataIndex: "plant",
      key: 'plant',
    },
    {
      title: "需求日期",
      dataIndex: "tranres",
      key: 'tranres',
    },
    {
      title: "日期类型",
      dataIndex: "requirefrom",
      key: 'requirefrom',
    },
    {
      title: "需求数量",
      dataIndex: "mtlno",
      key: 'mtlno',
    },
    {
      title: "计量单位",
      dataIndex: "x_c",
      key: 'x_c',
    },
    {
      title: "处理日期",
      dataIndex: "mesno",
      key: 'mesno',
    },
    {
      title: "需求版本号",
      dataIndex: "errormes",
      key: 'errormes',
    },
  ];
  async componentDidMount() {
    let search = this.props.location.search;
    if(search.substring(1)) {
      let result =await api.getUserAuth({
        plant: search.substring(1)
      })
      this.setState({
        obj: result.data.res
      })
    }
    let serviceCode = getQueryString('serviceCode', window.location.href) || getQueryString('servicecode', window.location.href);
    actions.mps627.getPower({
      params: {
        servicecode: serviceCode
      },
      context: pom.fe.new.ctx
    })
  }


  /**
   * 搜索面板查询
   * 查询数据接口ii
   */
  onSearch =async () => {
    let { pageobjs } =this.state;
    let searchData = this.child.getSearchValue()
    if(searchData.plant) {
      let pageList = await api.getList({
        ...pageobjs,
        ...searchData
      })
      if(pageList && pageList.data.sucess == false) {
        Danger(pageList.data.message)
        return ;
      }
      if(pageList && pageList.data.res.length == 0) {
        Danger("没有查到数据")
        return ;
      }
      this.setState({
        dataObj: pageList,
        datas: pageList.data.res
      }) // 获取查询数据
    }
  };
  /**
   * 删除
   */
  onClickDelete = () => {
    if (this.selectList.length <= 0) {
      AcTips.create({
        type: 'Danger',
        content: "请先选择数据"
      });
      return;
    }

    Modal.confirm({
      title: '提示信息',
      keyword: '删除',
      content: "确定要删除吗?",
      onOk: this.confirmDeleteData,
      onCancel: () => {
        console.log('Cancel');
      },
      confirmType: 'two'
    })
  }
  confirmDeleteData = async () => {
    const { status } = await actions.mps627.delMore(this.selectList);
    if (status === 'success') {
      this.onLoadData(); // 重新获取表格数据
    }
  }
  /**
   * 列表选中行
   */
  getSelectedDataFunc = (selectData, record, index, newData) => {
    this.selectList = selectData;
  }
  /**
   * 点击分页
   */
  pageIndexChange =async (pageIndex) => {
    let searchData = this.child.getSearchValue()
    let { pageSize } = this.state.pageobjs;
    let pageList = await api.getList({
      pageIndex: pageIndex - 1,
      pageSize,
      plant: searchData.plant,
      tranres: searchData.tranres,
      sourceDemand: searchData.ddlx,
      areaMrp: searchData.otdordno,
    })
    this.setState({
      datas: pageList.data.content,
      pageobjs: {
        pageIndex: pageIndex,
        pageSize:  pageList.data.size
      },
      dataObj: pageList,
      total: pageList.data.totalElements
    })
  }

  /**
   * 点击改变每页容量
   */
  pageSizeChange =async (index, value) => {
    let { pageIndex } = this.state.pageobjs;
    let searchData = this.child.getSearchValue()
    let pageList = await api.getList({
      pageIndex,
      pageSize: value,
      plant: searchData.plant,
      tranres: searchData.tranres,
      sourceDemand: searchData.ddlx,
      areaMrp: searchData.otdordno,
    })
    this.setState({
      datas: pageList.data.content,
      pageobjs: {
        pageIndex: pageIndex,
        pageSize:  pageList.data.size
      },
      dataObj: pageList,
      total: pageList.data.totalElements
    })
  }
  /**
   *
   * 关联数据钻取
   * @param {object} record 关联数据行数据
   * @param {string} key menu菜单key值
   */
  onRelevance = (record, key) => {
    if (key === "code") {  // 弹出模态框
      this.setState({ record, showModal: true });
    }
    if (key === "year") {  // 跳转页面详情
      this.goDetailPage(2, record.id);
    }
  }
  goDetailPage = (btnFlag, id) => {
    actions.routing.push({
      pathname: '/allowanceDetail',
      search: `?btnFlag=${btnFlag}&id=${id}`
    });
  }
  /**
   * 关闭模态框
   */
  close = () => {
    this.setState({ showModal: false });
  }
  /**
   *
   *触发过滤输入操作以及下拉条件的回调
   * @param {string} key 过滤字段名称
   * @param {*} value 过滤字段值
   * @param {string} condition 过滤字段条件
   */
  onFilterChange = (key, value, condition) => {
    // 构造一个 map
    let tempObj = {};
    for (let item of this.whereParam) {
      tempObj[item.key] = item;
    }
    let formatValue = value;
    if (key === 'year') { // 年份格式化
      formatValue = moment(value).format(formatYearRule);
    }
    tempObj[key] = { key, value: formatValue, condition };
    // 拼接过滤条件
    let tempArray = [];
    for (let key in tempObj) {
      tempArray.push(tempObj[key]);
    }
    this.onLoadData({ whereParam: tempArray });
    this.setState({ filterable: true }); // 打开行过滤
    this.whereParam = tempArray; // 缓存过滤数据
  }
  /**
   * 清除过滤条件的回调函数，回调参数为清空的字段
   * @param {string} key 清除过滤字段
   */
  onFilterClear = (key) => {
    let tempObj = {};
    for (let item of this.whereParam) {
      if (item.key !== key) {
        tempObj[item.key] = item;
      }
    }
    // 拼接过滤条件
    let tempArray = [];
    for (let key in tempObj) {
      tempArray.push(tempObj[key]);
    }
    this.onLoadData({ whereParam: tempArray });
    this.setState({ filterable: true }); //  打开行过滤
    this.whereParam = tempArray; // 清空过滤数据
  }
  /**
   *
   * @param {Boolean} status 控制栏位的显示/隐藏
   */
  afterRowFilter = (status) => {
    // todo 关闭是否清空过滤条件 是否发送请求
    this.onLoadData({ whereParam: [] });
    this.whereParam = []; // 清空过滤数据
    this.setState({ filterable: status });
  }
  /**
   *
   *排序属性设置
   * @param {Array} sortParam 排序参数对象数组
   */
  sortFun = (sortParam) => {
    const { filterable } = this.state;
    let orderByParam = [];
    for (let item of sortParam) {//   转换成后端约定的数据格式
      const { order, field } = item;
      let value = order === 'ascend' ? 'ASC' : 'DESC'; // 约定 ASC 表示升序，DESC 表示降序
      orderByParam.push({ [field]: value });
    }
    this.onLoadData({ orderByParam });
    this.orderByParam = orderByParam;
    this.setState({ filterable }); //  缓存是否打开行过滤
  }


  /**
   * 加载列表数据
   * @param {*} param 查询信息
   */
  onLoadData = (param = {}) => {
    this.selectList = [];// 清空选中的数据
    const { queryObj } = this.props;
    let { pageSize, pageIndex } = queryObj; // 获取分页值
    let searchData = this.child.getSearchValue(); // 获取表单组件里的值
    let otherParam = { pageSize, pageIndex}; // 其他查询条件
    actions.mps627.loadData({ ...searchData, ...otherParam, ...param });  // 获取表格数据，如果传入的分页信息可以覆盖默认值
  }
  exportExcel = () => {
    this.grid.exportExcel();
  }
  onDataNumSelect=(index, value)=>{
  }


  render() {
    let { total, obj } = this.state;
    const { pageIndex, pageSize, list } = this.state.pageobjs;
    const { showLoading, powerBtns } = this.props;
    arrays && arrays.forEach(item => {
      if(item.requirefrom == '1') {
        item.requirefrom = "OTD订单"
      } 
      if(item.requirefrom == '2') {
        item.requirefrom = "独立需求"
      }
    })
    let paginationObj = {
      activePage: pageIndex,//当前页
      total,//总条数
      items: Math.ceil(total/pageSize), // 一页显示多少
      dataNum: dataNumObj[pageSize],// 分页条数选择
      freshData: this.pageIndexChange,//刷新数据
      onDataNumSelect: this.pageSizeChange, //每页大小改变触发的事件
      disabled: false//分页条禁用状态
    };
    const sortObj = {  //排序属性设置
      mode: 'multiple',
      backSource: true,
      sortFun: this.sortFun
    };
    return (
      <div className='single-query'>
        {/*页面加载动画*/}
        <Loading
          fullScreen
          showBackDrop={true}
          show={showLoading}
        />
        {/*页面导航条*/}
        <AcHeader icon={<img src={headIcon} />} title='查询BOM变更信息'>
          {/*添加 删除按钮组*/}
          <ButtonGroup>
            <Btns
              powerBtns={powerBtns}
              btns={{
                add: {
                  onClick: () => {
                    this.goDetailPage(0, '');
                  }
                },
                delete: {
                  onClick: this.onClickDelete,
                }

              }} />
          </ButtonGroup>
          {/*导出按钮*/}
          <Btns
            powerBtns={powerBtns}
            btns={{
              export: {
                onClick: this.exportExcel
              }
            }}
          />
        </AcHeader>

        {/*查询区域*/}
        <SearchArea
          onSearch={this.onSearch}
          onRef={ref => this.child = ref}
          obj={obj ? obj : {}}
        />

        {/*员工津贴表格*/}
        <Grid
          showRowNum = {{base: 1}}
          exportFileName={'订单信息'}
          ref={(el) => this.grid = el}
          rowKey={r => r.id ? r.id : r.key}
          columns={this.gridColumn}
          data={list}
          getSelectedDataFunc={this.getSelectedDataFunc}
          filterable={this.state.filterable}//是否开启过滤数据功能
          onFilterChange={this.onFilterChange}  // 触发过滤输入操作以及下拉条件的回调
          onFilterClear={this.onFilterClear} //清除过滤条件的回调函数，回调参数为清空的字段
          afterRowFilter={this.afterRowFilter} //控制栏位的显示/隐藏
          sort={sortObj} //排序属性设置
          paginationObj={paginationObj}//分页数据
          headerScroll={true} // 双向滚动条
          multiSelect={false}
          multiSelect={true}  // 多选框
          bordered = {false}
        />
      </div>
    )
  }
}

export default MPS627;

