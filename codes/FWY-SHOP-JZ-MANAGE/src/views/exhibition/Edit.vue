<template>
  <div class="business-edit-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div style="margin-top: 20px;">
		<Form ref="formValidate1" :model="formValidate" :rules="ruleValidate" :label-width="110">
	        <FormItem label="展厅名称" prop="exhibitionHallName" style="width: 30%">
	            <Input v-model="formValidate.exhibitionHallName" placeholder="请输入展厅名称" :disabled="allRadyonly"></Input>
	        </FormItem>

	        <FormItem label="关联商家" prop="busiId" style="width: 30%">
	            <Select v-model="formValidate.busiId" placeholder="请选择关联商家" :disabled="allRadyonly">
	                <Option v-for="(item, index) in busis" :value="item.id" :key="index">{{ item.name }}</Option>
	            </Select>
	        </FormItem>

	        <FormItem label="列表图" prop="chartAddress" style="width: 30%; margin-bottom: 14px;">
			    <div class="demo-upload-list" v-for="item in uploadChartAddressList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
			                <Icon type="ios-trash-outline" @click.native="handleChartAddressRemove(item)"></Icon>
			            </div>
			        </template>
			        <template v-else>
			            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			        </template>
			    </div>
                <Upload
			        ref="uploadChartAddress"
			        :show-upload-list="false"
			        :default-file-list="defaultChartAddressList"
			        :on-success="handleChartAddressSuccess"
			        :format="['jpg','jpeg','png']"
			        :max-size="2048"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleChartAddressBeforeUpload"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;"
			        v-show="uploadChartAddressList.length == 0">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	建议尺寸为XX*XX像素, 大小小于2M
			    </div>
	        </FormItem>

	        <FormItem label="介绍图" prop="introductionPic" style="width: 30%; margin-bottom: 14px;">
			    <div class="demo-upload-list" v-for="item in uploadIntroductionPicList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
			                <Icon type="ios-trash-outline" @click.native="handleIntroductionPicRemove(item)"></Icon>
			            </div>
			        </template>
			        <template v-else>
			            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			        </template>
			    </div>
                <Upload
			        ref="uploadIntroductionPic"
			        :show-upload-list="false"
			        :default-file-list="defaultIntroductionPicList"
			        :on-success="handleIntroductionPicSuccess"
			        :format="['jpg','jpeg','png']"
			        :max-size="2048"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleIntroductionPicBeforeUpload"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;"
			        v-show="uploadIntroductionPicList.length < 9">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	建议尺寸为XX*XX像素, 大小小于2M
			    </div>
	        </FormItem>

	        <FormItem label="视频" prop="videoAddress" style="width: 30%; margin-bottom: 14px;">
			    <div class="demo-upload-list" v-for="item in uploadVideoAddressList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-trash-outline" @click.native="handleVideoAddressRemove(item)"></Icon>
			            </div>
			        </template>
			        <template v-else>
			            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			        </template>
			    </div>
                <Upload
			        ref="uploadVideoAddress"
			        :show-upload-list="false"
			        :default-file-list="defaultVideoAddressList"
			        :on-success="handleVideoAddressSuccess"
			        :format="['mp4']"
			        :max-size="10048"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleVideoAddressBeforeUpload"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;"
			        v-show="uploadVideoAddressList.length == 0">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	建议尺寸为XX*XX像素, 大小小于2M
			    </div>
	        </FormItem>

	        <!-- <FormItem label="视频封面图" prop="name" style="width: 30%">
	            <Input v-model="formValidate.name" placeholder="请输入视频封面图"></Input>
	        </FormItem> -->

	        <FormItem label="地址" prop="address" style="width: 30%">
	            <Input v-model="formValidate.address" placeholder="请输入地址"></Input>
	        </FormItem>

	        <FormItem label="经度" prop="longitude" style="width: 30%">
	            <Input v-model="formValidate.longitude" placeholder="请输入经度"></Input>
	        </FormItem>

	        <FormItem label="纬度" prop="latitude" style="width: 30%">
	            <Input v-model="formValidate.latitude" placeholder="请输入纬度"></Input>
	        </FormItem>

	        <FormItem label="面积" prop="area" style="width: 30%">
	            <Input v-model="formValidate.area" placeholder="请输入面积"></Input>
	        </FormItem>

	        <!-- <FormItem label="分类标签" prop="categoryLabel" style="width: 30%">
	            <Input v-model="formValidate.categoryLabel" placeholder="请输入分类标签"></Input>
	        </FormItem> -->

	        <FormItem label="营业开始时间" prop="startTime" style="width: 30%">
	            <TimePicker type="time" v-model="formValidate.startTime" hide-disabled-options placeholder="请选择营业开始时间" format="HH:mm"></TimePicker>
	        </FormItem>

	        <FormItem label="营业结束时间" prop="endTime" style="width: 30%">
                <TimePicker type="time" v-model="formValidate.endTime" hide-disabled-options placeholder="请选择营业结束时间" format="HH:mm"></TimePicker>
	        </FormItem>

	        <FormItem label="联系电话" prop="contactNumber" style="width: 30%">
	            <Input v-model="formValidate.contactNumber" placeholder="请输入联系电话"></Input>
	        </FormItem>

	        <FormItem label="联系人" prop="contactPerson" style="width: 30%">
	            <Input v-model="formValidate.contactPerson" placeholder="请输入联系人"></Input>
	        </FormItem>

	        <FormItem label="是否可以接送" prop="receiveSend" style="width: 30%">
	            <GlobalSwitch v-model="formValidate.receiveSend" :true-value="'1'" :false-value="'0'" >
			        <span slot="open">接送</span>
			        <span slot="close">不接送</span>
	            </GlobalSwitch>
	        </FormItem>

	        <FormItem label="接送人数要求" prop="numberRequirement" style="width: 30%">
	            <Input v-model="formValidate.numberRequirement" placeholder="请输入接送人数要求"></Input>
	        </FormItem>

	        <FormItem label="位置标签" prop="locationLabel" style="width: 30%">
                <vue-tags-input
                    v-model="formValidate.locationLabel"
                    :tags="locationLabelTags"
                    placeholder="添加标签"
                    @tags-changed="newTags => locationLabelTags = newTags"
                />
	        </FormItem>

	        <FormItem label="产品标签" prop="productionLabel" style="width: 30%">
                <vue-tags-input
                    v-model="formValidate.productionLabel"
                    :tags="productionLabelTags"
                    placeholder="添加标签"
                    @tags-changed="newTags => productionLabelTags = newTags"
                />
	        </FormItem>

	        <FormItem label="展厅介绍" prop="exhibitionHallIntroduction" style="width: 100%">
	            <mavon-editor ref="editor0" v-model="formValidate.exhibitionHallIntroduction" @imgAdd="$imgAdd0" placeholder="请输入展厅介绍"></mavon-editor>
	        </FormItem>

	        <FormItem label="注意事项" prop="attention" style="width: 100%">
                <mavon-editor ref="editor1" v-model="formValidate.attention" @imgAdd="$imgAdd1" placeholder="请输入展厅介绍"></mavon-editor>
	        </FormItem>

	        <!-- <FormItem label="拨打电话人数" prop="numberCalls" style="width: 30%">
	            <Input v-model="formValidate.numberCalls" placeholder="请输入注意事项"></Input>
	        </FormItem> -->

	        <FormItem label="状态" prop="applicationStatus" style="width: 30%">
	            <GlobalSwitch v-model="formValidate.applicationStatus" :true-value="'1'" :false-value="'0'" >
			        <span slot="open">启用</span>
			        <span slot="close">禁用</span>
	            </GlobalSwitch>
	        </FormItem>

	        <FormItem label="排序号" prop="sortNum" style="width: 30%">
	            <Input v-model="formValidate.sortNum" placeholder="请输入排序号"></Input>
	        </FormItem>

	        <!-- <FormItem label="是否突出显示" prop="highlight" style="width: 30%">
	            <GlobalSwitch v-model="formValidate.highlight" :true-value="'1'" :false-value="'0'" >
			        <span slot="open">突出显示</span>
			        <span slot="close">不突出显示</span>
	            </GlobalSwitch>
	        </FormItem> -->

	        <FormItem label="是否置顶" prop="top" style="width: 30%">
	            <GlobalSwitch v-model="formValidate.top" :true-value="1" :false-value="0" >
			        <span slot="open">置顶</span>
			        <span slot="close">不置顶</span>
	            </GlobalSwitch>
	        </FormItem>



	        <!-- <FormItem label="商家logo" prop="logo" style="width: 30%; margin-bottom: 14px;">
			    <div class="demo-upload-list" v-for="item in uploadLogoList">
			        <template v-if="item.status === 'finished'">
			            <img :src="item.url">
			            <div class="demo-upload-list-cover">
			                <Icon type="ios-eye-outline" @click.native="handleView(item.url)"></Icon>
			                <Icon type="ios-trash-outline" @click.native="handleLogoRemove(item)"></Icon>
			            </div>
			        </template>
			        <template v-else>
			            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
			        </template>
			    </div>
                <Upload
			        ref="uploadLogo"
			        :show-upload-list="false"
			        :default-file-list="defaultLogoList"
			        :on-success="handleLogoSuccess"
			        :format="['jpg','jpeg','png']"
			        :max-size="2048"
			        :on-format-error="handleFormatError"
			        :on-exceeded-size="handleMaxSize"
			        :before-upload="handleLogoBeforeUpload"
			        multiple
			        type="drag"
			        :action="this.$store.state.global.uploadUrl"
			        style="display: inline-block;width:58px;"
			        v-show="uploadLogoList.length == 0">
			        <div style="width: 58px;height:58px;line-height: 58px;">
			            <Icon type="ios-camera" size="20"></Icon>
			        </div>
			    </Upload>
			    <div style="margin-top: -10px; color: #e07f51; height: 28px; margin-bottom: 10px;">
			    	建议尺寸为XX*XX像素, 大小小于2M
			    </div>
	        </FormItem>
			<FormItem label="地址" prop="author" style="width: 30%">
	            <Input v-model="formValidate.addr" placeholder="请输入地址" />
	        </FormItem>
			<FormItem label="展厅位置" prop="author" style="width: 30%">
	            <Input v-model="formValidate.showroomAddr" placeholder="请输入展厅位置" />
	        </FormItem>
			<FormItem label="联系人" prop="author" style="width: 30%">
	            <Input v-model="formValidate.contactUser" placeholder="请输入联系人" />
	        </FormItem>
			<FormItem label="联系电话" prop="author" style="width: 30%">
	            <Input v-model="formValidate.contactPhone" placeholder="请输入联系电话" />
	        </FormItem>
	        <FormItem label="覆盖区域" prop="fuwuCitys" style="width: 30%">
	            <Select v-model="selectedProvice" filterable multiple search placeholder="请选择覆盖区域" :disabled="allRadyonly">
	                <Option v-for="(item, index) in province" :value="item.id" :key="index">{{ item.name }}</Option>
	            </Select>
	        </FormItem>
	        <FormItem label="上下架" prop="shelfStatus" style="width: 60%" :disabled="allRadyonly">
	            <GlobalSwitch v-model="formValidate.shelfStatus" :true-value="1" :false-value="0" >
			        <span slot="open">上架</span>
			        <span slot="close">下架</span>
	            </GlobalSwitch>
	        </FormItem> -->
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
	import { businessAPI, exhibitionAPI } from '@/api';
	import { Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal, TimePicker } from 'iview'

    import VueTagsInput from '@johmun/vue-tags-input';
	import {mavonEditor} from "mavon-editor";
	import "mavon-editor/dist/css/index.css";
	import axios from 'axios'

	export default {
	  name: "bokk-edit",
	  data() {
	  	return {
	  		allRadyonly: false,
            locationLabelTags: [],
            productionLabelTags: [],
			busis: [],
	  		formValidate: {
	  			id: '',
                exhibitionHallName: '',
                chartAddress: '',
                introductionPic: '',
                videoAddress: '',
                address: '',
                longitude: '',
                latitude: '',
                area: 0,
                categoryLabel: '',
                startTime: '',
                endTime: '',
                contactNumber: '',
                contactPerson: '',
                receiveSend: '0',
                numberRequirement: '',
                locationLabel: '',
                productionLabel: '',
                exhibitionHallName: '',
                exhibitionHallIntroduction: '',
                attention: '',
                numberCalls: '',
                applicationStatus: '1',
                sortNum: 0,
                highlight: '0',
                top: 0
            },
            ruleValidate: {
                exhibitionHallName: [
                    { required: true, message: '请输入展厅名称', trigger: 'blur' }
                ],
                busiId: [
                    { type: 'number', required: true, message: '请选择商家', trigger: 'change' }
                ],
                // logo: [
                //     { required: true, message: '请选择商家LOGO', trigger: 'change' }
                // ],
			},
            imgFullPath: '',
            visible: false,
			uploadChartAddressList: [],
			defaultChartAddressList: [],
			uploadIntroductionPicList: [],
			defaultIntroductionPicList: [],
			uploadVideoAddressList: [],
			defaultVideoAddressList: []
	  	}
	  },
	  watch: {
	  	
	  },
	    components: {
			Row, Col, Form, FormItem, Input, Button, Select, Option, Icon, ColorPicker, 
            CheckboxGroup, Checkbox, RadioGroup, Radio, Tag, Upload, Modal, mavonEditor, TimePicker, VueTagsInput
	    },
	  mounted() {
        // this.$nextTick(() => {
        //     console.log(this.$refs);
        // })
		this.fetchBusiDatas();
        this.uploadChartAddressList = this.$refs.uploadChartAddress.fileList;
        this.uploadIntroductionPicList = this.$refs.uploadIntroductionPic.fileList;
        this.uploadVideoAddressList = this.$refs.uploadVideoAddress.fileList;
	  	if (this.$route.params.id) {
	  		this.fetchDetail(this.$route.params.id)
	  	}
	  	if (this.$route.meta.pageType == 'see') {
	  		this.allRadyonly = true;
	  	}
	  },
	  methods: {
        fetchBusiDatas() {
    		businessAPI.fetchList({ pageSize: 99999 }).then(res => {
                if (res.code == 0) {
                    this.busis = res.data.list;
                } else {
                    this.busis = [];
                }
        	});
        },
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                	let apiOper = this.$route.meta.pageType == 'add' ? exhibitionAPI.exhibitionSave : exhibitionAPI.exhibitionModify;
                	let _params = JSON.parse(JSON.stringify(this.formValidate));
                    if (this.locationLabelTags && this.locationLabelTags.length) {
                        _params.locationLabel = this.locationLabelTags.map(l => l.text).join(',')
                    }
                    if (this.productionLabelTags && this.productionLabelTags.length) {
                        _params.productionLabel = this.productionLabelTags.map(l => l.text).join(',')
                    }
		    		apiOper(_params).then(res => {
		    			if (res.code == 0) {
							this.$Message.success('保存成功!');
		    				this.$router.push({ name: 'exhibitionList' })
		    			}
		        	});
                } else {
					this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
        fetchDetail(id) {
    		exhibitionAPI.fetchDetail({ id }).then(res => {
            	let _coverPicArrs = [ { url: res.data.vo.chartAddress, status: 'finished' } ];
            	this.$set(this.$refs.uploadChartAddress, 'fileList', _coverPicArrs);
            	this.uploadChartAddressList = _coverPicArrs;

				let _coverPicArrs1 = []
				res.data.vo.introductionPic.split(',').map(r => {
					_coverPicArrs1.push(
						{ url: r, status: 'finished' }
					)
				})
            	// let _coverPicArrs1 = [ { url: res.data.vo.introductionPic, status: 'finished' } ];
            	this.$set(this.$refs.uploadIntroductionPic, 'fileList', _coverPicArrs1);
            	this.uploadIntroductionPicList = _coverPicArrs1;

            	let _coverPicArrs2 = [ { url: res.data.vo.videoAddress, status: 'finished' } ];
            	this.$set(this.$refs.uploadVideoAddress, 'fileList', _coverPicArrs2);
            	this.uploadVideoAddressList = _coverPicArrs2;

                if (res.data.vo.locationLabel) {
                    let _arrs = res.data.vo.locationLabel.split(',')
                    let _converted = [];
                    if (_arrs && _arrs.length) {
                        _arrs.map(r => {
                            _converted.push({
                                "text": r, 
                                "tiClasses": [ "ti-valid" ]
                            })
                        })
                    }
                    this.locationLabelTags = _converted;
                    res.data.vo.locationLabel = ''
                }
                if (res.data.vo.productionLabel) {
                    let _arrs = res.data.vo.productionLabel.split(',')
                    let _converted = [];
                    if (_arrs && _arrs.length) {
                        _arrs.map(r => {
                            _converted.push({
                                "text": r, 
                                "tiClasses": [ "ti-valid" ]
                            })
                        })
                    }
                    this.productionLabelTags = _converted;
                    res.data.vo.productionLabel = ''
                }

				this.formValidate = res.data.vo;
        	});
        },
        fetchCitys() {
    	/* 	businessAPI.fetchTypeList({ pageSize: 5000 }).then(res => {
                if (res.code == 0) {
                    this.businessTypes = res.data.list;
                } else {
                    this.businessTypes = [];
                }
        	}); */
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
        handleChartAddressRemove (file) {
            const fileChartAddressList = this.$refs.uploadChartAddress.fileList;
            this.$refs.uploadChartAddress.fileList.splice(fileChartAddressList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'chartAddress', '');
        },
        handleChartAddressSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
				file.name = res.data.key;
				console.log(this.uploadChartAddressList)
	            this.$set(this.formValidate, 'chartAddress', res.data.fullPath);
        	}
        },
        handleFormatError (file) {
            this.$Notice.warning({
                title: '文件格式限制',
                desc: '文件: ' + file.name + ' 格式不正确.'
            });
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小限制',
                desc: '文件: ' + file.name + ' 不能大于 2M.'
            });
        },
        handleChartAddressBeforeUpload () {
            const check = this.uploadChartAddressList.length < 2;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一张列表图.'
                });
            }
            return check;
        },

        handleIntroductionPicBeforeUpload () {
            const check = this.uploadIntroductionPicList.length < 10;
            if (!check) {
                this.$Notice.warning({
                    title: '最多上传九张介绍图.'
                });
            }
            return check;
        },
        handleIntroductionPicRemove (file) {
            const fileIntroductionPicList = this.$refs.uploadIntroductionPic.fileList;
            this.$refs.uploadIntroductionPic.fileList.splice(fileIntroductionPicList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'introductionPic', '');
        },
        handleIntroductionPicSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
				file.name = res.data.key;
				console.log(this.uploadIntroductionPicList)
				let _urls = this.$refs.uploadIntroductionPic.fileList.map(item => item.url).join(',');
	            this.$set(this.formValidate, 'introductionPic', _urls);
        	}
        },
        handleVideoAddressBeforeUpload () {
            const check = this.uploadVideoAddressList.length < 2;
            if (!check) {
                this.$Notice.warning({
                    title: '只能上传一个视频.'
                });
            }
            return check;
        },
        handleVideoAddressRemove (file) {
            const fileVideoAddressList = this.$refs.uploadVideoAddress.fileList;
            this.$refs.uploadVideoAddress.fileList.splice(fileVideoAddressList.findIndex(item => item.url == file.url), 1);
            this.$set(this.formValidate, 'videoAddress', '');
        },
        handleVideoAddressSuccess (res, file) {
        	if (res.code == 0) {
	            file.url = res.data.fullPath;
				file.name = res.data.key;
				console.log(this.uploadVideoAddressList)
	            this.$set(this.formValidate, 'videoAddress', res.data.fullPath);
        	}
        },

        $imgAdd0(pos, $file) {
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
				debugger;
	        	if (res.status == 200) {
	        		if (res.data.data.fullPath) {
	        			this.$refs['editor0'].$img2Url(pos, res.data.data.fullPath);
	        		} else {
	        			this.$Error.warning({ title: '获取上传图片地址出错.' });
	        		}
	        	} else {
                	this.$Error.warning({ title: '上传文件出错.' });
				}
	        })
        },
        $imgAdd1(pos, $file) {
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
	        			this.$refs['editor1'].$img2Url(pos, res.data.data.fullPath);
	        		} else {
	        			this.$Error.warning({ title: '获取上传图片地址出错.' });
	        		}
	        	} else {
                	this.$Error.warning({ title: '上传文件出错.' });
				}
	        })
        }
	  }
	};
</script>

<style lang="scss" scoped>
.business-edit-page {
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
.business-edit-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>