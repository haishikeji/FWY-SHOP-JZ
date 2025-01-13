<template>
    <div class="common-ip-detail">

    	<div class="step-body-wrap">

			<div class="title" style="margin-top: 10px;">
	            {{ titles[0] || '作品信息' }}
	        </div>

			<!-- <div v-if="ip.ipCategory == 'TM'" class="content-wrap">
	            <div class="content-item">
	                <div style="width: 50%;">商标注册号: {{ ip.regNum }}</div>
	                <div style="width: 50%;">商标图例: <img :src="ip.draftImgUrl" style="width: 70px; vertical-align: middle;" ></div>
	            </div>
	            <div class="content-item" v-if="hideOpr">
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <div class="content-item"  v-if="info.show || !hideOpr">
	                <div style="width: 50%;">名称: {{ ip.name }}</div>
	                <div style="width: 50%;">作者: {{ ip.author }}</div>
	            </div>
	            <div class="content-item"  v-if="info.show || !hideOpr">
	                <div style="width: 50%;">国际分类: {{ ip.internationalCategory }}</div>
	                <div style="width: 50%;">注册人: {{ ip.registrant }}</div>
	            </div>
	            <div class="content-item"  v-if="info.show || !hideOpr">
	                <div style="width: 100%;">注册人地址: {{ ip.registrantAddress }}</div>
	            </div>
	            <div class="content-item"  v-if="info.show || !hideOpr">
	                <div style="width: 50%;">注册日期: {{ ip.regDate }}</div>
	                <div style="width: 50%;">有效期至: {{ ip.endDate }}</div>
	            </div>
	            <div class="content-item"  v-if="info.show || !hideOpr">
	                <div style="width: 100%;">商标注册证: <img :src="ip.certificateImgUrl" style="width: 70px; vertical-align: middle;" ></div>
	            </div>
	        </div> -->


			<div v-if="ip.ipCategory == 'TM'" class="content-wrap">
	            <div class="content-item">
	                <div style="width: 50%;">商标注册号: {{ ip.regNum }}</div>
	                <div style="width: 50%;">商标名称: {{ ip.name }}</div>
	            </div>
	            <div class="content-item">
	                <div style="width: 50%;">国际分类: {{ ip.internationalCategory }}</div>
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <div class="split-hr" style="background: #f8f8f8; margin-bottom: 6px; margin-top: 22px;" v-if="info.show || !hideOpr"></div>

	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">注册人地址: {{ ip.registrantAddress }}</div>
	                <div style="width: 50%;">注册人: {{ ip.registrant }}</div>
	            </div>

	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">注册日期: {{ ip.regDate }}</div>
	                <div style="width: 50%;">有效期至: {{ ip.endDate }}</div>
	            </div>
	            <div class="split-hr" style="background: #f8f8f8; margin-bottom: 6px; margin-top: 22px;" v-if="info.show || !hideOpr"></div>

	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">核定使用商品/服务： {{ ip.serveFor }}</div>
	            </div>

	            <div class="split-hr" style="background: #f8f8f8; margin-bottom: 6px; margin-top: 22px;" v-if="info.show || !hideOpr"></div>

	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">商标图样: <img :src="ip.draftImgUrl" style="width: 70px; vertical-align: middle;" ></div>
	                <div style="width: 50%;">商标注册证: <img :src="ip.certificateImgUrl" style="width: 70px; vertical-align: middle;" ></div>
	            </div>

	        </div>

			<div v-if="ip.ipCategory == 'PATENT'" class="content-wrap">
	            <div class="content-item">
	                <div style="width: 50%;">专利类别: {{ categoryConvert(ip.category) }}</div>
	                <div style="width: 50%;">专利名称: {{ ip.name }}</div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	            <div class="content-item">
	                <div style="width: 50%;">专利号: {{ ip.num }}</div>
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">发明人: {{ ip.author }}</div>
	                <div style="width: 50%;">申请日期: {{ ip.applyDate }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">专利权人: {{ ip.owner }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">地址: {{ ip.address }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">授权公告日: {{ ip.announceDate }}</div>
	                <div style="width: 50%;">授权公告号: {{ ip.announceNumber }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item"  v-if="info.show || !hideOpr">
	                <div style="width: 100%;">证书照片: <img :src="ip.certificateImgUrl" style="width: 70px; vertical-align: middle;" ></div>
	            </div>
	        </div>

	        <div class="content-wrap" v-if="ip.ipCategory == 'COPYRIGHT'">
	            <div class="content-item">
	                <div style="width: 50%;">登记号: {{ ip.regNum }}</div>
	                <div style="width: 50%;">作品名称: {{ ip.name }}</div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	            <div class="content-item">
	                <div style="width: 50%;">作品类别: {{ dicts.worksCopyrightTypes[ip.subCategory] }}</div>
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">作者: {{ ip.author }}</div>
	                <div style="width: 50%;">著作权人: {{ ip.owner }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">创作完成日期: {{ ip.createTime }}</div>
	                <div style="width: 50%;">首次发表日期: {{ ip.firstPubTime }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">登记日期: {{ ip.regDate }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">证书照片: <img :src="ip.certPhotoUrl" style="width: 70px; vertical-align: middle;" ></div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	        </div>

			<div class="content-wrap" v-if="ip.ipCategory == 'SW_COPYRIGHT'">
	            <div class="content-item">
	                <div style="width: 50%;">登记号: {{ ip.regNum }}</div>
	                <div style="width: 50%;">软件名称: {{ ip.name }}</div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	            <div class="content-item">
	                <div style="width: 50%;">专利权人: {{ ip.owner }}</div>
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">开发完成日期: {{ ip.devTime }}</div>
	                <div style="width: 50%;">首次发表日期: {{ ip.firstPubTime }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">权利取得方式: {{ dicts.softCopyrightObtainTypes[ip.obtainType] }}</div>
	                <div style="width: 50%;">权利拥有状况: {{ convertStatus(ip.ownStatus) }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">登记日期: {{ ip.regDate }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">证书照片: <img :src="ip.certPhotoUrl" style="width: 70px; vertical-align: middle;" ></div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	        </div>

	        <div class="content-wrap" v-if="ip.ipCategory == 'DIGITAL_WORKS'">
	            <div class="content-item">
	                <div style="width: 50%;">类别: {{ dicts.worksCopyrightTypes[ip.subCategory] }}</div>
	                <div style="width: 50%;">名称: {{ ip.name }}</div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	            <div class="content-item">
	                <div style="width: 50%;">作者: {{ ip.author }}</div>
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">著作人名称: {{ ip.owner }}</div>
	                <div style="width: 50%;">创作完成日期: {{ ip.createTime }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 50%;">首次发表日期: {{ ip.firstPubTime }}</div>
	            </div>
	            <!--<div class="split-hr"  v-if="info.show || !hideOpr"></div>-->
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">作品文件: 
	                    <div v-for="(_imgUrl, _index) in ip.files.split(',')" :key="'file' + _index">
	                        <img :src="_imgUrl" style="width: 70px; vertical-align: middle;" >
	                    </div>
	                </div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	        </div>

	        <div class="content-wrap" v-if="ip.ipCategory == 'ORIGINALITY'">
	            <div class="content-item">
	                <div style="width: 50%;">创意领域: {{ dicts.originalityFieldTypes[ip.field] }}</div>
	                <div style="width: 50%;">创意名称: {{ ip.name }}</div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	            <div class="content-item">
	                <div style="width: 50%;">证件号码: {{ ip.idNumber }}</div>
	                <div style="width: 50%;">创意人: {{ ip.author }}</div>
	            </div>
	            <div class="content-item">
	                <div style="width: 50%;" v-if="ip.attachment">创意附件: <img src="/images/usc/file-icon.png" style="width: 11px; vertical-align: middle; margin-right: 5px; position: relative; top: -1px;"><a :href="ip.attachment" target="_blank">{{ getFilename(ip.attachment) }}</a></div>
	                <div style="width: 50%;" v-if="!ip.attachment">创意附件: 无</div>
	                <div style="width: 50%; color: #37B2FF; cursor: pointer;" v-if="hideOpr" @click="info.show = !info.show">{{ info.show ? '...隐藏详情' : '...展开详情' }}</div>
	            </div>
	            <div class="split-hr" style="background: #f8f8f8; margin-bottom: 6px; margin-top: 22px;" v-if="info.show || !hideOpr"></div>
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">灵感来源: {{ ip.source }}</div>
	            </div>
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">创意摘要: {{ ip.summary }}</div>
	            </div>
	            <div class="content-item" v-if="info.show || !hideOpr">
	                <div style="width: 100%;">创意详情: 
						<div style="position: relative; top: -22px; margin-left: 66px; word-break: break-word;">{{ ip.details }}</div>
	                </div>
	            </div>
	            <!--<div class="split-hr"></div>-->
	        </div>

	        <div class="title" :style="{ 'margin-top': ip.ipCategory == 'ORIGINALITY' && info.show == true ? '0px' : '28px' }">
	            {{ titles[1] || '联系人信息' }}
	        </div>

	        <div class="content-wrap">
	            <div class="content-item">
	                <div style="width: 50%;">联系人姓名: {{ ip.contact }}</div>
	                <div style="width: 50%;">联系人电话: {{ ip.contactTel }}</div>
	            </div>
	        </div>

	    </div>
    </div>
</template>
<script>

import { ipAPI, commonAPI } from '@/api';

export default {
    name: "ip-detail",
    data() {
        return {
        	ip: {},
            dicts: {
            	ipSource: {},
            	orderType: {},
            	worksCopyrightTypes: {},
            	softCopyrightObtainTypes: {},
            	softCopyrightOwnStatus: {},
                originalityFieldTypes: {}
            },
            info: {
            	show: false
            }
        }
    },
	model: {
		prop: 'id',
		event: 'change'
	},
    props: [ 'id', 'hideOpr', 'titles' ],
    watch: {
    	'id': {
    		immediate: true,
    		handler(val) {
            	this.fetchDetail(val);
    		}
    	}
    },
    mounted() {
    	this.fetchDicts();
    },
    methods: {
    	fetchDicts() {
    		commonAPI.fetchDicts({}).then(res => {
        		if (res.success && res.code == 0) {
                    this.dicts.ipSource = res.data.ipSource;
                    this.dicts.originalityFieldTypes = res.data.originalityFieldType;
                    this.dicts.orderType = res.data.orderType;
                    this.dicts.worksCopyrightTypes = res.data.worksCopyrightType;
                    this.dicts.softCopyrightObtainTypes = res.data.softCopyrightObtainType;
                    this.dicts.softCopyrightOwnStatus = res.data.softCopyrightOwnStatus;
        		} else {
                    this.dicts.ipSource = {};
                    this.dicts.originalityFieldTypes = {};
                    this.dicts.orderType = {};
                    this.dicts.worksCopyrightTypes = {};
                    this.dicts.softCopyrightObtainTypes = {};
                    this.dicts.softCopyrightOwnStatus = {};
        		}
        	});
    	},
    	fetchDetail(id) {
			ipAPI.fetchIpMineDetail({ id: id }).then(res => {
				if (res.success) {
					this.ip = res.data;
				}
			});
    	},
    	categoryConvert(str) {
			let txt = str;
			if (txt == 'INVENTION') {
				txt = '发明专利';
			} else if (txt == 'APPEARANCE') {
				txt = '外观设计';
			} else if (txt == 'UTILITY_MODEL') {
				txt = '实用新型';
			}
			return txt;
    	},
    	convertStatus(str) {
    		if (str) {
    			let arr = str.split(',');
    			let result = [];
    			arr.map(item => {
    				result.push(this.dicts.softCopyrightOwnStatus[item]);
    			});
    			return result.join(',');
    		}
    		return str;
    	},
    	getFilename(url) {
    		if (!url) return '';
    		let arr = url.split('/');
    		if (arr && arr.length > 0) {
    			return arr[arr.length - 1];
    		}
    	}
	}
};
</script>
<style lang="scss" scoped>
@import "../../assets/sass/init.scss";

.common-ip-detail {
    font-family: "PingFangSC-Regular","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","",Arial,sans-serif;

    .title {
        // height: 44px;
        // width: 762px;
        margin: 0px auto;
        // line-height: 44px;
        padding-left: 20px;
        // background: #f9f9f9;
        font-weight: bold;
        font-size: 18px;
        color: #333;
        letter-spacing: 0;
    }


    .step-body-wrap {
    	.content-wrap {
			display: flex; 
			flex-wrap: wrap; 
			// width: 650px; 
			margin: 0 auto; 
			font-size: 14px; 
			color: #666666; 
			letter-spacing: 0;
			.content-item {
				width: 100%; 
				display: flex; 
				flex-wrap: wrap;
				padding-left: 20px;
                margin-top: 16px;
			}
			.split-hr {
				width: 100%;
				width: 100%; 
				margin: 20px auto; 
				height: 1px; 
				background-image: linear-gradient(to right, #eee 0%, #eee 50%, transparent 50%); 
				background-size: 8px 1px; 
				background-repeat: repeat-x;
			}
    	}
		.pre-btn {
			margin-right: 10px; 
			color: #333; 
			background: #fff; 
			border: 1px solid #999999; 
			height:41px; 
			font-size: 16px; 
			width: 142px;
			&:hover {
				border-color: #E52E3A;
				color: #E52E3A;
			}
		}
		.next-btn {
			margin-left: 10px; 
			background: #E52E3A; 
			border-color: #E52E3A; 
			height:41px; 
			font-size: 16px; 
			width: 142px;
			color: white;
			&:hover {
				background: #ff0018;
			}
		}

    	.see-my-info {
    		width: 136px; 
    		height: 28px; 
    		position: relative; 
    		right: 20px; 
    		background: #333; 
    		color: white; 
    		line-height: 28px; 
    		position: absolute; 
    		right: 8px; 
    		top: 8px; 
    		font-size: 14px; 
    		text-align: center; 
    		cursor: pointer; 
    		display: inline-block;
    		&:hover {
    			background: #E52E3A;
    		}
    	}
    }

}
</style>