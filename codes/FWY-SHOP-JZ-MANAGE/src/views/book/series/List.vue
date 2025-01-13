<template>
  <div class="book-series-list">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
    	<div class="condition-item">
    		<span class="text">系列名称: </span>
			<Input v-model="table.queryFilter.seriesName" placeholder="请输入系列名称" style="width: 190px;"></Input>
    	</div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
		<div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
			<Button type="primary" @click="$router.push({ name: 'bookSeriesAdd' })">新增系列</Button>
		</div>
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="$router.push({ name: 'bookSeriesEdit', params: { id: row.id } })">修改</Button>
            </template>
        </Table>
	</div>

	<Modal v-model="dialog.delete.show" width="360" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>确认删除</span>
        </p>
        <div style="text-align:center">
	        <p>当前选择 1 项待删除数据.</p>
	        <p>是否继续删除?</p>
	    </div>
        <div slot="footer">
        	<Button type="error" size="large" long :loading="dialog.delete.loading" @click.native="remove">删除</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
	import { bookAPI } from '@/api';
	import { Button, Table, Input, Modal } from 'iview'

	export default {
	  name: "book-series",
	  data() {
	  	return {
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
	  			}
	  		},
	  		table: {
                queryFilter: {
                    seriesName: '',
                    pageNum: 1,
                    pageSize: 10,
                },
                cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '系列名称',
                        key: 'name'
                    },
                    {
                        title: '系列描述',
                        key: 'name'
                    },
                    {
                        title: '更新时间',
                        width: 160,
                        key: 'gmtModifyTime'
                    },
                    {
                        title: '创建人',
                        width: 160,
                        key: 'x'
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
			Button, Table, Input, Modal
	    },
	  mounted() {
        this.fetchDataList();
	  },
	  methods: {
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
    	fetchDataList() {
    		bookAPI.fetchSeriesList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
        	});
    	}
	  }
	};
</script>

<style lang="scss" scoped>
.book-series-list {
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
.book-series-list {
	
}
</style>