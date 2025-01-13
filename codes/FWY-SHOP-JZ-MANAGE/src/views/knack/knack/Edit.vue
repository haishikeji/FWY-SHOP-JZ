<template>
  <div class="knack-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="窍门名称" prop="name" style="width: 30%">
	            <Input v-model="formValidate.name" placeholder="请输入窍门名称" :disabled="allRadyonly"/>
	        </FormItem>
	        <FormItem label="窍门列表图" prop="coverPicUrl" style="width: 30%; margin-bottom: 14px;">
			    <div class="demo-upload-list" v-for="item in uploadCoverList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
			                <Icon type="ios-trash-outline" @click.native="handleCoverRemove(item)"></Icon>
			            </div>
			        </template>
			        <template v-else>
			            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			        </template>
			    </div>
                <Upload
			        ref="uploadCover"
			        :show-upload-list="false"
			        :default-file-list="defaultCoverList"
			        :on-success="handleCoverSuccess"
			        :format="['jpg','jpeg','png']"
			        :max-size="2048"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleCoverBeforeUpload"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;"
			        v-show="uploadCoverList.length == 0">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	建议尺寸为XX*XX像素, 大小小于2M
			    </div>
	        </FormItem>
	        <!-- <FormItem label="窍门介绍主图" prop="masterPicUrl" style="width: 30%; margin-bottom: 14px;">
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
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	可添加多个, 建议尺寸为XX*XX像素, 大小小于2M
			    </div>
	        </FormItem> -->
	        <FormItem label="窍门分类" prop="types" style="width: 30%">
	            <Select v-model="types" filterable multiple placeholder="请选择线上窍门分类" :disabled="allRadyonly" @on-change="changeType">
	                <Option v-for="(item, index) in knackTypes" :value="item.id" :key="index">{{ item.name }}</Option>
	            </Select>
	        </FormItem>
			<FormItem label="作者" prop="author" style="width: 30%">
	            <Input v-model="formValidate.author" placeholder="请输入作者" :disabled="allRadyonly" />
	        </FormItem>
			<FormItem label="发布时间" prop="publishTime" style="width: 30%">
				<DatePicker type="date"  v-model="formValidate.publishTime"  placeholder="请输入发布时间" style="width: 200px"></DatePicker>
	        </FormItem>
			 <FormItem label="外部链接" prop="outLink" style="width: 30%">
	            <Input v-model="formValidate.outLink" placeholder="请输入外部链接" ></Input>
				<div style="margin-top: 10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	外部链接必须以“https”开头，填写外部链接后，下面的内容不需要填写
			    </div>
	        </FormItem>
	        <FormItem label="简要描述" prop="descript" style="width: 50%">
	            <Input v-model="formValidate.descript" type="textarea" :rows="5" :maxlength="500" show-word-limit placeholder="请输入简要描述" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="内容介绍" prop="content" style="width: 100%">
	            <!-- <Input v-model="formValidate.content" placeholder="请输入内容介绍" :disabled="allRadyonly"></Input> -->
	            <mavon-editor ref="editor" v-model="formValidate.content" @imgAdd="$imgAdd" placeholder="请输入内容介绍"></mavon-editor>
	        </FormItem>
	        <FormItem label="上下架" prop="shelfStatus" style="width: 60%" :disabled="allRadyonly">
	            <GlobalSwitch v-model="formValidate.shelfStatus" :true-value="1" :false-value="0" >
			        <span slot="open">上架</span>
			        <span slot="close">下架</span>
	            </GlobalSwitch>
	        </FormItem>
	    </Form>
		<div style="padding-top: 20px; margin-top: 20px; margin-left: 90px; padding-left: 20px;" v-if="allRadyonly == true">
            <Button type="primary" @click="$router.go(-1)">返回</Button>
		</div>
		<div style="padding-top: 20px; margin-top: 20px; margin-left: 90px; padding-left: 20px;" v-else>
            <Button type="primary" @click="handleSubmit('formValidate1')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
		</div>
	</div>
    <Modal title="查看图片" v-model="visible">
        <img :src="imgFullPath" v-if="visible" style="width: 100%">
    </Modal>

  </div>
</template>

