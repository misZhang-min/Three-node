
import React, { Component } from "react";
import { Form, Select } from 'tinper-bee';
import DatePicker from "bee-datepicker";
import FormLayout from 'ac-form-layout';
import SearchPanel from 'ac-search-cn';
import {
    RefCheckboxTable,  // 表格多选参照
    RefRadioTable      // 表格单选参照
} from 'qm-search-help';
import './index.less';
import 'qm-search-help/dist/index.css';   // 参照样式
const Options = Select.Option;
const { FormItem, FormRow } = FormLayout;
const layoutOpt = {
    lg: 3,
    md: 4,
    sm: 6,
    xs: 12
}
class SearchArea extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    componentDidMount() {
        this.props.onRef(this);// 在父组件上绑定子组件方法
    }
    /**
     * 表单内容重置
     */
    searchReset = () => {
        this.props.form.resetFields(); // 表单重置
    }
    /**
     * 搜索面板查询
     */
    handleSearch = (e) => {
        e.preventDefault();
        this.props.onSearch(); // 父组件查询方法
    };
    /**
     * 获取表单数据，将其转换成后端要用的数据格式
     */
    getSearchValue = () => {
        let param = {};
        this.props.form.validateFields((err, values) => {
            for (const key in values) {
                if (values[key]) { // 对空数据过滤
                    param[key] = values[key];
                }

            }
        });
        return param;
    }
    handleChangetwo = value => {
        console.log(`selected ${value}`);
    };

    render() {

        const { obj } = this.props;
        const { getFieldProps, getFieldError } = this.props.form;
        console.log(obj, 'obj');
        return (
            <SearchPanel
                search={this.handleSearch}
                reset={this.searchReset}
            >
                <FormLayout>
                    <FormRow>
                        <FormItem className="formItem" required={true} label="工厂：" {...layoutOpt} errorMsg={getFieldError('plant')}>
                            <RefRadioTable
                                placeholder="请输入工厂"
                                dataUrl={`${pom.fe.mdm.ctx}/factoryinfo/getfactoryinfo`} // 获取数据 url  参照用友 a1 示例
                                selectId={"plant"} // 选中id
                                selectName={["plant"]} // 选中显示属性
                                searchOption={["plant"]} //后端过滤字段
                                modalTitle={"工厂"} // 模态框标题
                                {...getFieldProps("plant", {
                                    initialValue: obj.plant !== undefined ? obj.plant : '',
                                    rules: [
                                        {
                                            message: "请选择工厂",
                                            required: true,
                                        },
                                    ],
                                })}
                                tableColumn={[
                                    {
                                        title: "工厂",
                                        dataIndex: "plant",
                                        key: "plant",
                                    },
                                    {
                                        title: "名称",
                                        dataIndex: "name1",
                                        key: "name1",
                                    },
                                ]} // 表格属性
                                searchItemList={[
                                    {
                                        key: "plant",
                                        title: "工厂：",
                                    },
                                ]} // 查询属性
                            />
                        </FormItem>
                        <FormItem label='需求明细版本号：' {...layoutOpt}>
                            <RefRadioTable
                                onChild={(ref) => (this.statusStartRadioTable = ref)}
                                desc='descrip'
                                dataUrl={`${pom.fe.new.ctx}/mps/searchHelpOMPSHeaderList`} // 获取数据 url  参照用友 a1 示例
                                selectId={'requireordno'} // 选中id
                                selectName={['requireordno']} // 选中显示属性
                                searchOption={['requireordno']} //后端过滤字段
                                modalTitle={'需求明细版本号'} // 模态框标题
                                {...getFieldProps('requireordno', {
                                    initialValue: '',
                                })}
                                tableColumn={[
                                    {
                                        title: "工厂",
                                        dataIndex: "plant",
                                        key: "plant"
                                    },
                                    {
                                        title: "需求明细版本号",
                                        dataIndex: "requireordno",
                                        key: "requireordno",
                                    },
                                ]} // 表格属性
                                searchItemList={[
                                    {
                                        key: "requireordno",
                                        title: "需求明细版本号：",
                                    },
                                ]} // 查询属性
                            />
                        </FormItem>
                        <FormItem style={{ zIndex: 999 }} label="日期：" {...layoutOpt}  >
                            <DatePicker
                                format="YYYY-MM-DD"
                                {
                                ...getFieldProps('timeone',
                                )}
                                placeholder={'请选择创建日期'}
                            />
                        </FormItem>
                        <FormItem className="zhi" label="至"  {...layoutOpt} >
                            <DatePicker
                                format="YYYY-MM-DD"
                                {
                                ...getFieldProps('timetwo',
                                )}
                                placeholder={'请选择创建日期'}
                            />
                        </FormItem>
                    </FormRow>
                    <FormRow>
                        <FormItem label="需求来源：" {...layoutOpt} required={true} errorMsg={getFieldError('mtlno')} >
                            <Select
                                className="everyDiv"
                                defaultValue=''
                                onChange={this.handleChangetwo}
                                showSearch={true}
                                allowClear={true}
                                {...getFieldProps('requirefrom', {
                                    validateTrigger: 'onBlur',
                                    initialValue: obj.requirefrom !== undefined ? obj.requirefrom : "",
                                })}
                            >
                                <Options value="1">OTD订单</Options>
                                <Options value="2">独立需求</Options>
                            </Select>
                        </FormItem>
                        <FormItem label='物料号：' {...layoutOpt}>
                            <RefCheckboxTable
                                onChild={ref => this.radioTable = ref}
                                dataUrl={`${pom.fe.mdm.ctx}/mdmgenmtl/getmdmgenmtl`} // 获取数据 url  参照用友 a1 示例
                                selectId={'mtlno'} // 选中id
                                selectName={['mtlno']} // 选中显示属性
                                searchOption={["mtlno"]} //后端过滤字段
                                modalTitle={'物料号'} // 模态框标题               
                                // <FormControl
                                placeholder="请输入物料号"
                                {...getFieldProps('mtlno', {
                                })}
                                // />
                                tableColumn={[
                                    {
                                        title: '物料号',
                                        dataIndex: 'mtlno',
                                        key: 'mtlno',
                                    }, {
                                        title: '物料描述',
                                        dataIndex: 'mtldes',
                                        key: 'mtldes',
                                    }, {
                                        title: '工厂',
                                        dataIndex: 'plant',
                                        key: 'plant',
                                    }, {
                                        title: '物料的删除标识',
                                        dataIndex: 'delflagforclientmtl',
                                        key: 'delflagforclientmtl',
                                    }
                                ]}  // 表格属性
                                searchItemList={[
                                    {
                                        key: 'mtlno',
                                        title: '物料号：',
                                    },
                                    {
                                        key: 'plant',
                                        title: '工厂：',
                                    }
                                ]}  // 查询属性
                            />
                        </FormItem>
                        <FormItem className="formItem" label="MRP范围：" {...layoutOpt} required={true} errorMsg={getFieldError('areamrp')} >
                            <RefRadioTable
                                placeholder="请输入MRP范围"
                                dataUrl={`${pom.fe.new.ctx}/mps/searchHelpMrpAreaList`} // 获取数据 url  参照用友 a1 示例
                                selectId={"areamrp"} // 选中id
                                selectName={["areamrp"]} // 选中显示属性
                                searchOption={["areamrp"]} //后端过滤字段
                                modalTitle={"MRP范围"} // 模态框标题
                                {...getFieldProps("areamrp", {
                                    initialValue: obj.areamrp !== undefined ? obj.areamrp : "",
                                    rules: [
                                        {
                                            message: "请选择MRP范围",
                                            required: true,
                                        },
                                    ],
                                })}
                                tableColumn={[
                                    {
                                        title: "MRP范围",
                                        dataIndex: "areamrp",
                                        key: "areamrp",
                                    },
                                    {
                                        title: "MRP范围文本",
                                        dataIndex: "mrpareatext",
                                        key: "mrpareatext",
                                    },
                                ]} // 表格属性
                                searchItemList={[
                                    {
                                        key: "areamrp",
                                        title: "MRP范围：",
                                    },
                                ]} // 查询属性
                            />
                        </FormItem>
                    </FormRow>
                </FormLayout>
            </SearchPanel>
        )
    }
}
export default Form.createForm()(SearchArea);
