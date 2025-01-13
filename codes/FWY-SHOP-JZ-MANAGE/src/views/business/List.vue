<template>
  <div class="business-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">商家名称: </span>
            <Input v-model="table.queryFilter.name" placeholder="请输入商家名称" style="width: 190px;"></Input>
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
			<Button type="primary" @click="$router.push({ name: 'businessAdd' })">新增商家</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'businessEdit', params: { id: row.id } })">修改</Button>
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
	import { businessAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option, Page } from 'iview'

	export default {
	  name: "business-list-page",
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
                    name: '',
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
                        title: '商家名称',
                        key: 'name',
                    },
                  
                    {
                        title: '地址',
                        key: 'addr',
                        width: 160,
                    },
                    {
                        title: '联系人',
                        key: 'contactUser',
                        width: 160,
                    },
                    {
                        title: '联系电话',
                        width: 160,
                        key: 'contactPhone'
                    },
                    {
                        title: '覆盖区域',
                        width: 160,
                        key: 'fuwuCitys'
                    },
                     {
                        title: '展厅位置',
                        width: 160,
                        key: 'showroomAddr'
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
        updateShiftStatus(event,id){
            businessAPI.businessShift({"id":id,"shiftStatus":event}).then(res => {
                if (res.code == 0) {
                   this.$Message.success('保存成功!');
                } else {
                   this.$Message.success('保存失败!');
                }
            });
        },
    	fetchDataList() {
    		businessAPI.fetchList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                    this.table.queryFilter.total = res.data.pageInfoParam.totalNum;
                } else {
                    this.table.datas = [];
                    this.table.queryFilter.total = 0;
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
            businessAPI.businessDel({ id: this.dialog.delete.id }).then(res => {
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
.business-list-page {
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
.business-list-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>