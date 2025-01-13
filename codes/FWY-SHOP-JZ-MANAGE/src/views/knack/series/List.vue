<template>
  <div class="knack-series-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">系列名称: </span>
            <Input v-model="table.queryFilter.knackName" placeholder="请输入系列名称" style="width: 190px;"></Input>
        </div>
        <!-- <div class="condition-item">
            <span class="text">作者: </span>
            <Input v-model="table.queryFilter.author" placeholder="请输入作者" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">适合年龄段: </span>
            <Select v-model.number="table.queryFilter.fitAge" placeholder="请选择适合年龄段" style="width: 190px;">
                <Option v-for="(item, index) in fitAgeArrs" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </div> -->
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
			<Button type="primary" @click="$router.push({ name: 'knackSeriesAdd' })">新增系列窍门</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'knackSeriesEdit', params: { id: row.id } })">修改</Button>
                <Button type="error" size="small" style="margin-left: 10px;" @click="openDeleteDialog(row.id)">删除</Button>
            </template>
        </Table>
        <Page :total="table.queryFilter.total" :page-size="table.queryFilter.pageSize" :current="table.queryFilter.pageNum" show-total @on-change="mofidyPageNum" />
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
	import { knackAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option, Page } from 'iview'

	export default {
	  name: "knack-series-list-page",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
            
            shelfStatusArrs: [
                { code: '', name: '全部' },
                { code: 1, name: '上架' },
                { code: 0, name: '下架' },
            ],
	  		table: {
                queryFilter: {
                    knackName: '',
                    author: '',
                    shelfStatus: '',
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
                        title: '系列窍门名称',
                        key: 'name',
                    },
                     {
                        title: '分类',
                        key: 'types',
                        render: (h, params) => {
                            let _arrs = []
                            params.row[params.column.key].map(item => {
                               _arrs.push(item['name']);
                            })
                            return h('span', _arrs.join(','));
                        }
                    }, 
                    {
                        title: '作者',
                        key: 'author',
                        width: 140,
                    },
                    {
                        title: '发布时间',
                        key: 'publishTime',
                        width: 140,
                    },
                    {
                        title: '上架状态',
                        key: 'shelfStatus',
                        width: 160,
                        render: (h, params) => {
                            let _id = params.row.id;
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
                                    'on-change':  (event) => {
                                        this.updateShiftStatus(event,_id)
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '窍门维护',
                        key: 'plans',
                        width: 100,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            let _text = '窍门配置';
                            let _color = '#0079FE';
                            return h('span', {
                                style: {
                                    color: _color,
                                    textDecoration: 'underline',
                                    cursor: 'pointer'
                                },
                                on: {
                                    'click': () => {
                                        this.$router.push({ name: 'knackSeriesConfig', params: { id: params.row.id } })
                                    }
                                }
                            }, _text);
                        }
                    },
                    {
                        title: '操作',
                        width: 210,
                        align: 'center',
                        slot: 'action'
                    }
                ],
                datas: [ ]
            }
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Select, Option, Page
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
    		knackAPI.fetchSeriesList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                   
                    this.table.datas = res.data.list;
                    this.table.queryFilter.total = res.data.pageInfoParam.totalNum;
                } else {
                    this.table.datas = [];
                    this.table.queryFilter.total = 0;
                }
        	});
        },
         updateShiftStatus(event,id){
            knackAPI.knackSeriesShift({"id":id,"shiftStatus":event}).then(res => {
                if (res.code == 0) {
                   this.$Message.success('保存成功!');
                } else {
                   this.$Message.success('保存失败!');
                }
            });
        },
        openDeleteDialog(id) {
            if (!id) {
                this.$Message.error('请选择待删除数据!');
                return;
            }
            this.dialog.delete.id = id;
            this.dialog.delete.show = true;
        },
        remove() {
            this.dialog.delete.loading = true;
            knackAPI.knackSeriesDel({ id: this.dialog.delete.id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('删除成功!');
                    this.fetchDataList();
                    this.dialog.delete.id = '';
                    this.dialog.delete.show = false;
                } else {
                    this.$Message.error(res.message || '删除失败!');
                }
            }).then(() => {
                this.dialog.delete.loading = false;
            });
        },
	  }
	};
</script>

<style lang="scss" scoped>
.knack-series-list-page {
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
.knack-series-list-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>