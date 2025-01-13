import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'
import { AtCountdown } from 'taro-ui'

import GlobalBtn from '../../../components/global/globalBtn'

import { fetchWxPay } from '../../../services/pay';
import { getOrderDetail } from '../../../services/order';
import { showTextToast } from '../../../utils/util';
import { memberDetailInfoApi, memberRefreshInfo } from '../../../services/auth';

export default class PayPage extends Component {

    reqStatusTimer = null;

    constructor() {
        super(...arguments)
        this.state = {
            payInfo: {},
            isExceed: false,
            minutes: 0,
            seconds: 0,
            platform: '',
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        let _orderId = this.$router.params.orderId;
        if (!_orderId) {
            showTextToast('未找到相应订单');
            return;
        }
        this.fetchSysInfo();
        console.log('pay coming: ', _orderId)
        this.genOrderInfo(_orderId);
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
        navigationBarTitleText: '支付',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='pay-page'>

                <View className='top-wrap'>
                    <View className='total-price'>¥{this.state.payInfo.totalPrice}</View>
                    <View className='count-down-wrap'>
                        {this.state.isExceed && <Text>  该订单超时未支付 </Text>}
                        {!this.state.isExceed && <Text>  支付剩余时间: </Text>}
                        {!this.state.isExceed && <AtCountdown
                            isShowDay={false}
                            isShowHour={false}
                            format={{ hours: ':', minutes: '分', seconds: '秒' }}
                            minutes={this.state.minutes}
                            seconds={this.state.seconds}
                        />
                        }
                    </View>

                </View>

                <View className='pay-mode'>
                    <View className='pay-item'>
                        <View className='pay-item-left'>
                            <Image src='http://bookclub-imgs.doule.me/imgs/payment/icon-pay-wechat.png' mode='widthFix' />
                        </View>
                        <View className='pay-item-center'>
                            微信支付
                        </View>
                        <View className='pay-item-right'>
                            <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-actived.png' mode='widthFix' />
                        </View>
                    </View>
                </View>


                {this.state.isExceed && <View className='pay-btns'>
                    <GlobalBtn text='返回' style={'font-weight: bold; font-size: 28rpx !important;'} onBtnAction={this.gotoBack.bind(this)} />
                </View>}
                {!this.state.isExceed && <View className='pay-btns'>
                    <GlobalBtn text='确认支付' style={'font-weight: bold; font-size: 28rpx !important;'} onBtnAction={this.goPay.bind(this)} />
                    <View className='cancel-btn'>放弃支付</View>
                </View>}

            </View>
        )
    }

    gotoBack = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateBack({
            delta: 1
        })
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    fetchSysInfo = () => {
        Taro.getSystemInfo({
            success: (res) => {
                this.setState({
                    platform: res.platform.toLowerCase(),
                })
            }
        })
    }

    genOrderInfo = (orderId) => {
        let _openid = Taro.getStorageSync('member').openid;
        let _params = { openid: _openid, orderId: orderId };

        fetchWxPay(_params).then(res => {
            this.setState(prevState => ({
                payInfo: res.response,
                totalPrice: parseInt(res.sum)
            }));
            this.processOrderStatus(orderId);
            this.reqStatusTimer = setInterval(() => {
                this.processOrderStatus(orderId);
            }, 1500);
        }).catch((err) => {
            if (err == '该订单已支付') {
                Taro.redirectTo({
                    url: '/pages/payment/result/index?orderId=' + orderId
                })
            }
            console.log('fetchWxPay err: ', err);
        })
    }

    goPay(e) {
        let _payInfo = this.state.payInfo;
        if (_payInfo) {
            Taro.requestPayment({
                timeStamp: _payInfo.timeStamp,
                nonceStr: _payInfo.nonceStr,
                package: _payInfo.package,
                signType: 'MD5',
                paySign: _payInfo.paySign,
                success: (res) => {
                    console.log('支付成功. ', res);
                },
                fail: (res) => {
                    console.log('支付失败. ', res);
                }
            })
        } else {
            console.log('未获取到订单支付数据.');
        }
    }

    processOrderStatus = (orderId) => {
        getOrderDetail({ id: orderId }).then(res => {
            let _vo = res.vo;
            if (_vo) {
                if (_vo.status == 0) {
                    var orderTimeStr = new Date(_vo.gmtCreateTime).getTime();
                    if (this.state.platform == 'ios') {
                        orderTimeStr = new Date(_vo.gmtCreateTime.replace(/-/g, '/')).getTime()
                    }
                    var now = Date.now();
                    let _exceed = now - orderTimeStr > (15 * 60 * 1000);
                    this.setState(prevState => ({
                        isExceed: _exceed
                    }));
                    if (!_exceed) {
                        this.timeFn(this.minutesTest(_vo.gmtCreateTime));
                    }
                } else if (_vo.status > 0) {
                    if (this.reqStatusTimer) {
                        clearInterval(this.reqStatusTimer);
                    }
                    if (_vo.orderType == 'JOIN_READ_VIP' || _vo.orderType == 'JOIN_COURSE_VIP') {
                        memberDetailInfoApi({}).then(detailRes => {
                          Taro.setStorageSync('member', detailRes.member);
                          Taro.redirectTo({
                              url: '/pages/payment/result/index?orderId=' + orderId
                          })
                        })
                    } else {
                        Taro.redirectTo({
                            url: '/pages/payment/result/index?orderId=' + orderId
                        })
                    }
                }
            }
        })
    }

    minutesTest = (dateBegin) => {
        if (!dateBegin) return;
        var sdate1 = new Date(dateBegin);
        if (this.state.platform == 'ios') {
            sdate1 = new Date(dateBegin.replace(/-/g, '/'));
        }
        sdate1.setMinutes(sdate1.getMinutes() + 14);
        return sdate1.getTime();
    }

    timeFn = (dateBegin) => {
        //如果时间格式是正确的，那下面这一步转化时间格式就可以不用了
        var dateEnd = new Date();//获取当前时间
        var dateDiff = dateEnd.getTime() - dateBegin;//时间差的毫秒数
        var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
        var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
        var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
        //计算相差分钟数
        var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
        var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
        //计算相差秒数
        var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave3 / 1000)

        var leave4 = leave3 % (60 * 1000)      //计算分钟数后剩余的毫秒数
        var minseconds = Math.round(leave4 / 1000)
        var timeFn = "耗时：" + dayDiff + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒" + minseconds + "毫秒";
        console.log('timeFn', timeFn);
        this.setState(prevState => ({
            minutes: minutes * -1,
            seconds: seconds * -1
        }));
    }

    processCompletedFetchData(type) {
        if (!type) return;
        if (type == 'JOIN_READ_VIP' || type == 'JOIN_COURSE_VIP') {
            memberDetailInfoApi({}).then(res => {
              Taro.setStorageSync('member', res.member);
            })
        }
    }

}
