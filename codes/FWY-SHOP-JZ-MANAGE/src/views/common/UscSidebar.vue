<template>
	<div class="usc-sidebar">
		<div class="sidebar-title">
			个人中心
		</div>
		<!-- <div class="hr"></div> -->
		<div class="menu-item" :class="{ 'actived': $route.meta.uscSidebarSelected == '1' }" @click="goto('uscIp')">
			我的知识产权
		</div>
		<div class="menu-item" :class="{ 'actived': $route.meta.uscSidebarSelected == '2' }" @click="goto('uscOrder')">
			我的订单
		</div>
		<div class="menu-item" :class="{ 'actived': $route.meta.uscSidebarSelected == '3' }" @click="goto('uscCertificate')">
			我的数字证书
		</div>
		<!-- <div class="hr"></div> -->
		<div class="menu-item" :class="{ 'actived': $route.meta.uscSidebarSelected == '4' }" @click="goto('uscMessage')">
			系统消息
		</div>
		<div class="menu-item" :class="{ 'actived': $route.meta.uscSidebarSelected == '5' }" @click="setQuestionModal(true)">
			问题反馈
		</div>
	</div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: "Usc-Sidebar",
    data() {
        return {
        	uscSidebarSelected: '1',
        }
    },
    mounted() {
    	this.uscSidebarSelected = this.$route.meta.uscSidebarSelected || '1';
    },
    methods: {
    	...mapActions([ 'setQuestionModal' ]),
    	goto(name) {
    		this.$router.push({ name: name });
    	}
    }
};
</script>
<style lang="scss" scoped>
@import "../../assets/sass/init.scss";

.usc-sidebar {
    font-family: "PingFangSC-Regular","Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","",Arial,sans-serif;
	width: 200px; 
	background: #fff;
	float: left;
	.sidebar-title {
		font-size: 19px; 
		color: #333333; 
		padding-left: 20px;
		margin-top: 28px;
		margin-bottom: 28px;
	}
	.hr {
		width: 100%; 
		background: #eee; 
		height: 1px;
		margin: 15px 0;
	}
	.menu-item {
		font-size: 14px; 
		color: #333;
		padding-left: 20px;
		height: 44px;
		line-height: 44px;
		// margin-bottom: 15px;
		cursor: pointer;
		&:hover {
			// color: white;
			// font-weight: 500;
			
			border: 1px solid #37B2FF;
		}
		&.actived {
			color: white;
			font-weight: 500;
			background: #37B2FF;
		}
	}
}

</style>