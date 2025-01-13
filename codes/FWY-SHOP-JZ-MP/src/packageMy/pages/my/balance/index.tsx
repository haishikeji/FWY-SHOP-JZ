import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text } from '@tarojs/components'

import { getAmountInfo, getAmountHistoryList } from '../../../../services/common';

import GlobalBtn from '../../../../components/global/globalBtn'
import classNames from 'classnames'

export default class MyBalanceList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            tabIndex: 0,
            info: {},
            historys: [],
            typeMapping: {
                'BALANCE_INVEST': '余额充值',
                'BALANCE_EXTRACT': '余额提取',
                'BALANCE_CHANGE': '购买商品',
                'RESTITUTION_ORDER': '订单未支付余额返还',
            }
        }
    }

    componentDidShow() {
        this.fetchDetail();
        this.fetchHistory();
    }

    config: Config = {
        navigationBarTitleText: '余额',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='my-balance'>

            <View className='top-wrap'>
                <Image src='http://bookclub-imgs.doule.me/imgs/my/pic-my-balance-1.png' mode='scaleToFill' />
                
                <View className='price'>
                    ￥{(this.state.info.money || 0).toFixed(2)}
                </View>
                <View className='go-pay'>
                    <GlobalBtn text='立即支付' onBtnAction={this.gotoSubPage.bind(this, 'my/balance-pay/index')} />
                </View>
                <View className='pay-desc' onClick={this.gotoAttentation.bind(this, 'RECHARGE_BALANCE_DESC')}>
                    充值及余额使用说明
                </View>
            </View>

            <View className='history-wrap'>
                <View className='title'>
                    余额明细
                </View>
                <View className='records'>
                    {
                        Array.isArray(this.state.historys) && this.state.historys.map((history, index) => {
                            return (
                                <View className='item' key={index}>
                                    <View className='left'>
                                        <View className='type-title'>
                                            { this.state.typeMapping[history.type] || '-' }
                                            { history.message && <Text>({history.message})</Text> }
                                        </View>
                                        <View className='time'>
                                            { history.gmtCreateTime }
                                        </View>
                                    </View>
                                    <View className='right'>
                                        <View className={ classNames('money', (history.type == 'BALANCE_EXTRACT' || history.type == 'BALANCE_CHANGE') && 'subtract') }>
                                            ￥{ history.type == 'BALANCE_INVEST' ? '+' : '' }
                                            { history.type == 'BALANCE_EXTRACT' ? '-' : '' }
                                            { (history.afterMoney - history.beforeMoney).toFixed(2) }
                                        </View>
                                        <View className='balance'>
                                            余额￥{ (history.afterMoney || 0).toFixed(2) }
                                        </View>
                                    </View>
                                </View>
                            )
                        })
                    }
                </View>
            </View>

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

    gotoAttentation = (code, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/packageMy/pages/my/attention/index?code=' + code
        })
    }
    
    fetchDetail = () => {
        getAmountInfo({ }).then(res => {
            this.setState(prevState => ({
                info: res.vo || {}
            }));
        });
    }

    fetchHistory = () => {
        getAmountHistoryList({ types: 'RESTITUTION_ORDER,BALANCE_INVEST,BALANCE_CHANGE,BALANCE_EXTRACT' }).then(res => {
            this.setState(prevState => ({
                historys: res.list || []
            }));
        });
    }

}
