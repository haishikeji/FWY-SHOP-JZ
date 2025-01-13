<template>
  <div class="report-config-config-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            &nbsp;
        </div>
		<div class="condition-item" style="position: absolute; top: 0px; left: 0px;">
			<Button type="primary" @click="openAddConfigDialog">新增报告</Button>
		</div>
        <div class="condition-item" style="position: absolute; top: 0px; left: 150px;">
            <Button @click="$router.push({ name: 'productList' })">返回产品列表</Button>
        </div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" style="margin-right:10px;"  @click.native="fetchDetail(row.id)">修改</Button>
                <Button type="error" size="small" @click.native="openRemove(row.id)">删除</Button>
                
            </template>
        </Table>
	</div>

	<Modal v-model="dialog.edit.show" width="720" height="600" class-name="vertical-center-modal">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>报告添加</span>
        </p>
        <div style="margin-top: 20px;">
            <Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
                <FormItem label="报告名称" prop="reportName" style="width: 80%">
                    <Input v-model="formValidate.reportName" placeholder="请输入产品名称"></Input>
                </FormItem>
                <FormItem label="报告图片" prop="reportPicUrl" style="width: 80%; margin-bottom: 14px;">
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload
                        ref="upload"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png']"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        :action="this.$store.state.global.uploadUrl+'?dir=report'"
                        style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="ios-camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
                        可添加多个, 建议尺寸为XX*XX像素, 大小小于2M
                    </div>
                </FormItem>
            </Form>
        </div>
        <div slot="footer">
        	<Button v-if="opType=='add'" type="success" size="large" long :loading="dialog.edit.loading" @click.native="handleSubmit('formValidate1')">确认添加</Button>
            <Button v-if="opType=='edit'" type="success" size="large" long :loading="dialog.edit.loading" @click.native="handleSubmit('formValidate1')">确认修改</Button>
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
	import { productAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option, Form, FormItem, DatePicker, TimePicker, Row, Col, Upload } from 'iview'

	export default {
	  name: "case-config-config",
	  data() {
	  	return {
            formValidate: {
	  			id: '',
	  			reportName: '',
	  			reportPicUrl: '',
            }, 
            opType:'',
            uploadList: [], 
            defaultList: [],
            ruleValidate: {
                productName: [
                    { required: true, message: '请输入报告名称', trigger: 'blur' }
                ],
                reportPicUrl: [
                    { required: true, message: '请选择报告图片', trigger: 'change' }
                ],
            },
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			},
	  			edit: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
	  		table: {
                queryFilter: {
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
                        title: '报告名称',
                        key: 'reportName',
                    },
                    {
                        title: '操作',
                        width: 160,
                        align: 'center',
                        slot: 'action'
                    }
                ],
                datas: []
            }
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Select, Option, Form, FormItem, DatePicker, TimePicker, Row, Col,Upload
	    },
	  mounted() {
        this.uploadList = this.$refs.upload.fileList;
        this.fetchReportList();
	  },
	  methods: {
        search() {
            this.fetchReportList();
        },
    	fetchReportList() {
    		productAPI.fetchReportList({ productId: this.$route.params.id }).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	},
    	openAddConfigDialog() {
            this.uploadList = []
            this.defaultList = []
            let params = Object.keys(this.formValidate).forEach(key => (this.formValidate[key] = ""));
            this.dialog.edit.show = true;
            this.opType='add'
    	},
    	handleSubmit (name) {
        	// let apiOper = this.$route.meta.pageType == 'add' ? activityAPI.activityPlanSave : activityAPI.activityPlanModify;
        	this.$refs[name].validate((valid) => {
                if (valid) {
                	let apiOper = this.opType == 'add' ? productAPI.reportSave : productAPI.reportModify;
                    let _params = JSON.parse(JSON.stringify(this.formValidate));
                    _params.productId=this.$route.params.id
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
                            this.$Message.success('保存成功!');
                            this.search();
                            this.dialog.edit.show = false;
                        } else {
                            this.$Message.error(res.message || '保存失败!');
                            //this.dialog.edit.loading = false;
                        }
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        openRemove(id) {
            this.dialog.delete.id = id;
            this.dialog.delete.show = true;
        },
        fetchDetail(id) {
            this.dialog.edit.show = true;
            this.opType='edit'
             this.uploadList = []
            this.defaultList = []
            let params = Object.keys(this.formValidate).forEach(key => (this.formValidate[key] = ""));
    		productAPI.fetchReportDetail({ id }).then(res => {
            	if (res.data.vo.reportPicUrl) {
	            	let _masterArrs = res.data.vo.reportPicUrl.split(',');
	            	let _masterConvertArrs = [];
	            	_masterArrs.map(item => {
	            		_masterConvertArrs.push({
	            			url: item,
	            			status: 'finished'
	            		})
	            	})
	            	this.$set(this.$refs.upload, 'fileList', _masterConvertArrs);
	            	this.uploadList = _masterConvertArrs;
	            }
    			this.formValidate = res.data.vo;
        	});
		},
        remove () {
            if (!this.dialog.delete.id) {
                this.$Message.error('删除失败!');
                return;
            }
            this.dialog.delete.loading = true;
            productAPI.reportDel({  id: this.dialog.delete.id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('删除成功!');
                    this.search();
                } else {
                    this.$Message.error('删除失败!');
                }
            }).then(() => {
                this.dialog.delete.loading = false;
                this.dialog.delete.show = false;
            })
        },
        handleView (fullPath) {
            this.imgFullPath = fullPath;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'reportPicUrl', this.formValidate.reportPicUrl.replace(file.url, ''));
        },
        handleSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
	            file.name = res.data.key;
	            let _urls = this.$refs.upload.fileList.map(item => item.url).join(',');
                this.$set(this.formValidate, 'reportPicUrl', _urls);
                this.uploadList = this.$refs.upload.fileList;
        	}
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式限制',
                desc: '文件: ' + file.name + ' 格式不正确, 请上传: jpg/jpeg/png.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小限制',
                desc: '文件: ' + file.name + ' 不能大于 2M.'
            });
        },
        handleBeforeUpload () {
        },
	  }
	};
</script>

<style lang="scss" scoped>
.report-config-config-page {
	.title {
		font-size: 16px;
	    color: #808080;
	    font-weight: bold;
	    border-bottom: 1px solid #eee;
	    padding-bottom: 10px;
	    margin-bottom: 20px;
	}
}
.demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>

<style lang="scss">
.report-config-config-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }
}
</style>