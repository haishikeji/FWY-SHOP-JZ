<template>
  <div class="case-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="问题" prop="projectName" style="width: 30%">
				<Input type="textarea" v-model="formValidate.name" :rows="5" :maxlength="500" placeholder="请输入问题"></Input>
	        </FormItem>
	       
	        <FormItem label="提问日期" prop="publishDate" style="width: 30%">
				<DatePicker type="date"  v-model="formValidate.publishDate"  placeholder="请输入提问日期" style="width: 200px"></DatePicker>
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
  </div>
</template>

<script>
	import { questionAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal,DatePicker } from 'iview'

	import {mavonEditor} from "mavon-editor";
	import "mavon-editor/dist/css/index.css";
	import axios from 'axios'

	export default {
	  name: "case-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
			buildTypes: [],
			businessList:[],
	  		formValidate: {
	  			id: '',
	  			name: '',
	  			publishDate: '',
				shelfStatus: 0,
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入问题', trigger: 'blur' }
                ]
            },
            visible: false,
	  	}
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal, mavonEditor,DatePicker
	    },
	  mounted() {
	  	if (this.$route.params.id) {
	  		this.fetchDetail(this.$route.params.id)
	  	}
	  },
	  methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                	let apiOper = this.$route.meta.pageType == 'add' ? questionAPI.zhuanjiaQuestionSave : questionAPI.zhuanjiaQuestionModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));

		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'zhuanjiaQuestionList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		questionAPI.fetchZhuanjiaQuestionDetail({ id }).then(res => {
    			this.formValidate = res.data.vo;
        	});
		},
	  }
	};
</script>

<style lang="scss" scoped>
.case-edit-page {
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
.case-edit-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>