<script>
	import { knackAPI, userAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal, DatePicker} from 'iview'

	import {mavonEditor} from "mavon-editor";
	import "mavon-editor/dist/css/index.css";
	import axios from 'axios'

	export default {
	  name: "knack-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		knackTypes: [],
	  		types: [],
	  		formValidate: {
	  			id: '',
	  			name: '',
	  			coverPicUrl: '',
				  refKnackTypePk: '',
				  publishTime: '',
				  masterPicUrl: '',
				  author : '',
				  outLink : '',
				  descript:'',
	  			content: '',
	  			shelfStatus: 0,
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入窍门名称', trigger: 'blur' }
                ],
                coverPicUrl: [
                    { required: true, message: '请选择窍门封面', trigger: 'change' }
                ],
            },
            imgFullPath: '',
            visible: false,
            defaultList: [],
            uploadList: [],

            uploadCoverList: [],
            defaultCoverList: [],
	  	}
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal, mavonEditor,DatePicker
	    },
	  mounted() {
	  	//this.uploadList = this.$refs.upload.fileList;
	  	this.uploadCoverList = this.$refs.uploadCover.fileList;
	  	this.fetchKnackTypes();
	  	if (this.$route.params.id) {
	  		this.fetchDetail(this.$route.params.id)
	  	}
	  	if (this.$route.meta.pageType == 'see') {
	  		this.allRadyonly = true;
	  	}
	  },
	  methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                	let apiOper = this.$route.meta.pageType == 'add' ? knackAPI.knackSave : knackAPI.knackModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
                	let _types = [];
                	this.types.map(type => {
                		_types.push({ id: type })
                	});
                	_params['types'] = _types;
					console.log()
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'knackList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		knackAPI.fetchDetail({ id }).then(res => {

            	if (res.data.vo.coverPicUrl) {
	            	let _coverPicArrs = [ { url: res.data.vo.coverPicUrl, status: 'finished' } ];
	            	this.$set(this.$refs.uploadCover, 'fileList', _coverPicArrs);
	            	this.uploadCoverList = _coverPicArrs;
	            }

            	if (res.data.vo.masterPicUrl) {
	            	let _masterArrs = res.data.vo.masterPicUrl.split(',');
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
            	

            	if (res.data.vo.types) {
            		this.types = res.data.vo.types.map(type => type.id);
            	}
    			this.formValidate = res.data.vo;
        	});
        },
        fetchKnackTypes() {
    		knackAPI.fetchTypeAll({ }).then(res => {
                if (res.code == 0) {
                    this.knackTypes = res.data.list;
                } else {
                    this.knackTypes = [];
                }
        	});
        },
        handleView (fullPath) {
            this.imgFullPath = fullPath;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'masterPicUrl', this.formValidate.masterPicUrl.replace(file.url, ''));
        },
        handleCoverRemove (file) {
            const fileCoverList = this.$refs.uploadCover.fileList;
            this.$refs.uploadCover.fileList.splice(fileCoverList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'coverPicUrl', '');
        },
        handleSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
	            file.name = res.data.key;
	            let _urls = this.$refs.upload.fileList.map(item => item.url).join(',');
	            this.$set(this.formValidate, 'masterPicUrl', _urls);
        	}
        },
        handleCoverSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
	            file.name = res.data.key;
	            this.$set(this.formValidate, 'coverPicUrl', res.data.fullPath);
        	}
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式限制',
                desc: '文件: ' + file.name + ' 格式不正确, 请上传: jpg/jpeg/png.'
            });
        },
        handleAMFormatError (file) {
            this.$Notice.warning({
                title: '文件格式限制',
                desc: '文件: ' + file.name + ' 格式不正确, 请上传: avi/mp3/mp4.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小限制',
                desc: '文件: ' + file.name + ' 不能大于 2M.'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 10;
            if (!check) {
                this.$Notice.warning({
                    title: '最多上传9张线上窍门介绍主图.'
                });
            }
            return check;
        },
        handleCoverBeforeUpload () {
            const check = this.uploadCoverList.length < 2;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一张线上窍门封面.'
                });
            }
            return check;
        },
        changeType(types) {
            this.types = types;
        },
        $imgAdd(pos, $file) {
        	// 第一步.将图片上传到服务器.
        	var formdata = new FormData();
        	formdata.append('file', $file);
        	formdata.append('dir', 'back');
        	axios({
        		url: this.$store.state.global.uploadUrl,
        		method: 'post',
        		data: formdata,
        		headers: { 'Content-Type': 'multipart/form-data' },
        	}).then((res) => {
	        	// 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
	        	/**
	        	* $vm 指为mavonEditor实例，可以通过如下两种方式获取
	        	* 2. 通过$refs获取: html声明ref : `<mavon-editor ref=md ></mavon-editor>，`$vm`为 `this.$refs.md`
	        	*/
	        	if (res.status == 200) {
	        		if (res.data.data.fullPath) {
	        			this.$refs['editor'].$img2Url(pos, res.data.data.fullPath);
	        		} else {
	        			this.$Error.warning({ title: '获取上传图片地址出错.' });
	        		}
	        	}
                this.$Error.warning({ title: '上传文件出错.' });
	        })
        }
	  }
	};
</script>

<style lang="scss" scoped>
.knack-edit-page {
	.title {
		font-size: 16px;
	    color: #808080;
	    font-weight: bold;
	    border-bottom: 1px solid #eee;
	    padding-bottom: 10px;
	    margin-bottom: 20px;
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
	.v-note-wrapper{ z-index:1 !important; }
}
</style>

<style lang="scss">
.knack-edit-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>