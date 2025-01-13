<template>
  <div class="book-advert-list">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
    	<div class="condition-item">
            &nbsp;
    	</div>
        <div class="condition-item" style="position: absolute; top: 0px; left: 0px;">
            <Button type="primary" @click="$router.push({ name: 'marketingAdvertAdd', params: { refAdvertPk: $route.params.id } })">新增素材</Button>
        </div>
        <div class="condition-item" style="position: absolute; top: 0px; left: 90px;">
            <Button @click="$router.push({ name: 'marketingAdvertList' })">返回广告位</Button>
        </div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'marketingAdvertEdit', params: { id: row.id } })">修改</Button>
                <Button type="error" size="small" style="margin-left: 10px;" @click="delteItem(row.id)">删除</Button>
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
	import { marketingAPI } from '@/api';
	import { Button, Table, Input, Modal } from 'iview'

	export default {
	  name: "book-series",
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
                    id: '',
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
                        title: '广告位图片',
                        width: 200,
                        key: 'adCoverUrl',
                        render: (h, params) => {
                            return h('div', [
                                h('img', {
                                    attrs: {
                                        src: params.row[params.column.key]
                                    },
                                    style: {
                                        // width: '30px',
                                        // height: '30px',
                                        width: 'auto',
                                        height: 'auto',
                                        maxWidth: '100%',
                                        maxHeight: '100%',
                                    }
                                }),
                            ]);
                            // h('img', {
                            //     src: 'http://bookclub-imgs.doule.me/users/99/20200907/11ab660023ee49e797505df5c03a107d.png'
                            // }, 'test');
                        }
                    },
                    {
                        title: '图片描述',
                        key: 'descript'
                    },
                    {
                        title: '图片链接',
                        key: 'url'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 100,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
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
                                    }
                                }
                            });
                        }
                    },
                    {
                        title: '排序号',
                        width: 100,
                        align: 'center',
                        key: 'priority'
                    },
                    {
                        title: '生效时间',
                        width: 180,
                        key: 'startTime'
                    },
                    {
                        title: '失效时间',
                        width: 180,
                        key: 'endTime'
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
        if (!this.$route.params.id) {
            this.$Message.error('未找到相关广告位!');
            return;
        }
        this.table.queryFilter.advertPk = this.$route.params.id;
        this.fetchDataList();
	  },
	  methods: {
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
    		marketingAPI.fetchAdvertItemList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	},
        delteItem(id) {
            if (!id) {
                return;
            }
            this.dialog.delete.id = id;
            this.dialog.delete.show = true;
        },
        remove () {
            if (!this.dialog.delete.id) {
                this.$Message.error('删除失败!');
                return;
            }
            this.dialog.delete.loading = true;
            marketingAPI.bookAdvertItemDel({ id: this.dialog.delete.id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('删除节点成功!');
                    this.fetchDataList();
                } else {
                    this.$Message.error('删除节点失败!');
                }
            }).then(() => {
                this.dialog.delete.loading = false;
                this.dialog.delete.show = false;
            })
        },
	  }
	};
</script>

<style lang="scss" scoped>
.book-advert-list {
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
.book-advert-list {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }
}
</style>