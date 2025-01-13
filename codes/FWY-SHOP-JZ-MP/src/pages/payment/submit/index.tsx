import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'

import GlobalBtn from '../../../components/global/globalBtn'
import { fetchDefaultAddress } from '../../../services/address';
import { createOrder } from '../../../services/order';
import { fetchCheckedCarts } from '../../../services/cart';

import { getMappingByTypeAndCode, getAmountInfo } from '../../../services/common';

import classNames from 'classnames'

import { showTextToast } from '../../../utils/util';

export default class PaySubmitPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            mode: 0,
            selectedAddress: {},
            today: '',
            takeDay: '',
            extractDay: '',
            goods: [],
            goodsTotal: 0,
            type: '',
            userInfo: {},
            totalPrice: 0,
            vipTotalPrice: 0,
            surplusMoeny: 0,
            amount: {},
            coffeeHouseDict: {},
            isSomeVip: false,
        }
    }

    componentWillMount() {
        let _today = this.getNowFormatDate();
        this.setState({
            today: _today,
            takeDay: _today,
            extractDay: _today
        });

        this.fetchDictVo('coffeeHouseDict', 'COFFEE_HOUSE_ADDRESS', 'ADDRESS');

    }

    componentDidShow() {
        let _member = Taro.getStorageSync('member');
        let _flag = false;
        if (_member) {
          if (_flag == false) {
            _flag = _member.isChildrenVip == 1;
          }
          if (_flag == false) {
            _flag = _member.isChildrenBorrowVip == 1;
          }
          if (_flag == false) {
            _flag = _member.isAdultBorrowVip == 1;
          }
          if (_flag == false) {
            _flag = _member.isSavingVip == 1;
          }
          if (_flag == false) {
            _flag = _member.childrenCardNum > 0;
          }
        }
        this.setState(prevState => ({
          userInfo: _member,
          isSomeVip: _flag
        }));

        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.__data__ && currPage.__data__.selectedAddress && Object.keys(currPage.__data__.selectedAddress).length > 0) {
            this.setState({ selectedAddress: currPage.__data__.selectedAddress })
        } else if (currPage.data && currPage.data.selectedAddress && Object.keys(currPage.data.selectedAddress).length > 0) {
            this.setState({ selectedAddress: currPage.data.selectedAddress })
        } else {
            this.getDefaultAddress();
        }

        this.setState({
            type: this.$router.params.type
        });

        this.getCheckedCarts((this.$router.params.ids || ''));
    }

    config: Config = {
        navigationBarTitleText: '提交订单',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='pay-submit-page'>
                <View className='content-wrap mode-content-wrap'>
                    <View className='at-row mode-wrap'>
                        <View className='at-col'>
                            <View className={ classNames('text', this.state.mode == 0 && 'actived-1') } onClick={this.changeMode.bind(this, 0)}>
                                配送到家
                            </View>
                        </View>
                        <View className='at-col'>
                            <View className={ classNames('text', this.state.mode == 1 && 'actived-2') } onClick={this.changeMode.bind(this, 1)}>
                                到店自取
                            </View>
                        </View>
                    </View>
                    { this.state.mode == 0 && 
                        <View className='address-wrap' onClick={this.gotoAddressListPage}>
                            <View className='address-wrap-left'>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-address.png' />
                            </View>
                            {
                                this.state.selectedAddress && this.state.selectedAddress.id ?
                                    <View className='address-wrap-center'>
                                        <Text>{this.state.selectedAddress.name}</Text>
                                        <Text className='phone'>{this.state.selectedAddress.phone}</Text>
                                        <View className='address'>
                                            {this.state.selectedAddress.province ? this.state.selectedAddress.province + '省' : ''}
                                            {this.state.selectedAddress.city ? this.state.selectedAddress.city + '市' : ''}
                                            {this.state.selectedAddress.area ? this.state.selectedAddress.area + '区' : ''}
                                            {this.state.selectedAddress.addr ? this.state.selectedAddress.addr : ''}
                                        </View>
                                    </View>
                                    :
                                    <View className='address-wrap-center'>
                                        添加地址
                                </View>
                            }
                            <View className='address-wrap-right'>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View>
                    }
                    { this.state.mode == 1 && 
                        <View className='address-wrap'>
                            <View className='address-wrap-left'>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-address.png' />
                            </View>
                            <View className='address-wrap-center'>
                                {this.state.coffeeHouseDict.value}
                            </View>
                        </View>
                    }
                    {/* { this.state.mode == 1 && 
                        <View className='address-wrap'>
                            <View className='address-wrap-left'>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-address.png' />
                            </View>
                            <View className='address-wrap-center'>
                                选择门店地址
                            </View>
                            <View className='address-wrap-right'>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View>
                    } */}
                </View>

                <View className='content-wrap goods-content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-goods-left'>
                            <ScrollView className='recommend-scroll' scrollX={true} scrollWithAnimation>
                                <View className='recommend-list'>
                                    {
                                        Array.isArray(this.state.goods) && this.state.goods.map((item, index) => (
                                            <View className='recommend-item'>
                                                <Image src={item.refVo.coverPicUrl} mode='scaleToFill' />
                                            </View>
                                        ))
                                    }
                                </View>
                            </ScrollView>
                        </View>
                        <View className='lf-wrap-right lf-wrap-goods-right'>
                            共{this.state.goodsTotal}本
                        </View>
                    </View>
                </View>

                { ((this.state.type == 'CHILDREN_BUY' || this.state.type == 'ADULT_BUY')  && this.state.mode == 0) && <View className='content-wrap'>
                        <View className='lf-wrap'>
                            <View className='lf-wrap-left'>
                                配送方式
                            </View>
                            <View className='lf-wrap-right'>
                                京东速配，快递费用由用户支付
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View>
                    </View>
                }

                { (this.state.type == 'CHILDREN_BORROW' && this.state.mode == 0) && 
                    <View className='content-wrap'>
                        <View className='lf-wrap'>
                            <View className='lf-wrap-left'>
                                配送方式
                            </View>
                            <View className='lf-wrap-right'>
                                京东速配，快递费用由用户支付
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View>
                        <View className='lf-wrap'>
                            <View className='lf-wrap-left'>
                                借阅日期
                            </View>
                            <View className='lf-wrap-right'>
                                {/* <Picker mode='date' onChange={this.onDateChange} style="display: inline-block">
                                    {this.state.takeDay}
                                </Picker> */}
                                {this.state.takeDay}-无限
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View>
                    </View>
                }

                { this.state.mode == 1 && 
                    <View className='content-wrap'>
                        <View className='lf-wrap'>
                            <View className='lf-wrap-left'>
                                自提时间
                            </View>
                            <View className='lf-wrap-right'>
                                <Picker mode='date' onChange={this.onExtractDateChange} style="display: inline-block">
                                    {this.state.extractDay}
                                </Picker>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View>
                        {/* { this.state.type == 'CHILDREN_BORROW' && <View className='lf-wrap'>
                            <View className='lf-wrap-left'>
                                借阅日期
                            </View>
                            <View className='lf-wrap-right'>
                                <Picker mode='date' onChange={this.onDateChange} style="display: inline-block">
                                    {this.state.takeDay}
                                </Picker>
                                <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                            </View>
                        </View> } */}
                    </View>
                }

                { this.state.type == 'CHILDREN_BORROW' && <View className='content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            租金
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥0.00
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            押金(押金可退)
                            <Image src='http://bookclub-imgs.doule.me/imgs/payment/icon-pay-question.png' mode='widthFix' />
                            { this.state.userInfo.deposited == 0 &&<Text className='unpaid'>需支付押金租书</Text> }
                            { this.state.userInfo.deposited == 1 &&<Text className='unpaid green'>您已支付押金</Text> }
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            <Text className='unpaid-price'>¥300.00</Text>
                        </View>
                    </View>
                </View> }

                { (this.state.type == 'CHILDREN_BUY' || this.state.type == 'ADULT_BUY') && <View className='content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            账户余额
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{(this.state.amount.money || 0).toFixed(2)}
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            商品总价
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{(this.state.totalPrice || 0).toFixed(2)}
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            会员总价
                        </View>
                        { this.state.isSomeVip == true && <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{(this.state.vipTotalPrice || 0).toFixed(2)}
                        </View> }
                        { this.state.isSomeVip == false && <View className='lf-wrap-right lf-wrap-deposit-right'>
                            暂未开通会员
                        </View> }
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            需支付
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            <Text className='unpaid-price'>¥{(this.state.surplusMoeny || 0).toFixed(2)}</Text>
                        </View>
                    </View>
                </View> }

                <View className='footer-wrap'>
                    <View className='footer-actions'>
                        <View className='footer-left'>
                            <Text className='text'>总计:</Text> <Text className='book-num'>{(this.state.goodsTotal || 0)}</Text><Text className='book-unit'>本</Text>
                            <Text className='text'>合计:</Text> <Text className='price'>¥{this.state.surplusMoeny.toFixed(2)}元</Text>
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

    gotoAddressListPage = (e) => {
      Taro.navigateTo({
        url: '/pages/address/list/index'
      })
    }

    changeMode = (value, e) => {
        this.setState(prevState => ({
            mode: value
        }));
    }

    getDefaultAddress = () => {
        fetchDefaultAddress({ }).then(res => {
            this.setState(prevState => ({
                selectedAddress: res.vo,
            }));
        })
    }

    getCheckedCarts = (ids) => {
        fetchCheckedCarts({ ids: ids }).then(res => {
            let _goodsTotal = 0;
            res.list.map(item => {
                _goodsTotal += item.num
            })
            this.setState(prevState => ({
                goods: res.list,
                goodsTotal: _goodsTotal
            }));
            this.calcTotalPrice(res.list);
        })
    }

    onDateChange = e => {
      this.setState({
        takeDay: e.detail.value
      })
    }

    onExtractDateChange = e => {
      this.setState({
        extractDay: e.detail.value
      })
    }

    fetchAmountDetail = (totalPrice, vipTotalPrice) => {
        if (!totalPrice || totalPrice == 0) {
            return;
        }
        getAmountInfo({ }).then(res => {
            let _surplusMoeny = 0;
            if (this.state.isSomeVip == true) {
                if (totalPrice > res.vo.money) {
                    _surplusMoeny = vipTotalPrice - res.vo.money;
                }
            } else {
                if (totalPrice > res.vo.money) {
                    _surplusMoeny = totalPrice - res.vo.money;
                }
            }

            this.setState(prevState => ({
                amount: res.vo || {},
                surplusMoeny: _surplusMoeny,
                totalPrice: totalPrice,
                vipTotalPrice: vipTotalPrice
            }));
        });
    }

    calcTotalPrice = (goods) => {
        if (!goods || goods.length == 0) {
            return 0;
        }
        let _totalPrice = 0;
        let _vipTotalPrice = 0;
        if (this.state.type == 'CHILDREN_BORROW') {
            if (this.state.userInfo.deposited == 0) {
                _totalPrice += 300;
            }
        } else {
            goods.map(item => {
                _totalPrice += item.refVo.markPrice
                if (this.state.isSomeVip == true) {
                    _vipTotalPrice += item.refVo.salePrice
                }
            })
        }

        if (this.$router.params.type == 'CHILDREN_BUY' || this.$router.params.type == 'ADULT_BUY') {
            this.fetchAmountDetail(_totalPrice, _vipTotalPrice);
        } else {
            this.setState({
                totalPrice: _totalPrice,
                vipTotalPrice: _vipTotalPrice
            })
        }
    }
  
    orderSubmit = (e) => {
        let _idStr = this.$router.params.ids;
        if (!_idStr || _idStr.length == 0) {
            showTextToast('未选择购买的商品');
            return;
        } 
        if (this.state.mode == 0 && (!this.state.selectedAddress || !this.state.selectedAddress.id)) {
            showTextToast('请选择收货地址');
            return;
        }

        let _remarkParams = {};
        if (this.state.type == 'CHILDREN_BORROW' && this.state.mode == 0) {
            _remarkParams['takeDay'] = this.state.takeDay;
        }
        if (this.state.type == 'CHILDREN_BORROW' && this.state.mode == 1) {
            if (!this.state.extractDay) {
                showTextToast('请选择到店自提时间');
                return;
            } else {
                _remarkParams['extractDay'] = this.state.extractDay;
            }
        }

        createOrder({
            cartStr: _idStr,
            distributionMode: this.state.mode == 0 ? 'EXPRESS' : 'YOURSELF',
            orderType: this.state.type,
            payPlatform: 'WX',
            refReceivedPk: this.state.mode == 0 ? this.state.selectedAddress.id : '',
            remark: JSON.stringify(_remarkParams)
        }).then(res => {
            // showTextToast('下单成功');
            if (res.surplusPrice == 0) {
                Taro.redirectTo({
                    url: '/pages/payment/result/index?orderId=' + res.orderId
                })
            } else {
                Taro.redirectTo({
                    url: '/pages/payment/pay/index?orderId=' + res.orderId
                })
            }
            // this.onGotoNext();
        })
    }

    getNowFormatDate = () => {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        return year + seperator1 + month + seperator1 + strDate;
    }

  fetchDictVo = (name, type, code) => {
    if (!name || !type || !code) {
      return;
    }
    getMappingByTypeAndCode({ type: type, code: code }).then(res => {
      let _params = {};
      _params[name] = res.vo
      this.setState(prevState => (_params));
    });
  }

}
