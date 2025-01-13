<template>
  <div class="home">

	<div class='title'>
		APT组织管理
	</div>

	<div>
		<Button type="primary" @click="$router.push({ name: 'organAdd' })">新增APT组织</Button>
    	<!-- <Button type="primary" style="margin-left: 10px;">查看APT组织</Button> -->
	</div>

	<div style="margin-top: 20px;">
		<Table border ref="selection" :columns="table.cols" :data="table.datas">
	        <template slot-scope="{ row, index }" slot="action">
                <Button size="small" style="margin-right: 5px" @click="$router.push({ name: 'organSee', params: { id: row.id } })">详情</Button>
	            <Button type="primary" size="small" @click="$router.push({ name: 'organEdit', params: { id: row.id } })">修改</Button>
	        </template>
	    </Table>
	</div>

  </div>
</template>

<script>
	import { organAPI } from '@/api';
	import { Button, Table } from 'iview'

	export default {
	  name: "home",
	  data() {
	  	return {
	  		table: {
	  			cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    // {
                    //     type: 'selection',
                    //     width: 60,
                    //     align: 'center'
                    // },
                    {
                        title: '组织名称',
                        width: 260,
                        key: 'name'
                    },
                    {
                        title: '组织简介',
                        key: 'description'
                    },
                    {
                        title: '修改时间',
                        width: 160,
                        key: 'gmtModifyTime',
                        render: (h, params) => {
                        	let _val = params.row[params.column.key];
                        	return h('span', _val || params.row['gmtCreateTime'])
                        }
                    },
                    {
                        title: '操作',
                        width: 160,
                        align: 'center',
                        slot: 'action'
                    }
	  			],
	  			datas: [ ]
	  		}
	  	}
	  },
	    components: {
			Button, Table
	    },
	  mounted() {
	  	// this.fetchDataList();
	  },
	  methods: {
    	fetchDataList() {
    		organAPI.fetchList({ pageSize: 20000 }).then(res => {
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
.home {
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