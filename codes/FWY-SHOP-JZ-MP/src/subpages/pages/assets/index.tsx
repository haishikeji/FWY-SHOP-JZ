import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Button } from '@tarojs/components'

import classNames from 'classnames'
import { showTextToast } from '../..//utils/util'


export default class AssetsPage extends Component {

  constructor () {
    super(...arguments)
    this.state = {
        user: {},
        assets: 0,
        amount: {}
    }
  }

  componentWillMount () { }
  
  componentDidShow () {
      this.fetchUserAmount();
  }

  config: Config = {
    navigationBarTitleText: '我的资产',
    navigationBarBackgroundColor: '#f09819',
    navigationBarTextStyle: 'white',
    backgroundColor: '#f4f4f4'
  }

  render () {
    return (
      <View className='assets-page'>
        <View className="container">
            <View className="money">
            <View className="title">总资产(乐龄币)</View>
            <View className="value">
                <View>{amount.score}</View>
                <View className="des">
                {amount.freeze}
                <Text className="flag">元</Text>
                </View>
            </View>
            <View className="list">
                <View className="item eq1">
                    <View className="item-title icon icon-beike">总消费</View>
                    <View className="item-value">{amount.totleConsumed}</View>
                    <View className="item-action" onClick={this.goTransform}>
                        <View>
                            <Text>转钻</Text>
                            <View className="icon icon-arrow-right" ></View>
                        </View>
                    </View>
                    <View className="item-des">用户打赏的玉帛钻直接转换为贝,玉帛贝可变现</View>
                </View>
                <View className="item eq2">
                    <View className="item-title icon icon-drill-full">冻结</View>
                    <View className="item-value">{amount.freeze}</View>
                    <View className="item-action">只能用于打赏</View>
                    <View className="item-des">目前可通过玉帛贝转化成钻,好内容能获得更多流量支持</View>
                </View>
            </View>
            {/* <View className="btn" hover-class="btn-hover">提现</View> */}
            </View>
            <View className="cells">
            <View className="cell" hover-class="cell-hover" onClick={this.goMonetize}>
                <View className="icon icon-beike ic"></View>
                <View className="title">乐龄币变现</View>
                <View className="value"></View>
                <View className="icon icon-arrow-right"></View>
            </View>
            <View className="cell" hover-class="cell-hover" onClick={this.goTrade}>
                <View className="icon icon-qianbao ic"></View>
                <View className="title">兑换记录</View>
                <View className="value"></View>
                <View className="icon icon-arrow-right"></View>
            </View>
            </View>
        </View>
      </View>
    )
  }

  gotoPage = (url, e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/' + url
    })
  }
  
  goTransform = () => {
      
  }

  goMonetize = () => {
      
  }

  goTrade = () => {
      
  }

  fetchUserAmount = () => {
    Taro.wxApi.userAmount(Taro.getStorageSync('token')).then(res => {
        this.setState(prevState => ({
            amount: res.code == 0 ? res.data : {}
        }));
    })
    // this.user = await Tip.getAssets();
    // this.assets = ((this.user.drill + this.user.shell) / 100).toFixed(2);
  }


}