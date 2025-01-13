<template>
  <div class="business-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">展厅名称: </span>
            <Input v-model="table.queryFilter.exhibitionHallName" placeholder="请输入展厅名称" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">状态: </span>
            <Select v-model.number="table.queryFilter.applicationStatus" placeholder="请选择上架状态" style="width: 190px;">
                <Option v-for="(item, index) in shelfStatusArrs" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
        <div class="condition-item">
            <span class="text">商家: </span>
            <Select v-model.number="table.queryFilter.businessId" placeholder="请选择商家" style="width: 190px;">
                <Option value="">全部</Option>
                <Option v-for="(item, index) in businessDatas" :value="item.id" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
		<div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
			<Button type="primary" @click="$router.push({ name: 'exhibitionAdd' })">新增展厅</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="showTopDialog(row)" >置顶</Button>
                <Button type="primary" size="small" style="margin-left: 10px;" @click="$router.push({ name: 'exhibitionEdit', params: { id: row.id } })">修改</Button>
                <Button type="error" size="small" style="margin-left: 10px;" @click="openDeleteDialog(row.id)">删除</Button>
            </template>
        </Table>
        <Page :total="table.queryFilter.total" :page-size="table.queryFilter.pageSize" :current="table.queryFilter.pageNum" show-total @on-change="mofidyPageNum" />
	</div>

    <Modal v-model="dialog.top.show" width="420" class-name="vertical-center-modal" :mask-closable="false">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>置顶</span>
        </p>
        <div style="text-align:center; padding-top: 20px;">
            <Form ref="topFormValidate" :model="dialog.top.formValidate" :rules="dialog.top.ruleValidate" :label-width="70">
                <FormItem label="置顶状态" prop="top" style="width: 100%">
                    <Select v-model="dialog.top.formValidate.top" placeholder="请选择置顶状态" style="text-align: left;">
                        <Option :value="1">置顶</Option>
                        <Option :value="0">不置顶</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序号" prop="sortNum" style="width: 100%;">
                    <Input v-model.number="dialog.top.formValidate.sortNum" placeholder="请输入排序号"></Input>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
            <Button type="success" size="large" long :loading="dialog.top.loading" @click.native="handleTopSubmit('topFormValidate')">确认</Button>
        </div>
    </Modal>

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
	import { exhibitionAPI, businessAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option, Page, Form, FormItem } from 'iview'

	export default {
	  name: "business-list-page",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			},
                  top: {
                    show: false,
                    loading: false,
                    formValidate: {
                        id: undefined,
                        top: 1,
                        sortNum: 0,
                    },
                    ruleValidate: {
                        sortNum: [
                            { type: 'number', required: true, message: '请输入排序号', trigger: 'blur' }
                        ],
                    },
                },
	  		},
            businessDatas: [],
            shelfStatusArrs: [
                { code: '', name: '全部' },
                { code: 1, name: '启用' },
                { code: 0, name: '禁用' },
            ],
	  		table: {
                queryFilter: {
                    exhibitionHallName: undefined,
                    applicationStatus: undefined,
                    businessId: undefined,
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
                        title: '展厅名称',
                        key: 'exhibitionHallName',
                    },
                    {
                        title: '地址',
                        key: 'address',
                        width: 160,
                    },
                    {
                        title: '面积',
                        key: 'area',
                        width: 160,
                    },
                    {
                        title: '产品标签',
                        key: 'productionLabel',
                        width: 160,
                    },
                    {
                        title: '联系人',
                        key: 'contactPerson',
                        width: 160,
                    },
                    {
                        title: '联系电话',
                        width: 160,
                        key: 'contactNumber'
                    },
                    {
                        title: '状态',
                        key: 'applicationStatus',
                        width: 160,
                        render: (h, params) => {
                            let _id = params.row.id;
                            let _value = params.row[params.column.key];
                            return h('GlobalSwitch', {
                                props: {
                                    trueValue: '1',
                                    falseValue: '0',
                                    value: _value
                                },
                                scopedSlots: {
                                    open: props => h('span', '启用'),
                                    close: props => h('span', '禁用')
                                },
                                on: {
                                    'on-change':  (event) => {
                                        this.updateApplicationStatus(event, _id)
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '操作',
                        width: 200,
                        align: 'center',
                        slot: 'action'
                    }
                ],
                datas: [ ]
            }
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Select, Option, Page, Form, FormItem
	    },
	  mounted() {
          this.fetchBusinessList();
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
        showTopDialog(row) {
            this.dialog.top.show = true;
            this.dialog.top.formValidate.id = row.id;
            this.dialog.top.formValidate.top = row.top;
            this.dialog.top.formValidate.sortNum = row.sortNum;
        },
        handleTopSubmit(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let _params = JSON.parse(JSON.stringify(this.dialog.top.formValidate));
                    this.dialog.top.loading = true;
                    exhibitionAPI.exhibitionTop(_params).then(res => {
                        if (res.code == 0) {
                            this.$Message.success('修改置顶状态成功!');
                            this.dialog.top.show = false;
                            this.fetchDataList();
                        } else {
                            this.$Message.error(res.message || '修改置顶状态失败!');
                        }
                    }).then(() => {
                        this.dialog.top.loading = false;
                    });
                } else {
                    this.$Message.error('修改置顶状态失败, 请检查表单数据是否正确!');
                }
            })
        },
        updateApplicationStatus(event, id) {
            exhibitionAPI.exhibitionApplicationStatus({ "id":id, "applicationStatus":event }).then(res => {
                if (res.code == 0) {
                   this.$Message.success('保存成功!');
                } else {
                   this.$Message.success('保存失败!');
                }
            });
        },
    	fetchBusinessList() {
    		businessAPI.fetchList({ pageSize: 999999 }).then(res => {
                if (res.code == 0) {
                    this.businessDatas = res.data.list;
                } else {
                    this.businessDatas = [];
                }
        	});
        },
    	fetchDataList() {
    		exhibitionAPI.fetchList(this.table.queryFilter).then(res => {
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
            exhibitionAPI.exhibitionDel({ id: this.dialog.delete.id }).then(res => {
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