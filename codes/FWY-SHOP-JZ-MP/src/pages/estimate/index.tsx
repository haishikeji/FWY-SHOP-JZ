import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image ,Button,} from '@tarojs/components'
import {  AtIcon} from 'taro-ui'
import { fetchEstimateSelfQuery} from '../../services/estimate';
import Api from '../../configs/api';
import { showTextToast } from '../../utils/util';
import jump from '../../utils/jump';
import classNames from 'classnames'

export default class MorePage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            pageCurr: 1,
            estimateList: [],
            cartTotal: 0,
            totalPage: 0
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.fetchList(0);
    }

    onReachBottom() {
        let _nextPageNum = this.state.pageCurr + 1;
        if (_nextPageNum > this.state.totalPage) {
            return;
        }
        
        this.setState(prevState => ({
          pageCurr: _nextPageNum
        }));
        this.fetchList( _nextPageNum);
    }

    config: Config = {
        navigationBarTitleText: '评估',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='more-page'>
                {
                    Array.isArray(this.state.estimateList) && this.state.estimateList.map((estimate, index) => {
                        return (
                            <View className='content-wrap' key={index}>
                                <View className='lf-wrap'>
                                <View className='lf-wrap-goods-left'>
                                    <View className='name'>{estimate.name}</View>
                                </View>
                                    <View className='lf-wrap-goods-right'>
                                        <View className='name'>{estimate.gmtCreateTime}</View>
                                    </View>
                                </View>
                                <View  className='valicode-btn at-row at-row__align--center'>
                                    <View className="at-col">
                                        <Button type='primary' openType='getUserInfo' className='no-border' onClick={this.gotoSubPage.bind(this,  'estimate/detail/index?id=' + estimate.id)}>查看详情</Button>
                                    </View>
                                    {estimate.result =='合格' && <View  className="at-col">
                                        <Button type='primary' openType='getUserInfo' className='no-border' onClick={this.downLoadResult.bind(this,estimate.id)} >下载结果</Button>
                                    </View>}
                                    {estimate.result =='不合格' && <View  className="at-col">
                                        <Button type='primary' openType='getUserInfo' className='no-border' onClick={this.downLoadResult.bind(this,estimate.id)} >下载结果</Button>
                                    </View>}
                                    { estimate.result !='合格' && estimate.result !='不合格' && <View  className="at-col tip">{estimate.result}</View>}
                                    
                                </View>
                            </View>
                        )
                    })
                }
                <View className='float-cart-component' onClick={this.gotoSubPage.bind(this, 'estimate/detail/index')}>
                    <AtIcon value='add-circle' size='60' color='#fbcd43'></AtIcon>
                </View>
                <View style="height: 10px; background: #f4f4f4;"></View>

            </View>
        )
    }

    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/subpages/pages/' + url
        })
    }
  
    fetchList = (pageNum) => {
        fetchEstimateSelfQuery({pageNum: pageNum}).then(res => {
            this.setState(prevState => ({
                estimateList: pageNum == 0 ? res.list : prevState.estimateList.concat(res.list),
                totalPage: res.pageInfoParam.totalPage
            }));
        });
    }

    downLoadResult = (id,e) => {
        var that = this;
        let _token = Taro.getStorageSync('token');
        Taro.downloadFile({
            url: Api.downLoadEstimateResult+"?id="+id,
            header:{
                'token':_token
            },
            success: function (res) {
              var filePath = res.tempFilePath
              wx.openDocument({
                filePath: filePath,
                showMenu: true,
                fileType: "xlsx",
                success: function (res) {
                  console.log('打开文档成功')
                }
              })
            }
          })
    }
}
