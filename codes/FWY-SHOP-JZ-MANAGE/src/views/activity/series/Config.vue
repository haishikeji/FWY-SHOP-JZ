<template>
  <div class="activity-series-config-page">

    <div class='title'>
        {{$route.meta.title}}
    </div>

    <div class="filter-condition">
        <div class="condition-item">
            &nbnsp;
        </div>
        <div class="condition-item" style="position: absolute; top: 0px; left: 0px;">
            <Button type="primary" @click="fetchAllActivityList">活动添加</Button>
        </div>
    </div>
    
    <div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="small" @click="openDeleteDialog(row.id)">删除</Button>
            </template>
        </Table>
    </div>



    <Modal v-model="dialog.edit.show" width="820" class-name="vertical-center-modal">
       <!--  <p slot="header" style="color:#2d8cf0;text-align:center">
            <span>活动添加</span>
        </p> -->
        <div style="text-align:center; padding-top: 20px;">
            <div class="filter-condition">
                <div class="condition-item">
                    <span class="text">活动名称: </span>
                    <Input v-model="dialogTable.queryFilter.activityName" placeholder="请输入活动名称" style="width: 190px;"></Input>
                </div>
                <div class="condition-item">
                    <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="dialogSearch">查询</Button>
                </div>
            </div>
            <Table border ref="selection" :columns="dialogTable.cols" :data="dialogTable.datas" @on-select="selectionSelect" @on-select-cancel="cancelSelectionSelect" @on-select-all="selectAll" @on-select-all-cancel="cancelSelectAll"></Table>
        </div>
        <div slot="footer">
            <Button type="success" size="large" long style="width: 140px" :loading="dialog.edit.loading" @click.native="batchAddProcess">添加</Button>
        </div>
    </Modal>

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
            <Button type="error" size="large" long :loading="dialog.delete.loading" @click.native="removeRef">删除</Button>
        </div>
    </Modal>

  </div>
</template>

