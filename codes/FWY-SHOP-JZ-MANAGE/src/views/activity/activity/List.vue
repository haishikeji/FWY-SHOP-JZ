<template>
  <div class="activity-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">活动名称: </span>
            <Input v-model="table.queryFilter.activityName" placeholder="请输入活动名称" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">适合人群: </span>
            <Select v-model.number="table.queryFilter.fitGroup" placeholder="请选择适合人群" style="width: 190px;">
                <Option v-for="(item, index) in fitGroupArrs" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="condition-item">
            <span class="text">适合年龄段: </span>
            <Select v-model.number="table.queryFilter.fitAge" placeholder="请选择适合年龄段" style="width: 190px;">
                <Option v-for="(item, index) in fitAgeArrs" :value="item.code" :key="index">{{ item.name }}</Option>
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
			<Button type="primary" @click="$router.push({ name: 'activityAdd' })">新增线下活动</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'activityEdit', params: { id: row.id } })">修改</Button>
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
	import { activityAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option } from 'iview'

	export default {
	  name: "activity-list-page",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
            fitAgeArrs: [
                { code: '', name: '全部' },
                { code: 1, name: '1-2岁' },
                { code: 2, name: '3-5岁' },
                { code: 3, name: '6-7岁' },
                { code: 4, name: '8-9岁' },
            ],
            fitGroupArrs: [
                { code: '', name: '全部' },
                { code: 0, name: '儿童' },
                { code: 1, name: '成人' },
            ],
            shelfStatusArrs: [
                { code: '', name: '全部' },
                { code: 1, name: '上架' },
                { code: 0, name: '下架' },
            ],
	  		table: {
                queryFilter: {
                    activityName: '',
                    fitGroup: '',
                    fitAge: '',
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
                        title: '活动名称',
                        key: 'name',
                        width: 240,
                    },
                    {
                        title: '适合人群',
                        key: 'group',
                        render: (h, params) => {
                            let _fitChildren = params.row['fitChildren'];
                            let _fitAdult = params.row['fitAdult'];
                            let arrs = [];
                            if (_fitChildren == 1) {
                                arrs.push('儿童');
                            }
                            if (_fitAdult == 1) {
                                arrs.push('成人');
                            }
                            return h('span', arrs.join(','));
                        }
                    },
                    {
                        title: '排期',
                        key: 'plans',
                        width: 100,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            let _color, _text = '';
                            if (_value && _value.length > 0) {
                                _text = '已排期';
                                _color = '#0079FE';
                            } else {
                                _text = '未排期';
                                _color = '#ec7259';
                            }
                            return h('span', {
                                style: {
                                    color: _color,
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                },
                                on: {
                                    'click': () => {
                                        this.$router.push({ name: 'activityPlan', params: { id: params.row.id } })
                                    }
                                }
                            }, _text);
                        }
                    },
                    {
                        title: '活动费用',
                        key: 'price',
                        width: 100,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            let _fitChildren = params.row['fitChildren'];
                            return h('span', _value + '元');
                        }
                    },
                    {
                        title: '活动场地',
                        key: 'place',
                        width: 100,
                        render: (h, params) => {
                            let _ref = params.row[params.column.key];
                            return h('span', _ref ? _ref['name'] : '');
                        }
                    },
                    {
                        title: '适合年龄段',
                        key: 'agesConvert'
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
        this.fetchDataList();
	  },
	  methods: {
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
    		activityAPI.fetchActivityList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    res.data.list.map(item => {
                        item['agesConvert'] = item.ages.map(age => age.name).join(', ');
                    });
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	}
	  }
	};
</script>

<style lang="scss" scoped>
.activity-list-page {
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
.activity-list-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>