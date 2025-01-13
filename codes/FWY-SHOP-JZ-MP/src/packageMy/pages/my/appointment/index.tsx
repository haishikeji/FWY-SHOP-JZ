import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { getOrderList } from '../../../../services/order';
import { View, Text, Image } from '@tarojs/components'

import NoDataComponent from '../../../../components/not-data';

import { AtTabs } from 'taro-ui'
import classNames from 'classnames'

export default class MyAppointmentList extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
        tabIndex: 0,
        orderList: [],
        tabList: [{ title: '已预约', id: 1 }, { title: '已完成', id: 2 }, { title: '已取消', id: 3 }],
    }
  }

  componentDidMount() {
    this.getAppointmentList(1);
  }
  
  componentDidShow () {
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的预约',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    return (
        <View className='my-appointment'>

            <AtTabs className='card-tabs' current={this.state.tabIndex} tabList={this.state.tabList} onClick={this.onChangeTabIndex.bind(this)}>
            </AtTabs>

            { (!this.state.orderList || this.state.orderList.length == 0) && 
                <View className='no-data-wrap'><NoDataComponent text={ '暂无' + this.state.tabList[this.state.tabIndex].title + '数据！' } isFull={false} imgSize={'height: 200rpx; width: 200rpx; margin-top: 350rpx;'} img='http://bookclub-imgs.doule.me/imgs/common/pic-not-order.png' /></View>
            }

            {
                Array.isArray(this.state.orderList) && this.state.orderList.map((order, index) => {
                    return (
                        <View className='content-wrap' key={index}>
                            <View className='lf-wrap' onClick={this.gotoNextPage.bind(this, order.orderType, order.goods)}>
                                <View className='lf-wrap-goods-left'>
                                    <Image src={order.goods.coverPicUrl} mode='scaleToFill' />
                                </View>
                                <View className='lf-wrap-goods-right'>
                                    <View className='name'>{order.goods.name}</View>
                                    <View className='desc time'>{order.otherDesc.courseTime}</View>
                                    <View className='desc'>上课地址: {order.otherDesc.address}</View>
                                    { order.status == 1 && <View className='btns'>
                                        <View className='btn'>取消预约</View>
                                    </View> }
                                </View>
                            </View>
                        </View>
                    )
                })
            }

            
        </View>
    )
  }

    onChangeTabIndex = (index, e) => {
        if (e) e.stopPropagation();
        this.setState(prevState => ({
            tabIndex: index,
        }));
        this.getAppointmentList(this.state.tabList[index].id);
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    gotoNextPage = (type, goods, e) => {
        if (e) e.stopPropagation();
        if (!goods) return;
        if (type == 'CHILDREN_PARTICIPATE_OFFLINE_COURSE') {
            Taro.navigateTo({
                url: '/pages/offline/classroom-detail/index?id=' + goods.planId
            })
        } if (type == 'ADULT_PARTICIPATE_OFFLINE_ACTIVITY') {
            Taro.navigateTo({
                url: '/pages/offline/classroom-detail/index?id=' + goods.planId + '&group=1'
            })
        } if (type == 'PLACE_APPOINTMENT') {
            Taro.navigateTo({
                url: '/packageAdult/pages/place-detail/index?id=' + goods.id
            })
        }
    }
    
    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/packageMy/pages/' + url
        })
    }

    getAppointmentList = (status) => {
        this.setState(prevState => ({
            orderList: []
        }));
        getOrderList({ status: status, orderType: 'CHILDREN_PARTICIPATE_OFFLINE_COURSE,ADULT_PARTICIPATE_OFFLINE_ACTIVITY,PLACE_APPOINTMENT' }).then(res => {
            res.list.map(item => {
                item['goods'] = JSON.parse(item.goods || '[]');
                if (item.goods && item.goods.length > 0) {
                    item['goods'] = item.goods[0];
                } else {
                    item['goods'] = {};
                }
                if (item['otherDesc']) {
                    item['otherDesc'] = JSON.parse(item.otherDesc || '{}')
                }
                if (item['orderType'] == 'PLACE_APPOINTMENT') {
                    item['otherDesc']['courseTime'] = item['otherDesc']['day'] + ' ' + item['otherDesc']['startTime'] + '-' + item['otherDesc']['endTime']
                }
            });
            this.setState(prevState => ({
                orderList: res.list || []
            }));
        });
    }
  
}
