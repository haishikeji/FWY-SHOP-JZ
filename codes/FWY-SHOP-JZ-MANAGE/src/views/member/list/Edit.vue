<template>
  <div class="member-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="140">
	        <FormItem label="头像" prop="profile" style="width: 30%; margin-bottom: 14px;">
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
			        :max-size="300"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleBeforeUpload"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;"
			        v-show="uploadList.length == 0">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	建议尺寸为120*120像素, 大小不超过300k
			    </div>
	        </FormItem>
	        <FormItem label="姓名" prop="nickname" style="width: 30%">
	            <Input v-model="formValidate.nickname" placeholder="请输入姓名" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="手机号(账号)" prop="phone" style="width: 30%">
	            <Input v-model="formValidate.phone" placeholder="请输入手机号(账号)" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="电子邮箱" prop="email" style="width: 30%">
	            <Input v-model="formValidate.email" placeholder="请输入电子邮箱" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="性别" prop="gender" style="width: 30%">
	            <RadioGroup v-model="formValidate.gender">
			        <Radio :label="'MALE'" :disabled="allRadyonly">
			            <span> 男</span>
			        </Radio>
			        <Radio :label="'FEMALE'" :disabled="allRadyonly">
			            <span> 女</span>
			        </Radio>
			    </RadioGroup>
	        </FormItem>
	        <FormItem label="兴趣标签" prop="tag" style="width: 30%">
	            <Input v-model="formValidate.tag" placeholder="请输入兴趣标签" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <!-- <FormItem label="账户余额" prop="balance" style="width: 30%">
	            <Input v-model="formValidate.balance" placeholder="请输入账户余额" :disabled="allRadyonly"></Input>
	        </FormItem> -->
	    </Form>
		<div style="padding-top: 20px; margin-top: 20px; margin-left: 90px; padding-left: 20px;" v-if="allRadyonly == true">
            <Button type="primary" @click="$router.go(-1)">返回</Button>
		</div>
		<div style="padding-top: 20px; margin-top: 20px; margin-left: 90px; padding-left: 20px;" v-else>
            <Button type="primary" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="$router.go(-1)" style="margin-left: 8px">返回</Button>
		</div>
	</div>

    <Modal title="查看图片" v-model="visible">
        <img :src="imgFullPath" v-if="visible" style="width: 100%">
    </Modal>

  </div>
</template>

<script>
	import { memberAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Icon, RadioGroup, Radio, Upload, Modal } from 'iview'

	export default {
	  name: "member-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		formValidate: {
	  			id: '',
	  			profile: '',
	  			nickname: '',
	  			phone: '',
	  			email: '',
	  			gender: 'MALE',
	  			tag: '',
	  			// balance: 0,
            },
            ruleValidate: {
                nickname: [
                    { required: true, message: '请输入姓名', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号(账号)', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入手机号(账号)', trigger: 'blur' }
                ],
            },
            imgFullPath: '',
            visible: false,
            defaultList: [],
            uploadList: [],
	  	}
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Icon, RadioGroup, Radio, Upload, Modal
	    },
	  mounted() {
	  	this.uploadList = this.$refs.upload.fileList;
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
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
		    		memberAPI.save(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'memberList', params: { id: this.formValidate.refAdvertPk } });
		    			} else {
		    				this.$Message.error(res.message || '保存失败!');
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		memberAPI.fetchDetail({ id }).then(res => {

            	let _coverPicArrs = [ { url: res.data.vo.profile, status: 'finished' } ];
            	this.$set(this.$refs.upload, 'fileList', _coverPicArrs);
            	this.uploadList = _coverPicArrs;

            	res.data.vo.phone = res.data.vo.member.phone;
            	res.data.vo.email = res.data.vo.member.email;
            	res.data.vo.gender = res.data.vo.member.gender;
            	res.data.vo.tag = res.data.vo.member.tag;

    			this.formValidate = res.data.vo;
        	});
        },
        handleView (fullPath) {
            this.imgFullPath = fullPath;
            this.visible = true;
        },
        handleRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.$refs.upload.fileList.splice(fileList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'profile', this.formValidate.profile.replace(file.url, ''));
        },
        handleSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
	            file.name = res.data.key;
	            let _urls = this.$refs.upload.fileList.map(item => item.url).join(',');
	            this.$set(this.formValidate, 'profile', _urls);
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
                desc: '文件: ' + file.name + ' 不能大于 300K.'
            });
        },
        handleBeforeUpload () {
            const check = this.uploadList.length < 1;
            if (!check) {
                this.$Notice.warning({
                    title: '最多上传9张绘本介绍主图.'
                });
            }
            return check;
        },
	  }
	};
</script>

<style lang="scss" scoped>
.member-edit-page {
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
}
</style>

<style lang="scss">
.member-edit-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>