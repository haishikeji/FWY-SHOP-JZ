import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { AtInput, AtFloatLayout, AtTextarea } from 'taro-ui'

import GlobalBtn from '../../../../components/global/globalBtn'
import { createOrder } from '../../../../services/order';
import { getPlaceDetail } from '../../../../services/place';

import { getAmountInfo } from '../../../../services/common';

import classNames from 'classnames'

import { showTextToast } from '../../../../utils/util';

export default class PayPlaceSubmitPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            type: '',
            totalPrice: 0,
            place: {},
            amount: {},
        }
    }

    componentWillMount() {
        this.fetchAmountDetail();
    }

    componentDidShow() {
        this.setState({
            type: this.$router.params.type
        });
        this.fetchPlaceDetail((this.$router.params.ids || ''));
    }

    config: Config = {
        navigationBarTitleText: '确认订单',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='pay-place-submit-page'>

                <View className='content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            场馆名称
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            {this.state.place.name}
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            场馆价格
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            {parseInt(this.$router.params.price || 0).toFixed(2)} / 每小时
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            场馆地址
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            {this.state.place.address}
                        </View>
                    </View>
                </View>

                <View className='content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            预约时间
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            {this.$router.params.day + ' ' + this.$router.params.startTime + ' - ' + this.$router.params.endTime}
                        </View>
                    </View>
                    {/* <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            联系电话
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            -
                        </View>
                    </View> */}
                </View>

                <View className='content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            订单金额
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{(this.$router.params.price * this.$router.params.hourCount).toFixed(2)}
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            账户余额
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{(this.state.amount.money || 0).toFixed(2)}
                        </View>
                    </View>
                </View>

                <View className='footer-wrap'>
                    <View className='footer-actions'>
                        <View className='footer-left'>
                            <Text className='text'>合计:</Text> <Text className='price'>¥{(this.$router.params.price * this.$router.params.hourCount).toFixed(2)}元</Text>
                        </View>
                        <View className='footer-right'>
                            <GlobalBtn text='立即支付' onBtnAction={this.orderSubmit} />
                        </View>
                    </View>
                </View>

            </View >
        )
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    bindInputChange = (name, value) => {
      var params = {};
      params[name] = value;
      this.setState(params);
      return value;
    }

    gotoAddressListPage = (e) => {
      Taro.navigateTo({
        url: '/pages/address/list/index'
      })
    }

    fetchPlaceDetail = (id) => {
        getPlaceDetail({ id: id }).then(res => {
            this.setState(prevState => ({
                place: res.vo || []
            }));
        });
    }
  
    orderSubmit = (e) => {
        let _idStr = this.$router.params.ids;
        createOrder({
            cartStr: _idStr,
            distributionMode: 'YOURSELF',
            orderType: 'PLACE_APPOINTMENT',
            payPlatform: 'WX',
            refReceivedPk: '',
            remark: JSON.stringify({ id: _idStr, hourCount: this.$router.params.hourCount, unitPrice: this.$router.params.price, 
                day: this.$router.params.day, startTime: this.$router.params.startTime, endTime: this.$router.params.endTime,
                address: this.state.place.address })
        }).then(res => {
            showTextToast('下单成功');
            // if (res.surplusPrice == 0) {
            //     Taro.redirectTo({
            //         url: '/pages/payment/result/index?orderId=' + res.orderId
            //     })
            // } else {
                Taro.redirectTo({
                    url: '/pages/payment/pay/index?orderId=' + res.orderId
                })
            // }
            // this.onGotoNext();
        })
    }

    fetchAmountDetail = () => {
        getAmountInfo({ }).then(res => {
            this.setState(prevState => ({
                amount: res.vo || {}
            }));
        });
    }

}
