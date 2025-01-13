import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, ScrollView } from '@tarojs/components'

import { AtTabs } from 'taro-ui'

import classNames from 'classnames'

import { getOrderList } from '../../../../services/order';

import NoDataComponent from '../../../../components/not-data';

export default class OrderList extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
        tabIndex: 0,
        pageCurr: 1,
        orderList: [],
        tabList: [{ title: '全部', id: '' }, { title: '待付款', id: 0 }, { title: '进行中', id: 1 }, { title: '已完成', id: 2 }, { title: '已取消', id: 3 }],
        statusMapping: {
            0: '待付款',
            1: '进行中',
            2: '已完成',
            3: '已取消',
            4: '退款'
        },
        orderTypeMapping: {
            'CHILDREN_BORROW': '借书订单',
            'CHILDREN_BUY': '买书订单',
            'ADULT_BUY': '买书订单',
            'CHILDREN_PARTICIPATE_ONLINE_COURSE': '儿童馆线上课程订单',
            'CHILDREN_PARTICIPATE_OFFLINE_COURSE': '儿童馆线下课程订单',
            'ADULT_PARTICIPATE_OFFLINE_ACTIVITY': '成人馆线下活动订单',
            'ADULT_PARTICIPATE_RESTURANT': '餐厅订单',
            'JOIN_READ_VIP': '阅读会员订单',
            'JOIN_COURSE_VIP': '课程会员订单',
            'JOIN_CHILDREN_VIP': '儿童馆会员订单',
            'JOIN_CHILDREN_BORROW_VIP': '儿童馆借阅会员订单',
            'JOIN_CHILDREN_CARD_NUM_VIP': '儿童馆次卡会员订单',
            'PLACE_APPOINTMENT': '场馆订单',
        }
    }
  }

  componentDidMount() {
    //   this.fetchList();
  }
  
  componentDidShow () {

    let _currentPages = Taro.getCurrentPages();
    if (_currentPages && _currentPages.length >= 1) {
        let currPage = _currentPages[_currentPages.length - 1];
        if (currPage.data.status || currPage.data.status == -1) {
            this.$router.params.status = currPage.data.status == -1 ? '' : currPage.data.status;
        }
    }

    if (this.$router.params.status) {
        let _index = this.state.tabList.findIndex((item) => item.id == this.$router.params.status);
        if (_index != -1) {
            this.setState(prevState => ({
                tabIndex: _index
            }));
            setTimeout(() => {
                this.fetchList(1, this.$router.params.status);
            }, 0);
        }
    } else {
        this.fetchList();
    }
  }

  onReachBottom() {
      let _nextPageNum = this.state.pageCurr + 1;
      this.setState(prevState => ({
        pageCurr: _nextPageNum
      }));
      this.fetchList(_nextPageNum, this.state.tabList[this.state.tabIndex].id);
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的订单',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    return (
        <View className={ classNames('order-record', (!this.state.orderList || this.state.orderList.length == 0) && 'bg-white') }>

            <AtTabs className='card-tabs' current={this.state.tabIndex} tabList={this.state.tabList} onClick={this.onChangeTabIndex.bind(this)}>
            </AtTabs>

            { (!this.state.orderList || this.state.orderList.length == 0) && 
                <NoDataComponent text='暂无还没有订单信息哦，快去下单吧！' isFull={false} imgSize={'height: 200rpx; width: 200rpx; margin-top: 350rpx;'} img='http://bookclub-imgs.doule.me/imgs/common/pic-not-order.png' />
            }

            { (Array.isArray(this.state.orderList) && this.state.orderList.length) && <View className="record-wrap">
                    {
                        Array.isArray(this.state.orderList) && this.state.orderList.map((order, index) => (
                            <View className="item" key={index}>
                                <View className='title-wrap at-row'>
                                    <View className='at-col at-col-7'>
                                        <Text className='title'>{order.typeMess}</Text>
                                        { order.orderType == 'ADULT_BUY' && <Text>(成人)</Text> }
                                        { order.orderType == 'CHILDREN_BUY' && <Text>(儿童)</Text> }
                                    </View>
                                    <View className='at-col at-col-5 right-value'>
                                        <Text>{order.mess}</Text>
                                    </View>
                                </View>
                                {  order.goodsTotal == 1 && order.goods.map((goodsItem, goodsIndex) => (
                                        <View className='lf-wrap' key={goodsIndex}>
                                            { goodsItem.coverPicUrl && <View className='lf-wrap-goods-left'>
                                                <Image src={ goodsItem.coverPicUrl } mode='scaleToFill' />
                                            </View> }
                                            <View className={ classNames('lf-wrap-goods-right', !goodsItem.coverPicUrl && 'no-pic') }>
                                                <Text className='goods-name'>{goodsItem.name || ''}</Text>
                                                <View className='text-price'>
                                                    <Text className='price-symbol'>￥</Text>{goodsItem.price}
                                                    <View className='goods-nums'>× {goodsItem.num || 1}</View>
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
        
                                { order.goodsTotal > 1 && <View className='content-wrap recommend-content-wrap'>
                                        <View className='lf-wrap'>
                                            <View className='lf-wrap-left lf-wrap-recommend-left'>
                                                <ScrollView className='recommend-scroll' scrollX={true} scrollWithAnimation>
                                                    <View className='recommend-list'>
                                                        {
                                                            order.goods.map((goodsItem, index) => (
                                                                <View className='recommend-item' key={index}>
                                                                    <Image src={goodsItem.coverPicUrl} mode='scaleToFill' />
                                                                </View>
                                                            ))
                                                        }
                                                    </View>
                                                </ScrollView>
                                            </View>
                                            <View className='lf-wrap-right lf-wrap-recommend-right'>
                                                共{order.goodsTotal}
                                                { order.orderType == 'ADULT_PARTICIPATE_RESTURANT' && <Text>份</Text> }
                                                { order.orderType != 'ADULT_PARTICIPATE_RESTURANT' && <Text>本</Text> }
                                            </View>
                                        </View>
                                    </View>
                                }


                                <View className='right-btns'>
                                    {
                                        order.status == 0 && <View className='action-btn action-btn-white' onClick={this.gotoPage.bind(this, 'payment/pay/index?orderId=' + order.id)}>
                                            <Text>立即支付</Text>
                                        </View>
                                    }
                                    {/* {
                                        (order.status == '3' || order.status == '8') && <View className='action-btn action-btn-white' onClick={this.gotoSubPage.bind(this, 'order/logistics/index')}>
                                            <Text>查看物流</Text>
                                        </View>
                                    } */}
                                    {/* {
                                        order.status != '1' && order.status != '5' && <View className='action-btn action-btn-white' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + order.goods.goods_id)}>
                                            <Text>再次购买</Text>
                                        </View>
                                    } */}
                                    <View className='action-btn' onClick={this.goOrderDetailPage.bind(this, order.id)}>
                                        <Text>订单详情</Text>
                                    </View>
                                </View>
                                <View className='time-wrap at-row'>
                                    <Text className='time'>{order.gmtCreateTime}</Text>
                                </View>
                            </View>
                        ))
                    }
                </View>
            }

        </View>
    )
  }

  goOrderDetailPage = (id, e) => {
    if (e) e.stopPropagation();
    Taro.navigateTo({
      url: '/packageMy/pages/order/detail/index?id=' + id + '&status=' + this.state.tabList[this.state.tabIndex].id
    })
  }

    onChangeTabIndex = (index, e) => {
        e.stopPropagation();
        this.setState(prevState => ({
            tabIndex: index,
            orderList: [],
            pageCurr: 1,
        }));
        this.fetchList(1, this.state.tabList[index].id);
    }
  
  
  fetchList = (p = 1, status = '') => {
    getOrderList({ pageNum: p, pageSize: 10, status: status }).then(res => {
        let { statusMapping, orderTypeMapping } = this.state;
        res.list.map(item => {
            item['mess'] = statusMapping[item.status];
            item['typeMess'] = orderTypeMapping[item.orderType];

            item['goods'] = JSON.parse(item.goods || '[]');
            item['goodsTotal'] = item['goods'].length;
        });
        this.setState(prevState => ({
            orderList: p == 1 ? res.list : prevState.orderList.concat(res.list)
        }));
    })
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
  
}
