import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View } from '@tarojs/components'
import { getOrderDetail } from '../../../services/order';

import GlobalBtn from '../../../components/global/globalBtn'

export default class PayResultPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            order: {}
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.fetchDetail(this.$router.params.orderId);
    }

    config: Config = {
        navigationBarTitleText: '支付结果',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='pay-result-page'>

                <View className='top-wrap'>
                    <View className='result'>支付成功</View>
                    <View className='total-price'>总金额： ¥{(this.state.order.totalPrice || 0).toFixed(2)}</View>
                </View>

                <View className='pay-btns'>
                    <GlobalBtn text='返回首页' style={'font-weight: bold; font-size: 28rpx !important;'} onBtnAction={this.switchTabPage.bind(this, 'index/index')} />
                    <View className='go-order-btn' onClick={this.gotoSubPage.bind(this, 'order/list/index')}>查看订单</View>
                </View>

            </View>
        )
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.redirectTo({
            url: '/pages/' + url
        })
    }

    switchTabPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.switchTab({
            url: '/pages/' + url
        })
    }

    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
            Taro.redirectTo({
            url: '/packageMy/pages/' + url
        })
    }

    fetchDetail = (orderId) => {
        getOrderDetail({ id: orderId }).then(res => {
            this.setState(prevState => ({
                order: res.vo || {},
            }));
        })
    }

}
