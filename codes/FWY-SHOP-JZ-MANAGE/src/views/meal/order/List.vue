<template>
  <div class="order-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">订单号: </span>
            <Input v-model="table.queryFilter.orderSn" placeholder="请输入订单号" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">手机号: </span>
            <Input v-model="table.queryFilter.receivedPhone" placeholder="请输入下单人手机号" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">时间范围: </span>
            <DatePicker v-model="table.queryFilter.startTime" type="date" placeholder="请选择开始时间" style="width: 140px; margin-right: 10px;"></DatePicker>-
            <DatePicker v-model="table.queryFilter.endTime" type="date" placeholder="请选择结束时间" style="width: 140px; margin-left: 6px;"></DatePicker>
        </div>
        <div class="condition-item">
            <span class="text">订单状态: </span>
            <Select v-model="table.queryFilter.status" multiple placeholder="请选择订单状态" style="width: 190px;">
                <Option value="">全部</Option>
                <Option v-for="(item, index) in statusArrs" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
    </div>

	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click.native="oepnDetail(row)">详情</Button>
                <Button v-if="row.status == 1 && row.childStatus == 0 && row.distributionMode != 'YOURSELF'" @click.native="modifySend(row.id)" type="primary" size="small" style="margin-left: 10px;">确认送餐</Button>
                <Button v-if="row.status == 1 && row.childStatus == 0 && row.distributionMode != 'YOURSELF'" @click.native="openRejectDialog(row)" type="error" size="small" style="margin-left: 10px;">拒绝送餐</Button>
                <Button v-if="row.status == 6" type="primary" size="small" style="margin-left: 10px;">退款处理</Button>
            </template>
        </Table>
	</div>

    <Modal v-model="dialog.detail.show" width="720" class-name="vertical-center-modal" :styles="{top: '200px', marginBottom: '40px'}" :mask-closable="false">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>订单详情</span>
        </p>
        <div style="text-align:center; padding-top: 0px;">
            <div class='detail-wrap'>
                <div class="detail-item">
                    <div class="item-left">订单号: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.orderSn" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">下单时间: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.gmtCreateTime" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item" v-if="dialog.detail.row.status > 0">
                    <div class="item-left">支付时间: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.payTime" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">订单状态: </div>
                    <div class="item-right"><Input :value="this.statusMapping[dialog.detail.row.status]" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">配送方式: </div>
                    <div class="item-right"><Input :value="this.distributionModeMapping[dialog.detail.row.distributionMode]" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item" v-if="dialog.detail.row.distributionMode == 'YOURSELF'">
                    <div class="item-left">桌号: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.otherDesc.tableNum" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">就餐人数/餐具数量: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.otherDesc ? dialog.detail.row.otherDesc.eatNum : ''" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">订单总额: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.totalPrice" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">送餐费: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.x" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item" v-if="dialog.detail.row.distributionMode == 'EXPRESS'">
                    <div class="item-left">姓名/昵称: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.receivedName" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item" v-if="dialog.detail.row.distributionMode == 'EXPRESS'">
                    <div class="item-left">手机号: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.receivedPhone" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item" v-if="dialog.detail.row.distributionMode == 'EXPRESS'">
                    <div class="item-left">外送地址: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.receivedAddress" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">送餐时间: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.x" disabled style="width: 100%"></Input></div>
                </div>
                <div class="detail-item">
                    <div class="item-left">备注: </div>
                    <div class="item-right"><Input :value="dialog.detail.row.otherDesc ? dialog.detail.row.otherDesc.remark : ''" disabled style="width: 100%"></Input></div>
                </div>
            </div>
            <Table border ref="selectionRef" :columns="dialog.detail.table.cols" :data="dialog.detail.row.goods"></Table>
        </div>
        <div slot="footer">
            <Button size="large" style="width: 100px;" @click.native="dialog.detail.show = false">取消</Button>
            <Button v-if="dialog.detail.row.status == 1 && dialog.detail.row.childStatus == 0 && dialog.detail.row.distributionMode != 'YOURSELF'" type="primary" size="large" :loading="dialog.refund.loading" @click.native="modifySend" style="width: 130px;">确认送餐/下单</Button>
            <Button v-if="dialog.detail.row.status == 1 && dialog.detail.row.childStatus == 0 && dialog.detail.row.distributionMode != 'YOURSELF'" type="error" size="large" :loading="dialog.refund.loading" @click.native="openRejectDialog" style="width: 100px;">拒绝送餐</Button>
        </div>
    </Modal>

    <Modal v-model="dialog.reject.show" width="720" class-name="vertical-center-modal" style="padding-top: 200px;" :mask-closable="false">
        <p slot="header" style="color:#ed4014;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>拒绝送餐</span>
        </p>
        <div style="text-align:center; padding-top: 0px;">
            <div class='detail-wrap'>
                <div class="detail-item" style="align-items: flex-start;">
                    <div class="item-left">拒绝理由: </div>
                    <div class="item-right"><Input type="textarea" v-model="dialog.reject.descript" :autosize="{ minRows: 4, maxRows: 7 }" style="width: 100%"></Input></div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button size="large" style="width: 100px;" @click.native="dialog.reject.show = false">取消</Button>
            <Button type="error" size="large" :loading="dialog.reject.loading" @click.native="modifyRejectSend()" style="width: 100px;">确定</Button>
        </div>
    </Modal>

    <Modal v-model="dialog.refund.show" width="720" class-name="vertical-center-modal" style="padding-top: 200px;" :mask-closable="false">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>退款处理</span>
        </p>
        <div style="text-align:center; padding-top: 0px;">
            <div class='detail-wrap'>
                <div class="detail-item" style="align-items: flex-start;">
                    <div class="item-left">退款/驳回理由: </div>
                    <div class="item-right"><Input type="textarea" v-model="dialog.refund.descript" :autosize="{ minRows: 4, maxRows: 7 }" style="width: 100%"></Input></div>
                </div>
            </div>
        </div>
        <div slot="footer">
            <Button size="large" style="width: 100px;" @click.native="dialog.refund.show = false">取消</Button>
            <Button type="primary" size="large" :loading="dialog.refund.loading" @click.native="remove" style="width: 100px;">确认退款</Button>
            <Button type="error" size="large" :loading="dialog.refund.loading" @click.native="remove" style="width: 100px;">驳回退款</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
	import { orderAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option, DatePicker } from 'iview'

	export default {
	  name: "order-list-page",
	  data() {
	  	return {
	  		dialog: {
                detail: {
                    show: false,
                    loading: false,
                    row: {},
                    table: {
                        cols: [
                            {
                                title: '菜品名称',
                                key: 'name',
                                width: 200,
                            },
                            {
                                title: '菜品分类',
                                key: 'type',
                                width: 150,
                            },
                            {
                                title: '菜品编号',
                                key: 'id',
                            },
                            {
                                title: '数量',
                                key: 'num',
                            },
                        ]
                    }
                },
                reject: {
                    show: false,
                    loading: false,
                    id: '',
                    descript: ''
                },
                refund: {
                    show: false,
                    loading: false,
                    id: '',
                    descript: ''
                }
	  		},
            statusMapping: {
                0: '待付款',
                1: '进行中',
                2: '已完成',
                3: '已取消',
            },
            childStatusMapping: {
                0: '未发货',
                1: '发货中',
                2: '已拒绝发货',
                3: '已拒绝退款',
                3: '已退款',
            },
            distributionModeMapping: {
                'EXPRESS': '外卖',
                'YOURSELF': '堂食',
            },
            statusArrs: [
                { code: 0, name: '待付款' },
                { code: 1, name: '进行中' },
                { code: 2, name: '已完成' },
                { code: 3, name: '已取消' },
            ],
	  		table: {
                queryFilter: {
                    orderSn: '',
                    receivedPhone: '',
                    startTime: '',
                    endTime: '',
                    status: [],
                    orderType: 'ADULT_PARTICIPATE_RESTURANT',
                    pageNum: 1,
                    pageSize: 10,
                },
                cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '订单号',
                        key: 'orderSn',
                        width: 200,
                    },
                    {
                        title: '支付时间',
                        key: 'payTime',
                        width: 150,
                    },
                    {
                        title: '期望送餐时间',
                        key: 'name',
                        width: 150,
                    },
                    {
                        title: '订单状态',
                        key: 'status',
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('span', this.statusMapping[_value]);
                        }
                    },
                    {
                        title: '订单子状态',
                        key: 'childStatus',
                        width: 120,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            let isShow = false;
                            if (params.row['distributionMode'] == 'EXPRESS' && params.row['status'] != 0) {
                                isShow = true;
                            }
                            return h('span', isShow ? this.childStatusMapping[_value] : '');
                        }
                    },
                    {
                        title: '配送方式',
                        key: 'distributionMode',
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('span', this.distributionModeMapping[_value]);
                        }
                    },
                    {
                        title: '手机号',
                        key: 'receivedPhone',
                        width: 120,
                    },
                    {
                        title: '桌号',
                        key: 'otherDesc',
                        render: (h, params) => {
                            let _otherDesc = params.row[params.column.key];
                            return h('span', _otherDesc ? _otherDesc['tableNum'] : '');
                        }
                    },
                    {
                        title: '订单总额',
                        key: 'totalPrice',
                    },
                    {
                        title: '送餐费',
                        key: 'name',
                    },
                    {
                        title: '就餐人数',
                        key: 'otherDesc',
                        render: (h, params) => {
                            let _otherDesc = params.row[params.column.key];
                            return h('span', _otherDesc ? _otherDesc['eatNum'] : '');
                        }
                    },
                    {
                        title: '操作',
                        width: 240,
                        align: 'center',
                        slot: 'action'
                    }
                ],
                datas: [ ]
            }
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Select, Option, DatePicker
	    },
	  mounted() {
        // this.fetchMealTypes()
        this.fetchDataList();
	  },
	  methods: {
        oepnDetail(row) {
            this.dialog.detail.show = true;
            this.dialog.detail.row = {}
            if (row && row.id) {
                this.dialog.detail.row = row
            }
        },
        openRejectDialog(row) {
            let _row = row || this.dialog.detail.row;
            this.dialog.reject.id = '';
            this.dialog.reject.descript = '';
            if (_row.id) {
                this.dialog.reject.show = true;
                this.dialog.reject.id = _row.id;
            }
        },
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
            let _params = JSON.parse(JSON.stringify(this.table.queryFilter));
            if (_params['status']) {
                _params['status'] = _params['status'].join(',')
            }
    		orderAPI.fetchOrderList(_params).then(res => {
                if (res.code == 0) {
                    res.data.list.map(item => {
                        if (item.goods) {
                            item.goods = JSON.parse(item.goods);
                        }
                        if (item.otherDesc) {
                            item.otherDesc = JSON.parse(item.otherDesc);
                        }
                    })
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	},
        modifySend(id) {
            orderAPI.fetchOrderModifySend({ id: id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('设置确认状态成功!');
                    this.dialog.detail.show = false;
                    this.dialog.detail.row = {};
                    this.fetchDataList();
                } else {
                    this.$Message.error('设置确认状态失败!');
                }
            });
        },
        // modifyRefund(id) {
        //     orderAPI.fetchOrderModifyRefund({ id: id }).then(res => {
        //         if (res.code == 0) {
        //             this.mealTypes = res.data.list;
        //         } else {
        //             this.mealTypes = [];
        //         }
        //     });
        // }
        modifyRejectSend() {
            if (!this.dialog.reject.descript) {
                this.$Message.error('请填写拒绝理由!');
                return;
            }
            orderAPI.fetchOrderModifyRejectSend({ id: this.dialog.reject.id, remark: this.dialog.reject.descript }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('设置拒绝送餐完成!');
                    this.dialog.reject.show = false;
                    this.dialog.reject.id = '';
                    this.dialog.detail.show = false;
                    this.dialog.detail.row = {};
                    this.fetchDataList();
                } else {
                    this.$Message.error('设置拒绝送餐失败!');
                }
            });
        }
        // modifyRejectRefund(id) {
        //     orderAPI.fetchOrderModifyRejectRefund({ id: id, remark: this.dialog.refund.descript }).then(res => {
        //         if (res.code == 0) {
        //             this.mealTypes = res.data.list;
        //         } else {
        //             this.mealTypes = [];
        //         }
        //     });
        // }
        // fetchMealTypes() {
        //     mealAPI.fetchTypeList({ pageSize: 5000 }).then(res => {
        //         if (res.code == 0) {
        //             this.mealTypes = res.data.list;
        //         } else {
        //             this.mealTypes = [];
        //         }
        //     });
        // },
	  }
	};
</script>

<style lang="scss" scoped>
.order-list-page {
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
.order-list-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}

    .detail-wrap {
        .detail-item {
            display: flex;
            flex-direction: row;
            align-items: center;
            margin-bottom: 20px;
            .item-left {
                width: 130px;
                text-align: right;
                padding-right: 20px;
            }
            .item-right {
                flex: 1;
            }
        }
    }
</style>