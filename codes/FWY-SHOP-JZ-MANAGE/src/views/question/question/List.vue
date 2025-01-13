<template>
  <div class="question-list-page">

	<div class='title'>
		{{$route.meta.title}}
	</div>

	<div class="filter-condition">
        <div class="condition-item">
            <span class="text">问题: </span>
            <Input v-model="table.queryFilter.questionName" placeholder="请输入问题" style="width: 190px;"></Input>
        </div>
        <div class="condition-item">
            <span class="text">上架状态: </span>
            <Select v-model.number="table.queryFilter.shelfStatus" placeholder="请选择上架状态" style="width: 190px;">
                <Option v-for="(item, index) in shelfStatusArrs" :value="item.code" :key="index">{{ item.name }}</Option>
            </Select>
        </div>
    	<div class="condition-item">
            <Button type="error" size="small" style="padding: 6px 14px; background: #20b7a2; border-color: #20b7a2;" @click="search">查询</Button>
    	</div>
		<!-- <div class="condition-item" style="position: absolute; top: 0px; right: 0px;">
			<Button type="primary" @click="$router.push({ name: 'questionAdd' })">新增标准</Button>
		</div> -->
    </div>
	
	<div style="margin-top: 20px;">
        <Table border ref="selection" :columns="table.cols" :data="table.datas">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="primary" size="small" @click="openInfoDialog(row.id)">详情</Button>
                <Button type="error" size="small" style="margin-left: 10px;" @click="openDeleteDialog(row.id)">删除</Button>
            </template>
        </Table>
        <Page :total="table.queryFilter.total" :page-size="table.queryFilter.pageSize" :current="table.queryFilter.pageNum" show-total @on-change="mofidyPageNum" />
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
    <Modal v-model="dialog.info.show" width="800" :z-index="999999"  class-name="vertical-center-modal" :transfer=false :title="formInfo.name" :mask-closable="false" scrollable >
        <Scroll height="700" >
            <div>
                <div style="text-align:left; padding:20px;">
                    {{this.formInfo.content}}
                </div>
                <div style="padding:24px;">
                    <div class="demo-upload-list" v-for="(item,index2 ) in questionImgArray" :key="index2">
                        <template>
                            <img :src="item.url">
                            <div class="demo-upload-list-cover" v-on:click="handleView(item.url)">
                                <Icon type="ios-eye-outline" ></Icon>
                            </div>
                        </template>
                    </div>
                </div>
                <div>

                </div>
                <div style="background:#eee;height:30px;padding: 5px">
                    <h3>共有{{this.formInfo.answerNum}}条回答</h3>
                </div>
                <List item-layout="vertical">
                    <ListItem v-for="(item,index) in answers" :key="index">
                        <ListItemMeta :avatar="item.answerUser.profile" :title="item.answerUser.nickname">
                            <template slot="description">
                                {{item.content}}

                                <div v-if="item.replyList.length > 0" style="margin-top:6px;margin-left: 15px;margin-right:15px; padding:5px;background:#eee;">
                                    <div v-for="(item2,index2) in item.replyList" :key="item2.id">
                                        <Icon type="ios-trash" size="18" color="red" @click="openDeleteAnswerReplyDialog(item2.id,index,index2)" />
                                        <a href="#">{{item2.fromUser.nickname}}</a>
                                        <span v-if="item2.parentId != null"> 回复 <a>{{item2.toUser.nickname}}</a></span>：{{item2.content}} 
                                    </div>
                                </div>
                            </template>
                        </ListItemMeta>
                        
                        <template slot="action">
                        <!--  <li>
                                <Icon type="ios-star-outline" /> 123
                            </li> -->
                            <li>
                                <Icon type="ios-thumbs-up-outline" /> {{item.likedNum}}
                            </li>
                            <li>
                                <a href="#" @click="openDeleteAnswerDialog(item.id,index)">删除</a>
                            </li>
                        </template>
                    </ListItem>
                </List>
            </div>
        </Scroll>
        <div slot="footer" style="text-align:center">
                <a href="#" v-if="answerQueryFilter.pageNum < answerQueryFilter.totalPage" @click="handleReachBottom">加载更多</a>
        </div>
    </Modal>
    <Modal title="查看图片" v-model="visible" :z-index="9999999" width="800" height="600">
        <Carousel v-model="value2"  v-if="visible">
            <CarouselItem v-for="(item,index) in uploadList" :key="index"> 
                <div class="demo-carousel"> 
                    <img :src="item.url" style="height:100%;width:100%" alt=""/> 
                </div> 
            </CarouselItem>
        </Carousel>
    </Modal>
    <Modal v-model="answerDialog.deleteAnswer.show" :z-index="9999999" width="360" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>确认删除</span>
        </p>
        <div style="text-align:center">
	        <p>当前选择 1 项待删除数据.</p>
	        <p>是否继续删除?</p>
	    </div>
        <div slot="footer">
        	<Button type="error" size="large" long :loading="answerDialog.deleteAnswer.loading" @click.native="removeAnswer">删除</Button>
        </div>
    </Modal>
    <Modal v-model="answerDialog.deleteAnswerReply.show" :z-index="9999999" width="360" class-name="vertical-center-modal">
        <p slot="header" style="color:#f60;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>确认删除</span>
        </p>
        <div style="text-align:center">
	        <p>当前选择 1 项待删除数据.</p>
	        <p>是否继续删除?</p>
	    </div>
        <div slot="footer">
        	<Button type="error" size="large" long :loading="answerDialog.deleteAnswerReply.loading" @click.native="removeAnswerReply">删除</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
	import { questionAPI } from '@/api';
	import { Button, Table, Input, Modal, Select, Option, Page,Icon,Carousel,CarouselItem,Card} from 'iview'

	export default {
	  name: "question-list-page",
	  data() {
	  	return {
            value2:0,
	  		dialog: {
	  			delete: {
	  				show: false,
	  				loading: false,
	  				id: '',
                  },
                info: {
                    show: false,
                    loading: false,
                    id: '',
                }
	  		},
            shelfStatusArrs: [
                { code: '', name: '全部' },
                { code: 1, name: '上架' },
                { code: 0, name: '下架' },
            ],
	  		table: {
                queryFilter: {
                    questionName: '',
                    shelfStatus: '',
                    pageNum: 1,
                    pageSize: 10,
                    total: 0,
                },
                cols: [
                    {
                        type: 'index',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '分类',
                        key: 'quesType',
                        width: 140,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('span', _value ? _value.name : '');
                        }
                    },
                    {
                        title: '问题',
                        key: 'name',
                    },
                  
                    {
                        title: '提出者',
                        key: 'publisher',
                        width: 160,
                        render: (h, params) => {
                            let _value = params.row[params.column.key];
                            return h('span', _value ? _value.nickname : '');
                        }
                    },
                    {
                        title: '提问时间',
                        key: 'publishTime',
                        width: 160,
                    },
                    {
                        title: '回答量',
                        width: 160,
                        key: 'answerNum'
                    },
                    {
                        title: '上架状态',
                        key: 'shelfStatus',
                        width: 160,
                        render: (h, params) => {
                            let _id = params.row.id;
                            let _value = params.row[params.column.key];
                            return h('GlobalSwitch', {
                                props: {
                                    trueValue: 1,
                                    falseValue: 0,
                                    value: _value
                                },
                                scopedSlots: {
                                    open: props => h('span', '上架'),
                                    close: props => h('span', '下架')
                                },
                                on: {
                                    'on-change':  (event) => {
                                        this.updateShiftStatus(event,_id)
                                    }
                                }
                            });
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
            },
            formInfo: {
	  			id: '',
				name: '',
                content: '',
                answerNum: 0,
            },
            answerDialog: {
	  			deleteAnswer: {
	  				show: false,
	  				loading: false,
                    id: '',
                    index:null
                  },
               deleteAnswerReply: {
	  				show: false,
	  				loading: false,
                    id: '',
                    index:null,
                    answerIndex:null
                  },
	  		},
            answers:[],
            questionImgArray:[],
            imgFullPath: '',
            visible: false,
            answerQueryFilter: {
                questionId:'',
                pageNum: 1,
                pageSize: 2,
                total: 0,
                totalPage:0
            },
	  	}
	  },
	    components: {
			Button, Table, Input, Modal, Select, Option, Page,Icon,Carousel,CarouselItem,Card 
	    },
	  mounted() {
        this.fetchDataList();
	  },
	  methods: {
        mofidyPageNum(curr = 1) {
            this.table.queryFilter.pageNum = curr;
            this.fetchDataList();
        },
        search() {
            this.table.queryFilter.pageNum = 1;
            this.fetchDataList();
        },
        updateShiftStatus(event,id){
            questionAPI.questionShift({"id":id,"shiftStatus":event}).then(res => {
                if (res.code == 0) {
                   this.$Message.success('保存成功!');
                } else {
                   this.$Message.success('保存失败!');
                }
            });
        },
    	fetchDataList() {
    		questionAPI.fetchList(this.table.queryFilter).then(res => {
                if (res.code == 0) {
                    this.table.datas = res.data.list;
                    this.table.queryFilter.total = res.data.pageInfoParam.totalNum;
                } else {
                    this.table.datas = [];
                    this.table.queryFilter.total = 0;
                }
        	});
        },
        openDeleteDialog(id) {
            if (!id) {
                this.$Message.error('请选择待删除数据!');
                return;
            }
            this.dialog.delete.id = id;
            this.dialog.delete.show = true;
        },
        remove() {
            this.dialog.delete.loading = true;
            questionAPI.questionDel({ id: this.dialog.delete.id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('删除成功!');
                    this.fetchDataList();
                    this.dialog.delete.id = '';
                    this.dialog.delete.show = false;
                } else {
                    this.$Message.error(res.message || '删除失败!');
                }
            }).then(() => {
                this.dialog.delete.loading = false;
            });
        },
        openInfoDialog(id){
             if (!id) {
                this.$Message.error('请选择待查看数据!');
                return;
            }
            this.answers=[]
            this.answerQueryFilter.total=0
            this.answerQueryFilter.totalPage=0
            this.answerQueryFilter.pageNum=1
            this.dialog.info.id = id;
            this.dialog.info.show = true;
            this.fetchDetail(id);
            this.answerQueryFilter.pageNum=1
            this.answerQueryFilter.questionId=id
            this.findAnswersByPage()
        },
        fetchDetail(id) {
    		questionAPI.fetchDetail({ id }).then(res => {
                this.formInfo = res.data.vo;
                let _masterArrs = res.data.vo.masterPicUrl.split(',');
                let _masterConvertArrs = [];
                _masterArrs.map(item => {
                    _masterConvertArrs.push({
                        url: item
                    })
                })
                this.questionImgArray = _masterConvertArrs;
        	});
        },
        findAnswersByPage(){
            questionAPI.findAnswersByPage(this.answerQueryFilter).then(res => {
                if (res.code == 0) {
                    //替换
                    //
                    //console.log("=======",this.answers)
                    //this.answers = this.answers.concat(res.data.list);
                    let startIndex = this.answerQueryFilter.pageNum*this.answerQueryFilter.pageSize - this.answerQueryFilter.pageSize
                    res.data.list.map((item,index) => {
                        this.answers.splice(startIndex,1,item)
                        startIndex++
                    })
                       
                    this.answerQueryFilter.total=res.data.pageInfoParam.totalNum;
                    this.answerQueryFilter.totalPage=res.data.pageInfoParam.totalPage
                } else {
                    this.answers = [];
                    this.answerQueryFilter.total = 0
                }
        	});
        },
        handleReachBottom(){
            this.answerQueryFilter.pageNum=this.answerQueryFilter.pageNum+1
            this.findAnswersByPage()
        },
        handleView (fullPath) {
            this.imgFullPath = fullPath;
            this.visible = true;
        },
        openDeleteAnswerDialog(id,index) {
            if (!id) {
                this.$Message.error('请选择待删除数据!');
                return;
            }
            this.answerDialog.deleteAnswer.id = id;
            this.answerDialog.deleteAnswer.show = true;
            this.answerDialog.deleteAnswer.index = index;
        },
        removeAnswer() {
            this.answerDialog.deleteAnswer.loading = true;
            questionAPI.questionAnswerDel({ id: this.answerDialog.deleteAnswer.id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('删除回答成功!');
                    this.answers.splice(this.answerDialog.deleteAnswer.index,1)
                    this.findAnswersByPage();
                    this.answerDialog.deleteAnswer.id = '';
                    this.answerDialog.deleteAnswer.show = false;
                } else {
                    this.$Message.error(res.message || '删除回答失败!');
                }
            }).then(() => {
                this.answerDialog.deleteAnswer.loading = false;
                this.answerDialog.deleteAnswer.index = null;
            });
        },
        openDeleteAnswerReplyDialog(id,answerIndex,replyIndex) {
            if (!id) {
                this.$Message.error('请选择待删除数据!');
                return;
            }
            this.answerDialog.deleteAnswerReply.id = id;
            this.answerDialog.deleteAnswerReply.show = true;
            this.answerDialog.deleteAnswerReply.answerIndex = answerIndex;
            this.answerDialog.deleteAnswerReply.index = replyIndex;
        },
        removeAnswerReply() {
            this.answerDialog.deleteAnswerReply.loading = true;
            questionAPI.questionAnswerReplyDel({ id: this.answerDialog.deleteAnswerReply.id }).then(res => {
                if (res.code == 0) {
                    this.$Message.success('删除评论成功!');
                    this.answers[this.answerDialog.deleteAnswerReply.answerIndex].replyList.splice(this.answerDialog.deleteAnswerReply.index,1)
                    this.answerDialog.deleteAnswerReply.id = '';
                    this.answerDialog.deleteAnswerReply.show = false;
                } else {
                    this.$Message.error(res.message || '删除评论失败!');
                }
            }).then(() => {
                this.answerDialog.deleteAnswerReply.loading = false;
                this.answerDialog.deleteAnswerReply.answerIndex = null;
                this.answerDialog.deleteAnswerReply.index = null;
            });
        },
	  }
	};
</script>

<style lang="scss" scoped>
.question-list-page {
	.title {
		font-size: 16px;
	    color: #808080;
	    font-weight: bold;
	    border-bottom: 1px solid #eee;
	    padding-bottom: 10px;
	    margin-bottom: 20px;
	}
}

    .demo-upload-list{
        display: inline-block;
        width: 100px;
        height: 100px;
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
    .my-modal-parent {
        position: fixed;  // 浮动
        z-index: 999999!important;
        
    }
</style>

<style lang="scss">
.question-list-page {
    .ivu-switch {
        width: 60px;
    }
    .ivu-switch-checked:after {
        left: 38px;
    }	
}
</style>