<script>
    import { activityAPI } from '@/api';
    import { Button, Table, Input, Modal, Select, Option } from 'iview'

    export default {
      name: "activity-series-config-page",
      data() {
        return {
            dialog: {
                delete: {
                    show: false,
                    loading: false,
                    id: '',
                },
                edit: {
                    show: false,
                    loading: false,
                    id: '',
                }
            },
            selected: {
                refIds: []
            },
            dialogTable: {
                queryFilter: {
                    activityName: '',
                },
                cols: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '活动名称',
                        key: 'name',
                        width: 240,
                    },
                    {
                        title: '适合人群',
                        key: 'group',
                        render: (h, params) => {
                            let _fitChildren = params.row['fitChildren'];
                            let _fitAdult = params.row['fitAdult'];
                            let arrs = [];
                            if (_fitChildren == 1) {
                                arrs.push('儿童');
                            }
                            if (_fitAdult == 1) {
                                arrs.push('成人');
                            }
                            return h('span', arrs.join(','));
                        }
                    },
                    {
                        title: '活动费用',
                        key: 'price',
                        width: 100,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            let _fitChildren = params.row['fitChildren'];
                            return h('span', _value + '元');
                        }
                    },
                    {
                        title: '活动场地',
                        key: 'place',
                        width: 100,
                        render: (h, params) => {
                            let _ref = params.row[params.column.key];
                            return h('span', _ref ? _ref['name'] : '');
                        }
                    },
                    {
                        title: '适合年龄段',
                        key: 'agesConvert'
                    }
                ],
                datas: [ ]
            },
            table: {
                queryFilter: {
                    id: '',
                    pageSize: 50000,
                },
                cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '活动名称',
                        key: 'name',
                        width: 240,
                    },
                    {
                        title: '适合人群',
                        key: 'group',
                        render: (h, params) => {
                            let _fitChildren = params.row['fitChildren'];
                            let _fitAdult = params.row['fitAdult'];
                            let arrs = [];
                            if (_fitChildren == 1) {
                                arrs.push('儿童');
                            }
                            if (_fitAdult == 1) {
                                arrs.push('成人');
                            }
                            return h('span', arrs.join(','));
                        }
                    },
                    {
                        title: '活动费用',
                        key: 'price',
                        width: 100,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            let _fitChildren = params.row['fitChildren'];
                            return h('span', _value + '元');
                        }
                    },
                    {
                        title: '活动场地',
                        key: 'place',
                        width: 100,
                        render: (h, params) => {
                            let _ref = params.row[params.column.key];
                            return h('span', _ref ? _ref['name'] : '');
                        }
                    },
                    {
                        title: '适合年龄段',
                        key: 'agesConvert'
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
            Button, Table, Input, Modal, Select, Option
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
            activityAPI.fetchActivityBySeries(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    let _selectedIds = [];
                    res.data.list.map(item => {
                        item['agesConvert'] = item.ages.map(age => age.name).join(', ');
                        _selectedIds.push(item.id);
                    });
                    this.$set(this.selected, 'refIds', _selectedIds);
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
            });
        },
        fetchAllActivityList() {
            activityAPI.fetchActivityList(this.dialogTable.queryFilter).then(res => {
                if (res.code == 0) {
                    res.data.list.map(item => {
                        item['agesConvert'] = item.ages.map(age => age.name).join(', ');
                        if (this.selected.refIds.includes(item.id)) {
                            item['_checked'] = true;
                        }
                    });
                    this.dialogTable.datas = res.data.list;
                    this.dialog.edit.show = true;
                } else {
                    this.dialogTable.datas = [];
                }
            });
        },
        dialogSearch() {
            this.dialogTable.queryFilter.pageNum = 1;
            this.fetchAllActivityList();
        },
        openDeleteDialog(refId) {
            this.dialog.delete.id = refId;
            this.dialog.delete.show = true;
        },
        removeRef(refId) {
            this.dialog.delete.loading = true;
            activityAPI.seriesDeleteRef({ seriesId: this.$route.params.id, refId: this.dialog.delete.id }).then(res => {
                this.dialog.delete.loading = false;
                if (res.code == 0) {
                    this.$Message.success('删除成功!');
                    this.fetchDataList();
                    this.dialog.delete.show = false;
                } else {
                    this.$Message.error('删除失败!');
                }
            });
        },
        batchAddProcess() {
            this.dialog.edit.loading = true;
            activityAPI.seriesBatchRefs({ seriesId: this.$route.params.id, refIds: this.selected.refIds.join(',') }).then(res => {
                this.dialog.edit.loading = false;
                if (res.code == 0) {
                    this.$Message.success('添加成功!');
                    this.fetchDataList();
                    this.dialog.edit.show = false;
                } else {
                    this.$Message.error('添加失败!');
                }
            });
        },
        selectionSelect(selection, row) {
            if (!this.selected.refIds.includes(row.id)) {
                this.selected.refIds.push(row.id)
            }
        },
        cancelSelectionSelect(selection, row) {
            this.selected.refIds.splice(this.selected.refIds.findIndex(item => item.id === row.id), 1)
        },
        selectAll(selection) {
            let _ids = selection.map(item => item.id);
            this.$set(this.selected, 'refIds', this.uniqueArr(this.selected.refIds.concat(_ids)));
        },
        cancelSelectAll(selection) {
            this.dialogTable.datas.map(row => {
                this.selected.refIds.splice(this.selected.refIds.findIndex(item => item.id === row.id), 1)
            })
        },
        uniqueArr(array) {
            var n = []; //一个新的临时数组
            //遍历当前数组
            for (var i = 0; i < array.length; i++) {
                //如果当前数组的第i已经保存进了临时数组，那么跳过，
                //否则把当前项push到临时数组里面
                if (n.indexOf(array[i]) == -1) n.push(array[i]);
            }
            return n;
        }
      }
    };
</script>

<style lang="scss" scoped>
.activity-series-config-page {
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
.activity-series-config-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }   
}
</style>