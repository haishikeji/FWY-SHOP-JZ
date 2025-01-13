<template>
  <div class="course-tag-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="标签名称" prop="name" style="width: 30%">
	            <Input v-model="formValidate.name" placeholder="请输入标签名称" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="标签颜色" prop="color" style="width: 30%">
	        	<ColorPicker v-model="formValidate.color" recommend :disabled="allRadyonly" />
	        </FormItem>
	        <FormItem label="是否显示在首页" prop="showHome" style="width: 60%" :disabled="allRadyonly">
	            <GlobalSwitch v-model="formValidate.showHome" :true-value="1" :false-value="0" >
			        <span slot="open">是</span>
			        <span slot="close">否</span>
	            </GlobalSwitch>
	        </FormItem>
	        <FormItem label="排序号" prop="priority" style="width: 60%">
	            <Input v-model="formValidate.priority" type="number" placeholder="请输入排序号"></Input>
	            <span style="color: #ff5959;">请填写数字 数字越小越靠前</span>
	        </FormItem>
	        <FormItem label="适用人群" prop="group" style="width: 60%">
	            <CheckboxGroup v-model="formValidate.group">
			        <Checkbox label="children">
			            <span> 儿童</span>
			        </Checkbox>
			        <Checkbox label="adult">
			            <span> 成人</span>
			        </Checkbox>
			    </CheckboxGroup>
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
	import { courseAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox } from 'iview'

	export default {
	  name: "home",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		provinces: [],
	  		citys: [],
	  		formValidate: {
	  			id: '',
	  			name: '',
	  			color: '#2D8CF0',
	  			showHome: 0,
	  			priority: 0,
	  			group: [],
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入标签名称', trigger: 'blur' }
                ],
                group: [
                	{ required: true, type: 'array', min: 1, message: '请至少选择一类适用人群', trigger: 'change' },
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
                	let apiOper = this.$route.meta.pageType == 'add' ? courseAPI.courseTagSave : courseAPI.courseTagModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
            		_params['fitChildren'] = 0
            		_params['fitAdult'] = 0
                	if (_params['group'].includes('children')) {
                		_params['fitChildren'] = 1
                	}
                	if (_params['group'].includes('adult')) {
                		_params['fitAdult'] = 1
                	}
                	delete _params['group'];
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'courseTagList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		courseAPI.fetchTagDetail({ id }).then(res => {
				let _group = [];
            	if (res.data.vo.fitChildren == 1) {
            		_group.push('children');
            	}
            	if (res.data.vo.fitAdult == 1) {
            		_group.push('adult');
            	}
            	res.data.vo['group'] = _group;
    			this.formValidate = res.data.vo;
        	});
        },
	  }
	};
</script>

<style lang="scss" scoped>
.course-tag-page {
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