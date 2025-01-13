<template>
  <div class="question-category-list">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Row>
			<Col span="6">
				<Tree :data="treeNodes" :render="renderContent"></Tree>
			</Col>
			<Col span="18" style="padding-left: 70px;" v-if="selected.treeNode || oprType == 'add'">
				<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="110">
			        <FormItem label="分类名称" prop="name" style="width: 60%">
			            <Input v-model="formValidate.name" placeholder="请输入分类名称"></Input>
			        </FormItem>
			        <FormItem label="上级分类" style="width: 60%">
			            <Input v-model="selected.treeNodeTitle" disabled placeholder="请选择上级分类"></Input>
			        </FormItem>
			        <FormItem label="分类等级" prop="level" style="width: 60%">
			            <Select v-model.string="formValidate.level" disabled placeholder="请选择分类等级">
			                <Option v-for="(level, index) in levels" :value="level.code" :key="index">{{ level.name }}</Option>
			            </Select>
			        </FormItem>
			        <FormItem label="排序号" prop="priority" style="width: 60%">
			            <Input v-model="formValidate.priority" type="number" placeholder="请输入排序号"></Input>
			            <span style="color: #ff5959;">请填写数字 数字越小越靠前</span>
			        </FormItem>
			        <FormItem label="是否显示在首页" prop="showHome" style="width: 60%" v-if="formValidate.level == 1">
			            <GlobalSwitch v-model="formValidate.showHome" :true-value="1" :false-value="0" >
					        <span slot="open">是</span>
					        <span slot="close">否</span>
			            </GlobalSwitch>
			        </FormItem>
			    </Form>
				<div style="padding-top: 20px; margin-top: 20px; margin-left: 90px; padding-left: 20px;">
		            <Button type="primary" :loading="submitLoading" @click="handleSubmit('formValidate')">提交</Button>
				</div>
			</Col>
		</Row>
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
	import { questionAPI } from '@/api';
	import { Table, Input, Row, Col, Tree, Form, FormItem, Select, Option, CheckboxGroup, Checkbox, Modal } from 'iview'

	export default {
	  name: "question-category",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
	  		levels: [
	  			{
	  				code: 1,
	  				name: '1'
	  			},
	  			{
	  				code: 2,
	  				name: '2'
	  			}
	  		],
	  		oprType: '',
	  		selected: {
	  			treeNode: '',
	  			treeNodeTitle: '',
	  		},
	  		treeNodes: [
                {
                    title: '咨询分类',
                    id: '1',
                    expand: true,
                    render: (h, { root, node, data }) => {
                        return h('span', {
                        	class: {
                        		'ivu-tree-title': true
                        	},
                            style: {
                                display: 'inline-block',
                                width: '100%',
                            }
                        }, [
                            h('span', [
                                h('Icon', {
                                    props: {
                                        type: 'ios-folder-outline'
                                    },
                                    style: {
                                        marginRight: '8px'
                                    }
                                }),
                                h('span', data.title)
                            ]),
                            h('span', {
                                style: {
                                    display: 'inline-block',
                                    float: 'right',
                                    marginRight: '12px'
                                }
                            }, [
                                h('Button', {
                                    props: Object.assign({}, this.buttonProps, {
                                        icon: 'ios-add',
                                        type: 'primary'
                                    }),
                                    style: {
                                        width: '64px'
                                    },
                                    on: {
                                        click: () => { this.append(data) }
                                    }
                                })
                            ])
                        ]);
                    },
                    children: []
                }
            ],
            buttonProps: {
                type: 'default',
                size: 'small',
            },
            submitLoading: false,
	  		formValidate: {
	  			id: '',
	  			name: '',
                showHome: 0,
                level: 2,
                priority: 0,
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
              
            }
	  	}
	  },
	    components: {
			Table, Input, Row, Col, Tree, Form, FormItem, Select, Option, CheckboxGroup, Checkbox, Modal
	    },
	  mounted() {
	  	this.fetchDataTree();
	  },
	  methods: {
    	fetchDataTree() {
    		questionAPI.fetchTypeTree().then(res => {
    			if (res.code == 0) {
                	this.treeNodes[0].children = res.data.tree;
    			} else {
                	this.treeNodes[0] = [];
    			}
        	});
    	},
    	fetchDetail(id) {
    		questionAPI.fetchTypeDetail({ id: id }).then(res => {
    			if (res.code == 0) {
                	this.formValidate = res.data.vo;
    			} else {
                	Object.assign(this.$data.formValidate, this.$options.data().formValidate);
    			}
        	});
    	},
    	renderContent (h, { root, node, data }) {
            return h('span', {
            	class: {
            		'ivu-tree-title': true,
            		'ivu-tree-title-selected': data.selected
            	},
                style: {
                    display: 'inline-block',
                    width: '100%'
                },
                on: {
                	click: () => {
                		root.map(item => {
                			if (item.node.selected) {
            					this.$set(item.node, 'selected', false);
                			}
                		})
            			this.$set(data, 'selected', true);
                		this.changeSelectedNode(data.id, data.title)
                	}
                }
            }, [
                h('span', [
                    h('Icon', {
                        props: {
                            type: 'ios-paper-outline'
                        },
                        style: {
                            marginRight: '8px'
                        }
                    }),
                    h('span', data.title)
                ]),
                h('span', {
                    style: {
                        display: 'inline-block',
                        float: 'right',
                        marginRight: '12px'
                    }
                }, [
                    data.level < 2 ? h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-add'
                        }),
                        style: {
                            marginRight: '8px'
                        },
                        on: {
                            click: (e) => { e.stopPropagation(); this.append(data) }
                        }
                    }) : h('span'),
                    h('Button', {
                        props: Object.assign({}, this.buttonProps, {
                            icon: 'ios-remove'
                        }),
                        style: {
                            background: '#ff5959',
						    color: 'white',
						    borderColor: '#ff3636'
                        },
                        on: {
                            click: (e) => { 
                            	e.stopPropagation(); 
                            	this.dialog.delete.id = data.id;
                            	this.dialog.delete.show = true;
                            }
                        }
                    })
                ])
            ]);
        },
        append (data) {
        	this.oprType = 'add';
        	Object.assign(this.$data.formValidate, this.$options.data().formValidate);
        	if (data.nodeKey == 0) {
        		this.formValidate.level = 1;
    			this.formValidate.refParentPk = 0;
        	} else {
        		this.formValidate.level = 2;
    			this.formValidate.refParentPk = data.id;
        	}
    		this.selected.treeNodeTitle = data.title;
    		this.selected.treeNode = '';
        },
        remove () {
        	if (!this.dialog.delete.id) {
				this.$Message.error('删除失败!');
				return;
        	}
        	this.dialog.delete.loading = true;
    		questionAPI.questionTypeDel({ id: this.dialog.delete.id }).then(res => {
    			if (res.code == 0) {
					this.$Message.success('删除节点成功!');
					this.fetchDataTree();
    			} else {
					this.$Message.error('删除节点失败!');
    			}
        	}).then(() => {
        		this.dialog.delete.loading = false;
        		this.dialog.delete.show = false;
        	})
        },
        changeSelectedNode(id, title) {
            this.$set(this.selected, 'treeNode', id);
            this.$set(this.selected, 'treeNodeTitle', title);
            this.fetchDetail(id);
        },
        handleSubmit(name) {
        	this.submitLoading = true;
            this.$refs[name].validate((valid) => {
                if (valid) {
                	let apiOper = this.oprType == 'add' ? questionAPI.questionTypeSave : questionAPI.questionTypeModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
        					this.oprType = '';
							this.fetchDataTree();
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            }).then(() => {
        		this.submitLoading = false;
            })
        }
	  }
	};
</script>

<style lang="scss" scoped>
.question-category-list {
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
.question-category-list {
	.ivu-tree {
	    margin-top: -8px;
		ul {
			font-size: 14px;
		}
		&-arrow {
			margin-right: 6px;
			margin-top: 4px;
		}

		&-title {
			padding: 4px;
			&:hover {
				background: #d9f6ff;
			}
		}
	}
	.ivu-icon-ios-paper-outline {
			margin-top: -4px;
	}
}
</style>