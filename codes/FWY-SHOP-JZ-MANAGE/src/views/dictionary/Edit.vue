<template>
  <div class="dictionary-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="数据分类" prop="type" style="width: 30%">
	            <Input v-model="formValidate.type" placeholder="请输入数据分类" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="数据CODE" prop="code" style="width: 30%">
	            <Input v-model="formValidate.code" placeholder="请输入数据CODE" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="数据值" prop="value" style="width: 30%">
	            <Input v-model="formValidate.value" placeholder="请输入数据值" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="排序号" prop="priority" style="width: 30%">
	            <Input v-model="formValidate.priority" type="number" placeholder="请输入排序号"></Input>
	            <span style="color: #ff5959;">请填写数字 数字越小越靠前</span>
	        </FormItem>
	        <FormItem label="描述" prop="description" style="width: 30%">
	            <Input v-model="formValidate.description" placeholder="请输入数据值" :disabled="allRadyonly"></Input>
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
	import { commonAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Icon, CheckboxGroup, Checkbox } from 'iview'

	export default {
	  name: "dictionary-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		formValidate: {
	  			id: '',
	  			type: '',
	  			code: '',
	  			value: '',
	  			priority: 0,
	  			description: '',
            },
            ruleValidate: {
                type: [
                    { required: true, message: '请输入数据分类', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入数据CODE', trigger: 'blur' }
                ],
                value: [
                    { required: true, message: '请输入数据值', trigger: 'blur' }
                ],
            }
	  	}
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Icon, CheckboxGroup, Checkbox
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
                	let apiOper = this.$route.meta.pageType == 'add' ? commonAPI.dictionarySave : commonAPI.dictionaryModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'dictionaryList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		commonAPI.fetchDictionaryDetail({ id }).then(res => {
    			this.formValidate = res.data.vo;
        	});
        },
	  }
	};
</script>

<style lang="scss" scoped>
.dictionary-edit-page {
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