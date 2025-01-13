import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text, ScrollView, Picker } from '@tarojs/components'
import { AtInput, AtFloatLayout, AtTextarea } from 'taro-ui'

import GlobalBtn from '../../../../components/global/globalBtn'
import { fetchDefaultAddress } from '../../../../services/address';
import { createOrder } from '../../../../services/order';
import { fetchCheckedCarts } from '../../../../services/cart';
import { getMealShowAllTags } from '../../../../services/meal';
import { getDictMappingByType, getAmountInfo } from '../../../../services/common';

import classNames from 'classnames'

import { showTextToast } from '../../../../utils/util';

export default class PayMealSubmitPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            mode: 0,
            selectedAddress: {},
            today: '',
            takeDay: '',
            goods: [],
            goodsTotal: 0,
            type: '',
            tableNum: '',
            eatNum: 1,
            totalPrice: 0,
            calcPrice: 0,
            dialogStatus: false,
            dialogRemark: '',
            dialogSelectedTag: {},
            tags: [],
            selectedRemark: '',
            selectedTag: '',
            sendPrice: 0,
            tablewarePrice: 0,
            packagePrice: 0,
            fullReductionPrice: 0,
            distributionScope: '',
            amount: {},

            surplusMoeny: 0,
        }
    }

    componentWillMount() {
        let _today = this.getNowFormatDate();
        this.setState({
            today: _today,
            takeDay: _today
        });
    }

    componentDidShow() {
        let pages = Taro.getCurrentPages();
        let currPage = pages[pages.length - 1];
        if (currPage.__data__ && currPage.__data__.selectedAddress && Object.keys(currPage.__data__.selectedAddress).length > 0) {
            this.setState({ selectedAddress: currPage.__data__.selectedAddress })
        } else if (currPage.data && currPage.data.selectedAddress && Object.keys(currPage.data.selectedAddress).length > 0) {
            this.setState({ selectedAddress: currPage.data.selectedAddress })
        } else {
            this.getDefaultAddress();
        }
        
        let _resturantTableName = Taro.getStorageSync('resturantTableName');
        if (_resturantTableName) {
            this.setState({
                tableNum: _resturantTableName
            });
        }
        this.fetchAmountDetail();

        this.fetchDicts('MEAL_INFO_CONFIG');
        // this.fetchDictVo('tablewarePrice', 'MEAL_INFO_CONFIG', 'TABLEWARE_PRICE');
        // this.fetchDictVo('packagePrice', 'MEAL_INFO_CONFIG', 'PACKAGE_PRICE');
        // this.fetchDictVo('fullReductionPrice', 'MEAL_INFO_CONFIG', 'FULL_REDUCTION_PRICE');
        this.setState({
            type: this.$router.params.type
        });

    }

    config: Config = {
        navigationBarTitleText: '确认订单',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='pay-meal-submit-page'>
                <View className='content-wrap mode-content-wrap'>
                    <View className='at-row mode-wrap'>
                        <View className='at-col'>
                            <View className={ classNames('text', this.state.mode == 0 && 'actived-1') } onClick={this.changeMode.bind(this, 0)}>
                                堂食
                            </View>
                        </View>
                        {/* <View className='at-col'>
                            <View className={ classNames('text', this.state.mode == 1 && 'actived-2') } onClick={this.changeMode.bind(this, 1)}>
                                外卖
                            </View>
                        </View> */}
                    </View>
                    { this.state.mode == 1 && 
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
                    { this.state.mode == 0 && 
                        <View className='lf-wrap plr20'>
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
                                共{this.state.goodsTotal}份
                            </View>
                        </View>
                    }
                </View>

                { this.state.mode == 1 && <View className='content-wrap goods-content-wrap'>
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
                            共{this.state.goodsTotal}份
                        </View>
                    </View>
                </View> }

                <View className='content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            商品原价
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{(this.state.totalPrice || 0).toFixed(2)}
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
                    {/* <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            送餐费
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{ (this.state.totalPrice < this.state.fullReductionPrice ? this.state.sendPrice : 0).toFixed(2) }
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            餐具费
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{ (this.state.eatNum * this.state.tablewarePrice).toFixed(2) }
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left lf-wrap-deposit-left'>
                            打包费
                        </View>
                        <View className='lf-wrap-right lf-wrap-deposit-right'>
                            ¥{ (this.state.packagePrice || 0).toFixed(2) }
                        </View>
                    </View> */}
                </View>

                <View className='content-wrap'>
                    { this.state.mode == 0 &&<View className='lf-wrap'>
                        <View className='lf-wrap-left'>
                            就餐桌号
                        </View>
                        <View className='lf-wrap-right'>
                            <AtInput
                                name='name'
                                type='text'
                                placeholder='请输入就餐桌号'
                                className='ipt-class'
                                placeholderClass='ipt-placeholder'
                                value={this.state.tableNum}
                                onChange={this.bindInputChange.bind(this, 'tableNum')}
                            />
                        </View>
                    </View> }
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left'>
                            备注
                        </View>
                        <View className='lf-wrap-right' onClick={this.setDialog.bind(this, true)}>
                            { this.state.selectedRemark || '请选择备注内容' }
                            <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-arrow-right.png' />
                        </View>
                    </View>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-left'>
                            用餐人数
                        </View>
                        <View className='lf-wrap-right'>
                            <AtInput
                                name='name'
                                type='text'
                                placeholder='请输入就餐人数'
                                className='ipt-class'
                                placeholderClass='ipt-placeholder'
                                value={this.state.eatNum}
                                onChange={this.bindInputChange.bind(this, 'eatNum')}
                            />
                        </View>
                    </View>
                </View>

                <View className='remark'><Text className='tip'>注:</Text> {this.state.distributionScope}</View>

                <View className='footer-wrap'>
                    <View className='footer-actions'>
                        <View className='footer-left'>
                            <Text className='text'>合计:</Text> <Text className='price'>¥{(this.state.surplusMoeny || 0).toFixed(2)}元</Text>
                        </View>
                        <View className='footer-right'>
                            <GlobalBtn text='立即支付' onBtnAction={this.orderSubmit} />
                        </View>
                    </View>
                </View>

                <AtFloatLayout isOpened={this.state.dialogStatus} className='dialog-wrap' onClose={this.setDialog.bind(this, false)}>
                    {
                    <View>
                        <View className='dialog-title-wrap'>
                            <Text className='title'>订单备注</Text>
                            <Image src='http://gold-shop-img.doule.me/images/global/icon-dialog-close.png' className='icon-close-right' onClick={this.setDialog.bind(this, false)} />
                        </View>
                        {/* <View className='divider'></View> */}
                        <View className='dialog-content-wrap'>
                            <AtTextarea
                                value={this.state.dialogRemark}
                                onChange={this.bindInputChange.bind(this, 'dialogRemark')}
                                maxLength={100}
                                className="dialog-textarea"
                                placeholder='如有特殊需求请在此处说明...'
                            />
                            <View className='tags-wrap'>
                                <View className='tag-title'>快捷标签</View>
                                <View className='remark-tags'>
                                    {
                                        this.state.tags && this.state.tags.map((tag, index) => (
                                            <View className={ classNames('tag', this.state.dialogSelectedTag[tag.id] && 'actived') } key={index} onClick={this.changeTagItem.bind(this, tag.id)} >{tag.name || tag}</View>
                                        ))
                                    }
                                </View>
                            </View>
                        </View>
                        <View className='global-btn-wrap'>
                            <GlobalBtn text='完成' onBtnAction={this.confirmDialog} />
                        </View>
                    </View>
                    }
                </AtFloatLayout>

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
      this.setState(params, () => {
          if (name == 'eatNum') {
            this.execPrice(this.state.goods);
          }
      });
      return value;
    }

    setDialog = (status, e) => {
      this.setState(prevState => ({
          dialogStatus: status,
      }));
      if (status) {
          this.getTags();
      }
    }

    confirmDialog = () => {
        let _selectedKeys = [];
        Object.keys(this.state.dialogSelectedTag).filter(key => {
            let _val = this.state.dialogSelectedTag[key];
            if (_val == true) {
                _selectedKeys.push(key);
            }
        });
        this.setState(prevState => ({
            selectedRemark: this.state.dialogRemark,
            selectedTags: _selectedKeys,
            dialogStatus: false
        }));
    }

    changeTagItem = (id, e) => {
        let _params = this.state.dialogSelectedTag;
        let _val = _params[id];
        let _append = '';
        // if (_val == undefined) {
        //     _params[id] = true;
        // } else{
        //     _params[id] = !_val;
        // }

        // if (_params[id] == true) {
            let _filterTags = (this.state.tags || []).filter(item => {
                return item.id == id;
            });
            if (_filterTags && _filterTags.length) {
                _append += _filterTags[0].name;
            }
        // }

        this.setState(prevState => ({
            dialogRemark: this.state.dialogRemark + (this.state.dialogRemark.length <= 0 ? '' : ',') + (_append || ''),
            dialogSelectedTag: _params
        }));
    }

    gotoAddressListPage = (e) => {
      Taro.navigateTo({
        url: '/pages/address/list/index'
      })
    }

    getTags = () => {
        getMealShowAllTags({ }).then(res => {
            this.setState(prevState => ({
                tags: res.list,
            }));
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
            this.execPrice(res.list);
        })
    }

    onDateChange = e => {
      this.setState({
        takeDay: e.detail.value
      })
    }

    execPrice = (goods) => {
        if (!goods || goods.length == 0) return;
        let _execPrice = (goods.map(cart => cart.refVo.salePrice * cart.num || 0) || []).reduce(function (a, b) {
            return a + b;
        });

        let _calcPrice = _execPrice;
        if (this.state.mode == 1) {
            if (_execPrice < this.state.fullReductionPrice) {
                _calcPrice += this.state.sendPrice;
            }
    
            if (this.state.tablewarePrice) {
                _calcPrice += (this.state.eatNum || 1) * this.state.tablewarePrice;
            }
    
            if (this.state.packagePrice) {
                _calcPrice += this.state.packagePrice;
            }
        }

        let _surplusMoeny = 0;
        if (_calcPrice > this.state.amount.money) {
            _surplusMoeny = _calcPrice - this.state.amount.money;
        }

        this.setState(prevState => ({
            totalPrice: _execPrice,
            surplusMoeny: _surplusMoeny,
            calcPrice: _calcPrice
        }));
    }
  
    orderSubmit = (e) => {
        let _idStr = this.$router.params.ids;
        if (!_idStr || _idStr.length == 0) {
            showTextToast('未选择购买的商品');
            return;
        }
        if (this.state.mode == 0 && !this.state.tableNum) {
            showTextToast('请输入就餐桌号');
            return;
        }
        if (this.state.mode == 1 && (!this.state.selectedAddress || !this.state.selectedAddress.id)) {
            showTextToast('请选择收货地址');
            return;
        }

        let _tagNames = [];
        if (this.state.selectedTags) {
            let _filterTag = this.state.tags.filter(item => this.state.selectedTags.indexOf(item.id + '') != -1);
            if (_filterTag && _filterTag.length > 0) {
                _tagNames = _filterTag.map(item => item.name);
            }
        }

        let _remark = { 
            tableNum: this.state.tableNum, 
            eatNum: this.state.eatNum, 
            remark: this.state.selectedRemark, 
            tags: _tagNames 
        }

        if (this.state.mode == 1) {
            _remark['sendPrice'] = this.state.totalPrice < this.state.fullReductionPrice ? this.state.sendPrice : 0;
            _remark['tablewarePrice'] = (this.state.eatNum || 1) * this.state.tablewarePrice;
            _remark['packagePrice'] = this.state.packagePrice;
        }

        createOrder({
            cartStr: _idStr,
            distributionMode: this.state.mode == 1 ? 'EXPRESS' : 'YOURSELF',
            orderType: 'ADULT_PARTICIPATE_RESTURANT',
            payPlatform: 'WX',
            refReceivedPk: this.state.mode == 1 ? this.state.selectedAddress.id : '',
            remark: JSON.stringify(_remark)
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

    fetchDicts = (type) => {
      if (!type) {
        return;
      }
      getDictMappingByType({ type: type }).then(res => {
        this.setState(prevState => ({
            sendPrice: parseInt(res.mapping['SEND_PRICE'].value),
            tablewarePrice: parseInt(res.mapping['TABLEWARE_PRICE'].value),
            packagePrice: parseInt(res.mapping['PACKAGE_PRICE'].value),
            fullReductionPrice: parseInt(res.mapping['FULL_REDUCTION_PRICE'].value),
            distributionScope: res.mapping['DISTRIBUTION_SCOPE'].value
        }), () => {
            this.getCheckedCarts((this.$router.params.ids || ''));
        });
      });
    }

    fetchAmountDetail = () => {
        getAmountInfo({ }).then(res => {
            this.setState(prevState => ({
                amount: res.vo || {},
            }));
        });
    }
    

}
