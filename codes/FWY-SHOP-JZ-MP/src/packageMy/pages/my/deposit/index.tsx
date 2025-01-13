import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View } from '@tarojs/components'

import { getAmountInfo, getAmountHistoryList } from '../../../../services/common';

import GlobalBtn from '../../../../components/global/globalBtn'
import classNames from 'classnames'

export default class MyDepositList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            tabIndex: 0,
            userInfo: {},
            info: {},
            historys: [],
            typeMapping: {
                'DEPOSIT_INVEST': '余额充值',
                'DEPOSIT_EXTRACT': '余额提取',
            }
        }
    }

    componentDidShow() {
        let _member = Taro.getStorageSync('member');
        this.setState(prevState => ({
            userInfo: _member
        }));
        this.fetchDetail();
        this.fetchHistory();
    }

    config: Config = {
        navigationBarTitleText: '押金',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='my-deposit'>

                <View className='top-wrap'>
                    <View className='left'>
                        <View className='title'>
                            可用押金( 元）
                        </View>
                        <View className='price'>
                            ￥{(this.state.info.freeze || 0).toFixed(2)}
                        </View>
                    </View>
                    { this.state.userInfo.deposited == 1 && <View className='right' onClick={this.gotoSubPage.bind(this, 'my/deposit-extract/index')}>
                        提现 >
                    </View> }
                </View>

                
                <View className='deposit-desc'>
                    查看押金说明
                </View>

                <View className='history-wrap'>
                    <View className='title'>
                        押金明细
                    </View>
                    <View className='records'>
                        {
                            Array.isArray(this.state.historys) && this.state.historys.map((history, index) => {
                                return (
                                    <View className='item' key={index}>
                                        <View className='left'>
                                            <View className='type-title'>
                                                { this.state.typeMapping[history.type] || '-' }
                                            </View>
                                            <View className='time'>
                                                { history.gmtCreateTime }
                                            </View>
                                        </View>
                                        <View className='right'>
                                            <View className={ classNames('money', history.type == 'BALANCE_EXTRACT' && 'subtract') }>
                                                { history.type == 'BALANCE_INVEST' ? '+' : '' }
                                                { history.type == 'BALANCE_EXTRACT' ? '-' : '' }
                                                ￥{ (history.afterMoney - history.beforeMoney).toFixed(2) }
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

            

                { this.state.userInfo.deposited == 0 && <View className='global-btn-wrap'>
                    <GlobalBtn text='立即支付' onBtnAction={this.gotoSubPage.bind(this, 'my/deposit-pay/index')} />
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

    fetchDetail = () => {
        getAmountInfo({ }).then(res => {
            this.setState(prevState => ({
                info: res.vo || {}
            }));
        });
    }

    fetchHistory = () => {
        getAmountHistoryList({ types: 'DEPOSIT_INVEST,DEPOSIT_EXTRACT' }).then(res => {
            this.setState(prevState => ({
                historys: res.list || []
            }));
        });
    }

}
