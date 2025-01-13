<template>
  <div class="meal-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">菜品名称: </span>
            <Input v-model="table.queryFilter.mealName" placeholder="请输入菜品名称" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">菜品分类: </span>
            <Select v-model.number="table.queryFilter.refTypePk" placeholder="请选择菜品分类" style="width: 190px;">
                <Option value="">全部</Option>
                <Option v-for="(item, index) in mealTypes" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="condition-item">
            <span class="text">上架状态: </span>
            <Select v-model.number="table.queryFilter.shelfStatus" placeholder="请选择上架状态" style="width: 190px;">
                <Option v-for="(item, index) in shelfStatusArrs" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
		<div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
			<Button type="primary" @click="$router.push({ name: 'mealAdd' })">新增菜品</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'mealEdit', params: { id: row.id } })">修改</Button>
            </template>
        </Table>
	</div>

	<Modal v-model="dialog.delete.show" width="360" class-name="vertical-center-modal">
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
	import { mealAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option } from 'iview'

	export default {
	  name: "meal-list-page",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
            mealTypes: [],
            shelfStatusArrs: [
                { code: '', name: '全部' },
                { code: 1, name: '上架' },
                { code: 0, name: '下架' },
            ],
	  		table: {
                queryFilter: {
                    mealName: '',
                    refTypePk: '',
                    shelfStatus: '',
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
                        title: '菜品名称',
                        key: 'name',
                        width: 240,
                    },
                    {
                        title: '菜品分类',
                        key: 'mealType',
                        width: 100,
                        render: (h, params) => {
                            let _mealType = params.row[params.column.key];
                            let _filters = this.mealTypes.filter(item => item.id == _mealType.id);
                            return h('span', _filters && _filters.length ? _filters[0].name : '')
                        }
                    },
                    {
                        title: '销售价格',
                        key: 'salePrice',
                        width: 140,
                    },
                    {
                        title: '标注价格',
                        key: 'markPrice'
                    },
                    {
                        title: '更新时间',
                        width: 160,
                        key: 'gmtModifyTime'
                    },
                    {
                        title: '创建人',
                        width: 160,
                        key: 'x'
                    },
                    {
                        title: '上架状态',
                        key: 'shelfStatus',
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('GlobalSwitch', {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: _value
                                },
                                scopedSlots: {
                                    open: props => h('span', '上架'),
                                    close: props => h('span', '下架')
                                },
                                on: {
                                    'on-change': function (event) {
                                        console.log(event);
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        width: 160,
                        align: 'center',
                        slot: 'action'
                    }
                ],
                datas: [ ]
            }
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Select, Option
	    },
	  mounted() {
        this.fetchMealTypes()
        this.fetchDataList();
	  },
	  methods: {
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
    		mealAPI.fetchList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	},
        fetchMealTypes() {
            mealAPI.fetchTypeList({ pageSize: 5000 }).then(res => {
                if (res.code == 0) {
                    this.mealTypes = res.data.list;
                } else {
                    this.mealTypes = [];
                }
            });
        },
	  }
	};
</script>

<style lang="scss" scoped>
.meal-list-page {
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
.meal-list-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>