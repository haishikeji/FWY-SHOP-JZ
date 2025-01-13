<template>
  <div class="course-series-enroll-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">学员姓名: </span>
            <Input v-model="table.queryFilter.nickname" placeholder="请输入学员姓名" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">手机号: </span>
            <Input v-model="table.queryFilter.phone" placeholder="请输入手机号" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
        </div>
        <div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
            <Button @click="$router.push({ name: 'courseSeriesList' })">返回</Button>
        </div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
        </Table>
	</div>
  </div>
</template>

<script>
	import { courseAPI } from '@/api';
	import { Button, Table, Input, Row, Col } from 'iview'

	export default {
	  name: "course-series-enroll-page",
	  data() {
	  	return {
	  		table: {
                queryFilter: {
                    id: '',
                    nickname: '',
                    phone: '',
                },
                cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '会员姓名',
                        key: 'nickname',
                    },
                    {
                        title: '手机号',
                        key: 'phone',
                    },
                    {
                        title: '性别',
                        key: 'x',
                    },
                    {
                        title: '宝宝年龄',
                        key: 'x'
                    },
                    {
                        title: '最新登录时间',
                        width: 160,
                        key: 'lastLoginTime'
                    },
                    {
                        title: '加入时间',
                        width: 160,
                        key: 'joinTime'
                    },
                    {
                        title: '推荐人',
                        width: 160,
                        key: 'x'
                    }
                ],
                datas: [ ]
            },
	  	}
	  },
	    components: {
			Button, Table, Input, Row, Col
	    },
	  mounted() {
        this.table.queryFilter.id = this.$route.params.id;
        this.fetchDataList();
	  },
	  methods: {
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
    		courseAPI.fetchCourseSeriesEnrollMemberList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	},
	  }
	};
</script>

<style lang="scss" scoped>
.course-series-enroll-page {
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

<style lang="scss">
.course-series-enroll-page {
}
</style>