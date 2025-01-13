<template>
  <div class="book-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="140">
	        <FormItem label="活动名称" prop="name" style="width: 30%">
	            <Input v-model="formValidate.name" placeholder="请输入活动名称" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="活动列表图" prop="coverPicUrl" style="width: 30%; margin-bottom: 14px;">
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
	        <FormItem label="活动介绍主图" prop="masterPicUrl" style="width: 30%; margin-bottom: 14px;">
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
	        </FormItem>
	        <FormItem label="适用人群" prop="group" style="width: 60%">
	            <CheckboxGroup v-model="formValidate.group" :true-value="1" :false-value="0" :disabled="allRadyonly">
			        <Checkbox label="children">
			            <span> 儿童</span>
			        </Checkbox>
			        <Checkbox label="adult">
			            <span> 成人</span>
			        </Checkbox>
			    </CheckboxGroup>
	        </FormItem>
	        <FormItem label="适合年龄段" prop="ages" style="width: 30%">
	            <CheckboxGroup v-model="ages" :disabled="allRadyonly">
			        <Checkbox :label="item.code" v-for="(item, index) in ageDatas" :key="index">
			            <span> {{ item.value }}</span>
			        </Checkbox>
			    </CheckboxGroup>
	        </FormItem>
	        <FormItem label="活动显示标签" prop="showTags" style="width: 30%">
	            <Input v-model="formValidate.showTags" placeholder="请输入活动显示标签" :disabled="allRadyonly"></Input>
	            多个用英文逗号分割, 如: 精读,L1阶
	        </FormItem>
	        <FormItem label="活动分类" prop="refActivityTypePk" style="width: 30%">
	            <Select v-model="formValidate.refActivityTypePk" filterable placeholder="请选择活动分类" :disabled="allRadyonly">
	                <Option v-for="(item, index) in acvitityTypes" :value="item.id" :key="index">{{ item.name }}</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="授课讲师/活动负责人" prop="refUserPk" style="width: 30%">
	            <Select v-model.number="formValidate.refUserPk" filterable placeholder="请选择授课讲师/活动负责人" :disabled="allRadyonly">
	                <Option :value="''">全部</Option>
	                <!-- <Option v-for="(item, index) in bookSeries" :value="item.id" :key="index">{{ item.name }}</Option> -->
	            </Select>
	        </FormItem>
	        <FormItem label="活动地址" prop="address" style="width: 30%">
	            <Input type="textarea" v-model="formValidate.address" placeholder="请输入活动地址" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="咨询电话" prop="tel" style="width: 30%">
	            <Input v-model="formValidate.tel" placeholder="请输入咨询电话" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="人数上限" prop="maxNum" style="width: 30%">
	            <Input v-model="formValidate.maxNum" type="number" placeholder="请输入人数上限" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="活动场地" prop="refPlacePk" style="width: 30%">
	            <Select v-model.number="formValidate.refPlacePk" filterable placeholder="请选择活动场地" :disabled="allRadyonly">
	                <Option v-for="(item, index) in placeDatas" :value="item.id" :key="index">{{ item.name }}</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="注意事项" prop="refAttentionPk" style="width: 30%">
	            <Select v-model.number="formValidate.refAttentionPk" filterable placeholder="请选择注意事项" :disabled="allRadyonly">
	                <Option v-for="(item, index) in attentionDatas" :value="item.id" :key="index">{{ item.name }}</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="语言" prop="language" style="width: 30%">
	            <RadioGroup v-model="formValidate.language" :disabled="allRadyonly">
			        <Radio label="CHINA">
			            <span> 中文</span>
			        </Radio>
			        <Radio label="ENGLISH">
			            <span> 英文</span>
			        </Radio>
			    </RadioGroup>
	        </FormItem>
	        <FormItem label="活动费用" prop="price" style="width: 30%">
	            <Input v-model="formValidate.price" type="number" placeholder="请输入活动费用" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="活动划线价格" prop="oldPrice" style="width: 30%">
	            <Input v-model="formValidate.oldPrice" type="number" placeholder="请输入活动划线价格" :disabled="allRadyonly"></Input>
	        </FormItem>
	        <FormItem label="音频介绍" prop="audioDescUrl" style="width: 50%">
	            <Upload
			        ref="uploadADCover"
			        :default-file-list="uploadADCoverList"
			        :on-success="handleADCoverSuccess"
			        :on-remove="handleADRemove"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:100%;">
			        <div style="padding: 20px 0">
			            <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
			            <p>点击或拖拽文件进行上传</p>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	支持MP3格式，最大200M, 在课程详情页播放
			    </div>
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
	import { activityAPI, placeAPI, attentionAPI, commonAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal } from 'iview'

	import {mavonEditor} from "mavon-editor";
	import "mavon-editor/dist/css/index.css";
	import axios from 'axios'

	export default {
	  name: "home",
	  data() {
	  	return {
	  		allRadyonly: false,
	  		acvitityTypes: [],
	  		placeDatas: [],
	  		attentionDatas: [],
	  		ageDatas: [],
  			ages: [],
	  		formValidate: {
	  			id: '',
	  			name: '',
	  			coverPicUrl: '',
	  			masterPicUrl: '',
	  			audioDescUrl: '',
	  			showTags: '',
	  			fitChildren: '',
	  			fitAdult: '',
	  			language: 'CHINA',
	  			price: '',
	  			oldPrice: '',
	  			content: '',
	  			shelfStatus: 0,
	  			refActivityTypePk: '',
	  			refUserPk: '',
	  			address: '',
	  			tel: '',
	  			maxNum: '',
	  			refPlacePk: '',
	  			refAttentionPk: '',
	  			group: [],
            },
            ruleValidate: {
                name: [
                    { required: true, message: '请输入活动名称', trigger: 'blur' }
                ],
                coverPicUrl: [
                    { required: true, message: '请选择活动封面', trigger: 'change' }
                ],
                masterPicUrl: [
                    { required: true, message: '请选择活动介绍主图', trigger: 'change' }
                ],
                group: [
                	{ required: true, type: 'array', min: 1, message: '请至少选择一类适用人群', trigger: 'change' },
                ],
            },
            imgFullPath: '',
            visible: false,
            defaultList: [],
            uploadList: [],

            uploadCoverList: [],
            defaultCoverList: [],
            uploadADCoverList: [],
	  	}
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal, mavonEditor
	    },
	  mounted() {
	  	this.uploadList = this.$refs.upload.fileList;
	  	this.uploadCoverList = this.$refs.uploadCover.fileList;
	  	this.fetchActivityTypes();
	  	this.fetchPlaceList();
	  	this.fetchAttentionList();
	  	this.fetchAgeList();
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
                	let apiOper = this.$route.meta.pageType == 'add' ? activityAPI.activitySave : activityAPI.activityModify;
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

                	let _ages = [];
                	this.ages.map(age => {
                		_ages.push({ id: age })
                	});
                	_params['ages'] = _ages;

                	if (_params['refActivityTypePk']) {
						_params['activityType'] = { id: _params['refActivityTypePk'] }
                	}
                	delete _params['refActivityTypePk'];

                	if (_params['refPlacePk']) {
						_params['place'] = { id: _params['refPlacePk'] }
                	}
                	delete _params['refPlacePk'];

                	if (_params['refAttentionPk']) {
						_params['attention'] = { id: _params['refAttentionPk'] }
                	}
                	delete _params['refAttentionPk'];

		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'activityList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		activityAPI.fetchActivityDetail({ id }).then(res => {
				let _group = [];
            	if (res.data.vo.fitChildren == 1) {
            		_group.push('children');
            	}
            	if (res.data.vo.fitAdult == 1) {
            		_group.push('adult');
            	}
            	res.data.vo['group'] = _group;

            	if (res.data.vo['activityType']) {
            		res.data.vo.refActivityTypePk = res.data.vo['activityType'].id;
                	delete res.data.vo['activityType'];
            	}
            	if (res.data.vo['place']) {
            		res.data.vo.refPlacePk = res.data.vo['place'].id;
                	delete res.data.vo['place'];
            	}
            	if (res.data.vo['attention']) {
            		res.data.vo.refAttentionPk = res.data.vo['attention'].id;
                	delete res.data.vo['attention'];
            	}
            	this.ages = (res.data.vo.ages || []).map(age => age.id);

            	let _coverPicArrs = [ { url: res.data.vo.coverPicUrl, status: 'finished' } ];
            	this.$set(this.$refs.uploadCover, 'fileList', _coverPicArrs);
            	this.uploadCoverList = _coverPicArrs;

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

            	if (res.data.vo.audioDescUrl) {
	            	let _audioDescUrlPicArrs = [ { url: res.data.vo.audioDescUrl, name: res.data.vo.audioDescUrl, status: 'finished' } ];
	            	this.$set(this.$refs.uploadADCover, 'fileList', _audioDescUrlPicArrs);
	            	this.uploadADCoverList = _audioDescUrlPicArrs;
            	}

            	this.ages = res.data.vo.ages.map(age => age.id);

    			this.formValidate = res.data.vo;
        	});
        },
        fetchActivityTypes() {
    		activityAPI.fetchActivityTypeList({ pageSize: 5000 }).then(res => {
                if (res.code == 0) {
                    this.acvitityTypes = res.data.list;
                } else {
                    this.acvitityTypes = [];
                }
        	});
        },
        fetchPlaceList() {
    		placeAPI.fetchPlaceList({ pageSize: 5000 }).then(res => {
                if (res.code == 0) {
                    this.placeDatas = res.data.list;
                } else {
                    this.placeDatas = [];
                }
        	});
        },
        fetchAttentionList() {
    		attentionAPI.fetchList({ pageSize: 5000 }).then(res => {
                if (res.code == 0) {
                    this.attentionDatas = res.data.list;
                } else {
                    this.attentionDatas = [];
                }
        	});
        },
        fetchAgeList() {
    		commonAPI.fetchDictByType({ type: 'AGE_RANGE' }).then(res => {
                if (res.code == 0) {
                	res.data.list.map(item => {
                		item['code'] = parseInt(item['code']);
                	})
                    this.ageDatas = res.data.list;
                } else {
                    this.ageDatas = [];
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
        handleADRemove (file) {
            const fileCoverList = this.$refs.uploadADCover.fileList;
            this.$refs.uploadADCover.fileList.splice(fileCoverList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'audioDescUrl', '');
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
        handleADCoverSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
	            file.name = res.data.key;
	            this.$set(this.formValidate, 'audioDescUrl', res.data.fullPath);
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
            const check = this.uploadList.length < 10;
            if (!check) {
                this.$Notice.warning({
                    title: '最多上传9张活动介绍主图.'
                });
            }
            return check;
        },
        handleCoverBeforeUpload () {
            const check = this.uploadCoverList.length < 2;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一张活动封面.'
                });
            }
            return check;
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
.book-edit-page {
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
.book-edit-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>