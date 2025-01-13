<template>
  <div class="book-tag-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="分类名称" prop="name" style="width: 30%">
	            <Input v-model="formValidate.name" placeholder="请输入分类名称" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="是否启用" prop="status" style="width: 30%">
	            <GlobalSwitch v-model="formValidate.status" :true-value="'ENABLE'" :false-value="'DISABLE'" >
			        <span slot="open">是</span>
			        <span slot="close">否</span>
	            </GlobalSwitch>
	        </FormItem>
	        <FormItem label="内容" prop="content" style="width: 100%">
	            <!-- <Input v-model="formValidate.content" placeholder="请输入内容" :disabled="allRadyonly"></Input> -->
	            <mavon-editor ref="editor" v-model="formValidate.content" @imgAdd="$imgAdd" placeholder="请输入内容"></mavon-editor>
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

  </div>
</template>

<script>
	import { attentionAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Icon, CheckboxGroup, Checkbox } from 'iview'

	import {mavonEditor} from "mavon-editor";
	import "mavon-editor/dist/css/index.css";
	import axios from 'axios'

	export default {
	  name: "attention-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		formValidate: {
	  			id: '',
	  			name: '',
	  			content: '',
	  			status: 'ENABLE',
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入注意事项名称', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入注意事项名称', trigger: 'blur' }
                ],
            }
	  	}
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Icon, CheckboxGroup, Checkbox, mavonEditor
	    },
	  mounted() {
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
                	let apiOper = this.$route.meta.pageType == 'add' ? attentionAPI.save : attentionAPI.modify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'attentionList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		attentionAPI.fetchDetail({ id }).then(res => {
    			this.formValidate = res.data.vo;
        	});
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
.book-tag-page {
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