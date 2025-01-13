import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'

import { createOrder, getOrderDetail } from '../../../../services/order';
import { memberRefreshInfo } from '../../../../services/auth';
import { getRfidExistUnRevertCount } from '../../../../services/rfid';


import GlobalBtn from '../../../../components/global/globalBtn'

import { showTextToast } from '../../../../utils/util';

export default class MyDepositExtractList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            userInfo: {},
            unRevertCount: 0,
        }
    }

    componentDidShow() {
        this.fetchRfidExistUnRevertCount();
        this.setState(prevState => ({
            userInfo: Taro.getStorageSync('member')
        }));
    }

    componentWillUnmount() {
        if (this.reqStatusTimer) {
            clearInterval(this.reqStatusTimer);
        }
    }

    componentDidHide() {
        if (this.reqStatusTimer) {
            clearInterval(this.reqStatusTimer);
        }
    }

    config: Config = {
        navigationBarTitleText: '押金提取',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='my-deposit-extract'>

                <View className='top-wrap'>
                    
                    <View className='pay-desc'>
                        押金总额(元):
                    </View>
                    <View className='price'>
                        ￥{ (this.state.userInfo.deposited == 1 ? 300 : 0).toFixed(2) }
                    </View>
                    
                    <View className='extract-wrap'>
                        可提现: ￥{ (this.state.userInfo.deposited == 1 && this.state.unRevertCount <= 0 ? 300 : 0).toFixed(2) }
                    </View>
                    
                    <View className='desc-wrap'>
                        <View className='tip'>注: </View>书本未归还，则押金处于冻结状态，不可提取。
                    </View>
                </View>
                    
                { this.state.userInfo.deposited == 1 && this.state.unRevertCount <= 0 && <View className='agreement-wrap'>
                    <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-chk-actived.png' mode='widthFix' />我已阅读并同意<View className='link'>《余额使用协议》</View>，知悉平台设置的规则。
                </View> }

                { this.state.userInfo.deposited == 1 && this.state.unRevertCount <= 0 && <View className='global-btn-wrap'>
                    <GlobalBtn text='提交申请' onBtnAction={this.orderSubmit} />
                </View> }

            </View>
        )
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/packageMy/pages/' + url
        })
    }

    fetchRfidExistUnRevertCount = () => {
        getRfidExistUnRevertCount({ }).then(res => {
            let _count = res.count;
            this.setState(prevState => ({
                unRevertCount: _count || 0
            }));
        })
    }
  
    orderSubmit = (e) => {
        Taro.showLoading({
            title: '操作中...',
            mask: true
        })
        createOrder({
            cartStr: this.state.userInfo.id,
            distributionMode: 'YOURSELF',
            orderType: 'DEPOSIT_EXTRACT',
            payPlatform: 'WX',
            remark: JSON.stringify({ money: 300 })
        }).then(res => {
            this.genOrderInfo(res.orderId);
        }).catch(() => {
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        })
    }

    genOrderInfo = (orderId) => {
        let _openid = Taro.getStorageSync('member').openid;

        this.processOrderStatus(orderId);
        this.reqStatusTimer = setInterval(() => {
            this.processOrderStatus(orderId);
        }, 1500);
    }

    processOrderStatus = (id) => {
        getOrderDetail({ id: id }).then(res => {
            let _vo = res.vo;
            if (_vo) {
                if (_vo.status == 0) {
                } else if (_vo.status > 0) {
                    if (this.reqStatusTimer) {
                        clearInterval(this.reqStatusTimer);
                    }
                    showTextToast('押金提取成功');
                    memberRefreshInfo({}).then(detailRes => {
                        Taro.setStorageSync('member', detailRes.member);
                        setTimeout(() => {
                            setTimeout(() => {
                                this.gotoSubPage('my/deposit/index', null);
                            }, 1000);
                            Taro.hideLoading();
                            Taro.navigateBack();
                        }, 1000)
                    }).then(() => {
                        setTimeout(() => {
                            Taro.hideLoading();
                        }, 1000)
                    }).catch(() => {
                        setTimeout(() => {
                            Taro.hideLoading();
                        }, 1000)
                    })
                }
            }
        }).then(() => {
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        }).catch(() => {
            showTextToast('押金提取失败');
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        })
    }

}
