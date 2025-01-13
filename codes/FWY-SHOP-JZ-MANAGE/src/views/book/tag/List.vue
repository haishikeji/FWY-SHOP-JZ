<template>
  <div class="book-tag-list">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
    	<div class="condition-item">
    		<span class="text">标签名称: </span>
			<Input v-model="table.queryFilter.tagName" placeholder="请输入标签名称" style="width: 190px;"></Input>
    	</div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
		<div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
			<Button type="primary" @click="$router.push({ name: 'bookTagAdd' })">新增标签</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'bookTagEdit', params: { id: row.id } })">修改</Button>
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
	import { bookAPI } from '@/api';
	import { Button, Table, Input, Modal } from 'iview'

	export default {
	  name: "book-tag",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
	  		table: {
                queryFilter: {
                    tagName: '',
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
                        title: '标签名称',
                        key: 'name'
                    },
                    {
                        title: '颜色',
                        key: 'color',
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('span', {
                                style: {
                                    width: '20px',
                                    height: '20px',
                                    background: _value,
                                    display: 'inline-block',
                                    borderRadius: '3px'
                                }
                            });
                        }
                    },
                    {
                        title: '排序号',
                        key: 'priority'
                    },
                    {
                        title: '是否在首页显示',
                        key: 'showHome',
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('GlobalSwitch', {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: _value
                                },
                                scopedSlots: {
                                    open: props => h('span', '是'),
                                    close: props => h('span', '否')
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
			Button, Table, Input, Modal
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
    		bookAPI.fetchTagList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
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
.book-tag-list {
	.title {
		font-size: 16px;
	    color: #808080;
	    font-weight: bold;
	    border-bottom: 1px solid #eee;
	    padding-bottom: 10px;
	    margin-bottom: 20px;
	}


	.filter-condition {
	    display: -webkit-box;
	    display: -ms-flexbox;
	    display: flex;
	    -webkit-box-pack: center;
        -ms-flex-pack: center;
        // justify-content: center;
	    -webkit-box-align: center;
    	-ms-flex-align: center;
        align-items: center;
        flex-wrap: wrap;
        position: relative;
	}
	.filter-condition .condition-item {
	      display: inline-block;
	      margin-right: 20px;
	      margin-bottom: 20px;
	}
	.filter-condition .condition-item .text {
	        font-size: 16px;
	        // color: #46ecff;
	        vertical-align: middle;
	        line-height: normal;
	        margin-right: 5px;
	        width: initial;
	        display: inline-block;
	}
}

.demo-tree-render .ivu-tree-title{
    width: 100%;
}
</style>

<style lang="scss">
.book-tag-list {
	
}
</style>