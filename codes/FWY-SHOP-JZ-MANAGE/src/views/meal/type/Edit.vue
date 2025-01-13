<template>
  <div class="meal-type-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="分类名称" prop="name" style="width: 30%">
	            <Input v-model="formValidate.name" placeholder="请输入分类名称" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="是否启用" prop="status" style="width: 60%" :disabled="allRadyonly">
	            <GlobalSwitch v-model="formValidate.status" :true-value="1" :false-value="0" >
			        <span slot="open">是</span>
			        <span slot="close">否</span>
	            </GlobalSwitch>
	        </FormItem>
	        <FormItem label="排序号" prop="priority" style="width: 60%">
	            <Input v-model="formValidate.priority" type="number" placeholder="请输入排序号"></Input>
	            <span style="color: #ff5959;">请填写数字 数字越小越靠前</span>
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
	import { mealAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox } from 'iview'

	export default {
	  name: "meal-type-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		formValidate: {
	  			id: '',
	  			name: '',
	  			status: 0,
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
			Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox
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
                	let apiOper = this.$route.meta.pageType == 'add' ? mealAPI.mealTypeSave : mealAPI.mealTypeModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'mealTypeList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		mealAPI.fetchTypeDetail({ id }).then(res => {
    			this.formValidate = res.data.vo;
        	});
        },
	  }
	};
</script>

<style lang="scss" scoped>
.meal-type-edit-page {
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