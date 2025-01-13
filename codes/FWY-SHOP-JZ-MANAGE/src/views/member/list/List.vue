<template>
  <div class="member-list">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">会员名称: </span>
            <Input v-model="table.queryFilter.nickname" placeholder="请输入会员名称" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">手机号: </span>
            <Input v-model="table.queryFilter.phone" placeholder="请输入手机号" style="width: 190px;"></Input>
        </div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
		<div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
			<Button type="primary" @click="$router.push({ name: 'memberAdd' })">新增会员</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'memberEdit', params: { id: row.id } })">会员有效期</Button>
                <Button type="primary" size="small" style="margin-left: 10px;" @click="showInvestDialog(row.id)" >充值赠送</Button>
                <Button type="primary" size="small" style="margin-left: 10px;" @click="showLogDialog(row.id)" >消费记录查询</Button>
            </template>
        </Table>
        <Page :total="table.queryFilter.total" :page-size="table.queryFilter.pageSize" :current="table.queryFilter.pageNum" show-total @on-change="mofidyPageNum" />
	</div>

    <Modal v-model="dialog.invest.show" width="420" class-name="vertical-center-modal" :mask-closable="false">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>充值赠送</span>
        </p>
        <div style="text-align:center; padding-top: 20px;">
            <Form ref="investFormValidate" :model="dialog.invest.formValidate" :rules="dialog.invest.ruleValidate" :label-width="70">
                <FormItem label="充值金额" prop="investMoney" style="width: 100%">
                    <Input type="number" v-model="dialog.invest.formValidate.investMoney" placeholder="请输入充值金额"></Input>
                </FormItem>
                <FormItem label="赠送金额" prop="giveMoney" style="width: 100%">
                    <Input type="number" v-model="dialog.invest.formValidate.giveMoney" placeholder="请输入赠送金额"></Input>
                </FormItem>
                <FormItem label="赠送备注" prop="descript" style="width: 100%">
                    <Input v-model="dialog.invest.formValidate.descript" placeholder="请输入赠送备注"></Input>
                </FormItem>
                <FormItem label="赠送类型" prop="giveType" style="width: 100%">
                    <Select v-model="dialog.invest.formValidate.giveType" placeholder="请选择赠送类型">
                        <Option v-for="(item, index) in [ { code: 'INVEST', name: '充值赠送' }, { code: 'DISCOUNT', name: '优惠赠送' } ]" :value="item.code" :key="index">{{ item.name }}</Option>
                    </Select>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="success" size="large" long :loading="dialog.invest.loading" @click.native="handleInvestSubmit('investFormValidate')">确认添加</Button>
        </div>
    </Modal>

    <Modal v-model="dialog.log.show" width="820" class-name="vertical-center-modal" :mask-closable="false">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>账户历史变更记录</span>
        </p>
        <div style="text-align:center; padding-top: 0px;">
            <div class="filter-condition">
                <div class="condition-item">
                    <span class="text">变更日期: </span>
                    <DatePicker type="date" v-model="dialog.log.table.queryFilter.startTime" placeholder="请选择开始日期" style="width: 140px;"></DatePicker>-
                    <DatePicker type="date" v-model="dialog.log.table.queryFilter.endTime" placeholder="请选择结束日期" style="width: 140px;"></DatePicker>
                </div>
                <div class="condition-item">
                    <span class="text">变更类型: </span>
                    <Select v-model="dialog.log.table.queryFilter.type" placeholder="请选择赠送类型" style="width: 120px;">
                        <Option v-for="(item, index) in [ { code: '', name: '全部' }, { code: 'BALANCE_INVEST', name: '充值' }, { code: 'GIVE', name: '充值赠送' }, { code: 'BALANCE_CHANGE', name: '消费' } ]" :value="item.code" :key="index">{{ item.name }}</Option>
                    </Select>
                </div>
                <div class="condition-item">
                    <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="logSearch">查询</Button>
                </div>
            </div>
            <Table border :columns="dialog.log.table.cols" :data="dialog.log.table.datas"></Table>
            <Page :total="dialog.log.table.queryFilter.total" :page-size="dialog.log.table.queryFilter.pageSize" :current="dialog.log.table.queryFilter.pageNum" show-total @on-change="mofidyLogPageNum" />
        </div>
        <div slot="footer">
            <Button size="large" style="width: 100px;" @click.native="dialog.log.show = false">取消</Button>
        </div>
    </Modal>

	<Modal v-model="dialog.delete.show" width="360" class-name="vertical-center-modal" :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>确认删除</span>
        </p>
        <div style="text-align:center">
	        <p>当前选择 1 项待删除数据.</p>
	        <p>是否继续删除?</p>
	    </div>
        <div slot="footer">
        	<Button type="error" size="large" long :loading="dialog.delete.loading" @click.native="remove">删除</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
	import { memberAPI, amountAPI } from '@/api';
	import { Button, Table, Input, Modal, Form, FormItem, Select, Option, DatePicker, Page } from 'iview'

	export default {
	  name: "member-list",
	  data() {
	  	return {
            mapping: {
                gender: {
                    'MALE': '男',
                    'FEMALE': '女',
                }
            },
	  		dialog: {
                invest: {
                    show: false,
                    loading: false,
                    formValidate: {
                        memberId: '',
                        investMoney: '',
                        giveMoney: '',
                        descript: '',
                        giveType: 'INVEST',
                    },
                    ruleValidate: {
                        investMoney: [
                            { required: true, message: '请输入姓名', trigger: 'blur' }
                        ],
                        giveMoney: [
                            { required: true, message: '请输入赠送金额', trigger: 'blur' }
                        ],
                        giveType: [
                            { required: true, message: '请选择赠送类型', trigger: 'blur' }
                        ],
                    },
                },
                log: {
                    show: false,
                    loading: false,
                    table: {
                        queryFilter: {
                            memberId: '',
                            startTime: '',
                            endTime: '',
                            type: '',
                            pageNum: 1,
                            pageSize: 10,
                            total: 0,
                        },
                        cols: [
                            {
                                type: 'index',
                                width: 60,
                                align: 'center'
                            },
                            {
                                title: '变更时间',
                                key: 'gmtCreateTime',
                            },
                            {
                                title: '变更前金额',
                                key: 'beforeMoney',
                            },
                            {
                                title: '变更后余额',
                                key: 'afterMoney',
                            },
                            {
                                title: '变更类型',
                                width: 120,
                                key: 'type',
                                render: (h, params) => {
                                    let _type = params.row[params.column.key];
                                    let _mess = _type;
                                    if (_type === 'BALANCE_INVEST' && !params.row['message']) {
                                        _mess = '余额充值'
                                    } else if (_type === 'BALANCE_INVEST' && params.row['message']) {
                                        _mess = params.row['message']
                                    } else if (_type === 'BALANCE_CHANGE') {
                                        _mess = '余额消费'
                                    } else if (_type === 'BALANCE_EXTRACT') {
                                        _mess = '余额提取'
                                    } else if (_type === 'DEPOSIT_INVEST') {
                                        _mess = '押金充值'
                                    } else if (_type === 'DEPOSIT_EXTRACT') {
                                        _mess = '押金提取'
                                    }
                                    return h('span', _mess)
                                    
                                }
                            },
                        ],
                        datas: [ ]
                    }
                },
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
	  		table: {
                queryFilter: {
                    nickname: '',
                    phone: '',
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                },
                cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '会员名称',
                        key: 'nickname',
                        render: (h, params) => {
                            let _val = params.row[params.column.key];
                            return h('span', {
                                style: {
                                    'color': '#2d8cf0',
                                    'textDecoration': 'underline',
                                    'cursor': 'pointer'
                                },
                                on: {
                                    'click': () => {
                                        this.$router.push({ name: 'memberEdit', params: { id: params.row.id } })
                                    }
                                }
                            }, _val)
                            
                        }
                    },
                    {
                        title: '手机号',
                        width: 120,
                        key: 'member',
                        render: (h, params) => {
                            let _member = params.row[params.column.key];
                            return h('span', _member ? _member['phone'] : '')
                            
                        }
                    },
                    {
                        title: '性别',
                        width: 100,
                        key: 'member',
                        render: (h, params) => {
                            let _member = params.row[params.column.key];
                            return h('span', _member ? this.mapping.gender[_member['gender']] : '')
                            
                        }
                    },
                    {
                        title: '状态',
                        width: 100,
                        key: 'member',
                        render: (h, params) => {
                            let _member = params.row[params.column.key];
                            let _value = _member ? _member['status'] : '';
                            return h('GlobalSwitch', {
                                props: {
                                    trueValue: 'ENABLE',
                                    falseValue: 'DISABLE',
                                    value: _value
                                },
                                scopedSlots: {
                                    open: props => h('span', '启用'),
                                    close: props => h('span', '停用')
                                },
                                on: {
                                    'on-change': function (event) {
                                        console.log(event);
                                        // console.log(event.target);
                                        // self.$emit('input', event.target.value)
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '最新登录时间',
                        width: 160,
                        key: 'name'
                    },
                    // {
                    //     title: '加入时间',
                    //     key: 'member',
                    //     render: (h, params) => {
                    //         let _member = params.row[params.column.key];
                    //         return h('span', _member ? _member['gmtCreateTime'] : '')
                            
                    //     }
                    // },
                    {
                        title: '加入时间',
                        width: 160,
                        key: 'gmtCreateTime',
                    },
                    {
                        title: '推荐人',
                        width: 100,
                        key: 'recommedName'
                    },
                    {
                        title: '操作',
                        width: 300,
                        align: 'center',
                        slot: 'action'
                    }
                ],
                datas: [ ]
            }
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Form, FormItem, Select, Option, DatePicker, Page
	    },
	  mounted() {
        this.fetchDataList();
	  },
	  methods: {
        mofidyPageNum(curr = 1) {
            this.table.queryFilter.pageNum = curr;
            this.fetchDataList();
        },
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
    		memberAPI.fetchList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                    this.table.queryFilter.total = res.data.pageInfoParam.totalNum;
                } else {
                    this.table.datas = [];
                    this.table.queryFilter.total = 0;
                }
        	});
    	},
        showInvestDialog(id) {
            this.dialog.invest.show = true;
            this.dialog.invest.formValidate.memberId = id;
        },
        handleInvestSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let _params = JSON.parse(JSON.stringify(this.dialog.invest.formValidate));
                    this.dialog.invest.loading = true;
                    memberAPI.investGive(_params).then(res => {
                        if (res.code == 0) {
                            this.$Message.success('充值赠送成功!');
                            this.dialog.invest.show = false;
                            this.fetchDataList();
                        } else {
                            this.$Message.error(res.message || '充值赠送失败!');
                        }
                    }).then(() => {
                        this.dialog.invest.loading = false;
                    });
                } else {
                    this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        mofidyLogPageNum(curr = 1) {
            this.dialog.log.table.queryFilter.pageNum = curr;
            this.fetchLogList();
        },
        logSearch() {
            this.dialog.log.table.queryFilter.pageNum = 1;
            this.fetchLogList();
        },
        showLogDialog(id) {
            this.dialog.log.table.queryFilter.memberId = id;
            this.dialog.log.show = true;
            this.fetchLogList();
        },
        fetchLogList(name) {
            let _params = JSON.parse(JSON.stringify(this.dialog.log.table.queryFilter));
            amountAPI.fetchAmounthistoryList(_params).then(res => {
                if (res.code == 0) {
                    this.dialog.log.table.datas = res.data.list;
                    this.dialog.log.table.queryFilter.total = res.data.pageInfoParam.totalNum;
                } else {
                    this.dialog.log.table.datas = [];
                    this.dialog.log.table.queryFilter.total = 0;
                }
            });
        },
	  }
	};
</script>

<style lang="scss" scoped>
.member-list {
	.title {
		font-size: 16px;
	    color: #808080;
	    font-weight: bold;
	    border-bottom: 1px solid #eee;
	    padding-bottom: 10px;
	    margin-bottom: 20px;
	}
}
</style>

<style lang="scss">
.member-list {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }
}
</style>