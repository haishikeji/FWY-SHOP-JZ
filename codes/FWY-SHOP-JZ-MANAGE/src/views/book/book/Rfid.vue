<template>
  <div class="book-rfid-page">

    <div class='title'>
        {{$route.meta.title}}
    </div>

    <div class="filter-condition">
        <div class="condition-item">
            <span class="text">编码: </span>
            <Input v-model="table.queryFilter.rfid" placeholder="请输入RFID" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
        </div>
        <div class="condition-item" style="position: absolute; top: 0px; right: 100px;" :style="{ right: table.datas.length <= 0 ? '100px' : '0px' }">
            <Button @click="$router.go(-1)">返回</Button>
        </div>
        <div class="condition-item" style="position: absolute; top: 0px; right: 0px;" v-if="table.datas.length <= 0">
            <Button type="primary" @click="openAddRfidDialog">新增编码</Button>
        </div>
    </div>
    
    <div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="error" size="small" @click="openDeleteDialog(row.id)">删除</Button>
            </template>
        </Table>
    </div>


    <Modal v-model="dialog.edit.show" width="420" class-name="vertical-center-modal" :mask-closable="false">
        <p slot="header" style="color:#2d8cf0;text-align:center">
            <!-- <Icon type="ios-information-circle"></Icon> -->
            <span>添加编码</span>
        </p>
        <div style="text-align:center; padding-top: 20px;">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="60">
                <FormItem label="RFID" prop="planDay" style="width: 100%">
                    <Input v-model="formValidate.rfid" placeholder="请输入RFID" style="width: 100%;"></Input>
                </FormItem>
                <!-- <FormItem label="状态" prop="status" style="width: 100%">
                    <Input :value="'入库'" disabled></Input>
                </FormItem> -->
            </Form>
        </div>
        <div slot="footer">
            <Button type="success" size="large" style="width: 140px;" :loading="dialog.edit.loading" @click.native="handleSubmit('formValidate')">确认添加</Button>
        </div>
    </Modal>

    <Modal v-model="dialog.delete.show" width="360" class-name="vertical-center-modal" :mask-closable="false">
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
    import { rfidAPI } from '@/api';
    import { Button, Table, Input, Modal, Select, Option, Form, FormItem } from 'iview'

    export default {
      name: "book-rfid-page",
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
            statusMapping: {
                0: '入库',
                1: '出借',
                2: '出售',
            },
            formValidate: {
                refBookPk: '',
                rfid: '',
            },
            ruleValidate: {
                rfid: [
                    { required: true, type: 'string', message: '请输入RFID', trigger: 'blur' }
                ],
            },
            table: {
                queryFilter: {
                    refBookPk: '',
                },
                cols: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 80,
                        align: 'center'
                    },
                    {
                        title: '书籍RFID编码',
                        key: 'rfid',
                    },
                    // {
                    //     title: '书籍状态',
                    //     key: 'status',
                    //     width: 140,
                    //     render: (h, params) => {
                    //         let _val = params.row[params.column.key];
                    //         return h('span', this.statusMapping[_val])
                    //     }
                    // },
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
            Button, Table, Input, Modal, Select, Option, Form, FormItem
        },
      mounted() {
        this.table.queryFilter.refBookPk = this.$route.params.id;
        this.formValidate.refBookPk = this.$route.params.id;
        this.fetchDataList();
      },
      methods: {
        openAddRfidDialog() {
            this.dialog.edit.show = true;
        },
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
        fetchDataList() {
            rfidAPI.fetchRfidList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                } else {
                    this.table.datas = [];
                }
            });
        },
        openDeleteDialog(id) {
            this.dialog.delete.id = id;
            this.dialog.delete.show = true;
        },
        removeRef() {
            this.dialog.delete.loading = true;
            rfidAPI.rfidDel({ id: this.dialog.delete.id }).then(res => {
                this.dialog.delete.loading = false;
                if (res.code == 0) {
                    this.$Message.success('删除成功!');
                    this.fetchDataList();
                } else {
                    this.$Message.error('删除失败!');
                }
            }).then(() => {
                this.dialog.delete.show = false;
            });
        },
        handleSubmit(name) {
            this.dialog.edit.loading = true;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let apiOper = rfidAPI.rfidSave;
                    let _params = JSON.parse(JSON.stringify(this.formValidate));
                    _params['book'] = { id: _params['refBookPk'] }
                    delete _params['refBookPk']
                    apiOper(_params).then(res => {
                        if (res.code == 0) {
                            this.$Message.success('保存成功!');
                            this.search();
                            this.formValidate.rfid = '';
                            this.dialog.edit.loading = false;
                            this.dialog.edit.show = false;
                        } else {
                            this.$Message.error(res.message || '保存失败!');
                            this.dialog.edit.loading = false;
                        }
                    });
                } else {
                    this.dialog.edit.loading = false;
                    this.$Message.error('保存失败, 请检查表单数据是否正确!');
                }
            })
        },
      }
    };
</script>

<style lang="scss" scoped>
.book-rfid-page {
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
.book-rfid-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }   
}
</style>