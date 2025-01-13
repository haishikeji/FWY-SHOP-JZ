import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text } from '@tarojs/components'

import { AtSwipeAction, AtInputNumber } from 'taro-ui'
import { getCarts, addToCart, removeCart, subtractNum } from '../../services/cart';

import GlobalBtn from '../../components/global/globalBtn'
import { showTextToast } from '../../utils/util';

import NoDataComponent from '../../components/not-data';

import classNames from 'classnames';

export default class CarPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            userInfo: {},
            allChked: false,
            chkIds: {},
            chkType: '',
            selectedNum: 0,
            carts: [],
            typeCarts: {},
            // childrenBorrowCarts: [],
            // childrenBuyCarts: [],
            // aultCarts: [],
            typeChked: {
                num: 0,
                type: ''
            },
            isSomeVip: false,
        }
    }

    componentWillMount() {
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
            chkIds: {},
            chkType: '',
            selectedNum: 0,
            carts: [],
            typeCarts: {},
            typeChked: { num: 0, type: ''},
            isSomeVip: _flag
        }));
        this.fetchCarts();
    }


    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '购物车',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='car-page'>
                {
                    (!this.state.carts || this.state.carts.length == 0) && 
                        <NoDataComponent text='购物车暂无商品' imgSize={'height: 260rpx; width: 260rpx;'} img='http://bookclub-imgs.doule.me/imgs/common/pic-not-car.png' />
                }

                { this.state.typeCarts['CHILDREN_BORROW'] && this.state.typeCarts['CHILDREN_BORROW'].length > 0 && <View>
                    <View className='title-block'>
                        借绘本
                    </View>

                    <View className='record-wrap'>
                    {
                        Array.isArray(this.state.typeCarts['CHILDREN_BORROW']) && this.state.typeCarts['CHILDREN_BORROW'].map((cart, index) => (

                            <AtSwipeAction key={index} autoClose={true} onClick={this.handleSwipeActionClick.bind(this, cart.id)} options={[
                                {
                                    text: '取消',
                                    style: {
                                        backgroundColor: '#e8ecf8',
                                        color: '#333'
                                        // backgroundColor: '#6190E8'
                                    }
                                },
                                {
                                    text: '删除',
                                    style: {
                                        backgroundColor: '#FF4949',
                                        color: 'white'
                                    }
                                }
                            ]}>
                                <View className='lf-wrap'>
                                    <View className='lf-wrap-goods-chk'>
                                        {
                                            this.state.chkIds[cart.id] == true ?
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-actived.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                                :
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-normal.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                        }
                                    </View>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={cart.refVo.coverPicUrl} mode='scaleToFill' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.refId)} />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        <Text className='goods-name' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.id)}>{cart.refVo.name}</Text>
                                        <View className="tags">
                                            {
                                                cart.refVo.convertShowTags && cart.refVo.convertShowTags.map((tag, index) => (
                                                    <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                ))
                                            }
                                        </View>
                                        {/* {
                                            index == 0 && <View className='tip-btns'>
                                                <View className='cancel-tip-btn'>取消提醒</View>
                                            </View>
                                        }
                                        {
                                            index == 1 && <View className='tip-btns'>
                                                <View className='arrival-tip-btn'>到货提醒</View>
                                            </View>
                                        } */}
                                        {
                                            <View className='text-price'>
                                                <Text className='price-symbol'>-</Text>
                                                <View className='goods-nums'>
                                                    <AtInputNumber min={1} max={99} step={1} type='number' disabledInput={true} value={cart.num} onChange={this.handleChange.bind(this, cart.type, cart.refId, cart.num)} />
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </AtSwipeAction>
                        ))
                    }
                    </View>
                </View>
                }


                { this.state.typeCarts['CHILDREN_BUY'] && this.state.typeCarts['CHILDREN_BUY'].length > 0 && <View>
                    <View className='title-block'>
                        买绘本
                    </View>

                    <View className='record-wrap'>
                    {
                        Array.isArray(this.state.typeCarts['CHILDREN_BUY']) && this.state.typeCarts['CHILDREN_BUY'].map((cart, index) => (

                            <AtSwipeAction key={index} autoClose={true} onClick={this.handleSwipeActionClick.bind(this, cart.id)} options={[
                                {
                                    text: '取消',
                                    style: {
                                        backgroundColor: '#e8ecf8',
                                        color: '#333'
                                        // backgroundColor: '#6190E8'
                                    }
                                },
                                {
                                    text: '删除',
                                    style: {
                                        backgroundColor: '#FF4949',
                                        color: 'white'
                                    }
                                }
                            ]}>
                                <View className='lf-wrap'>
                                    <View className='lf-wrap-goods-chk'>
                                        {
                                            this.state.chkIds[cart.id] == true ?
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-actived.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                                :
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-normal.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                        }
                                    </View>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={cart.refVo.coverPicUrl} mode='scaleToFill' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.refId)} />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        <Text className='goods-name' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.id)}>{cart.refVo.name}</Text>
                                        <View className="tags">
                                            {
                                                cart.refVo.convertShowTags && cart.refVo.convertShowTags.map((tag, index) => (
                                                    <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                ))
                                            }
                                        </View>
                                        {/* {
                                            index == 0 && <View className='tip-btns'>
                                                <View className='cancel-tip-btn'>取消提醒</View>
                                            </View>
                                        }
                                        {
                                            index == 1 && <View className='tip-btns'>
                                                <View className='arrival-tip-btn'>到货提醒</View>
                                            </View>
                                        } */}
                                        {
                                            <View className='text-price'>
                                                <Text className='price-symbol'>￥</Text>{ this.state.isSomeVip == true ? (cart.refVo.salePrice || 0).toFixed(2) : (cart.refVo.markPrice || 0).toFixed(2) } 
                                                <View className='goods-nums'>
                                                    <AtInputNumber min={1} max={99} step={1} type='number' disabledInput={true} value={cart.num} onChange={this.handleChange.bind(this, cart.type, cart.refId, cart.num)} />
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </AtSwipeAction>
                        ))
                    }
                    </View>
                </View>
                }



                { this.state.typeCarts['ADULT_BUY'] && this.state.typeCarts['ADULT_BUY'].length > 0 && <View>
                    <View className='title-block'>
                        成人馆图书
                    </View>

                    <View className='record-wrap'>
                    {
                        Array.isArray(this.state.typeCarts['ADULT_BUY']) && this.state.typeCarts['ADULT_BUY'].map((cart, index) => (

                            <AtSwipeAction key={index} autoClose={true} onClick={this.handleSwipeActionClick.bind(this, cart.id)} options={[
                                {
                                    text: '取消',
                                    style: {
                                        backgroundColor: '#e8ecf8',
                                        color: '#333'
                                        // backgroundColor: '#6190E8'
                                    }
                                },
                                {
                                    text: '删除',
                                    style: {
                                        backgroundColor: '#FF4949',
                                        color: 'white'
                                    }
                                }
                            ]}>
                                <View className='lf-wrap'>
                                    <View className='lf-wrap-goods-chk'>
                                        {
                                            this.state.chkIds[cart.id] == true ?
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-actived.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                                :
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-normal.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                        }
                                    </View>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={cart.refVo.coverPicUrl} mode='scaleToFill' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.refId)} />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        <Text className='goods-name' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.id)}>{cart.refVo.name}</Text>
                                        <View className="tags">
                                            {
                                                cart.refVo.convertShowTags && cart.refVo.convertShowTags.map((tag, index) => (
                                                    <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                ))
                                            }
                                        </View>
                                        {/* {
                                            index == 0 && <View className='tip-btns'>
                                                <View className='cancel-tip-btn'>取消提醒</View>
                                            </View>
                                        }
                                        {
                                            index == 1 && <View className='tip-btns'>
                                                <View className='arrival-tip-btn'>到货提醒</View>
                                            </View>
                                        } */}
                                        {
                                            <View className='text-price'>
                                                <Text className='price-symbol'>￥</Text>{ this.state.isSomeVip == true ? (cart.refVo.salePrice || 0).toFixed(2) : (cart.refVo.markPrice || 0).toFixed(2) } 
                                                <View className='goods-nums'>
                                                    <AtInputNumber min={1} max={99} step={1} type='number' disabledInput={true} value={cart.num} onChange={this.handleChange.bind(this, cart.type, cart.refId, cart.num)} />
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </AtSwipeAction>
                        ))
                    }
                    </View>
                </View>
                }


                { this.state.typeCarts['ADULT_PARTICIPATE_RESTURANT'] && this.state.typeCarts['ADULT_PARTICIPATE_RESTURANT'].length > 0 && <View>
                    <View className='title-block'>
                        美食馆
                    </View>

                    <View className='record-wrap'>
                    {
                        Array.isArray(this.state.typeCarts['ADULT_PARTICIPATE_RESTURANT']) && this.state.typeCarts['ADULT_PARTICIPATE_RESTURANT'].map((cart, index) => (

                            <AtSwipeAction key={index} autoClose={true} onClick={this.handleSwipeActionClick.bind(this, cart.id)} options={[
                                {
                                    text: '取消',
                                    style: {
                                        backgroundColor: '#e8ecf8',
                                        color: '#333'
                                        // backgroundColor: '#6190E8'
                                    }
                                },
                                {
                                    text: '删除',
                                    style: {
                                        backgroundColor: '#FF4949',
                                        color: 'white'
                                    }
                                }
                            ]}>
                                <View className='lf-wrap'>
                                    <View className='lf-wrap-goods-chk'>
                                        {
                                            this.state.chkIds[cart.id] == true ?
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-actived.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                                :
                                                <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-normal.png' mode='widthFix' onClick={this.changeChkStatus.bind(this, cart.type, cart.id)} />
                                        }
                                    </View>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={cart.refVo.coverPicUrl} mode='scaleToFill' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.refId)} />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        <Text className='goods-name' onClick={this.gotoPage.bind(this, 'goods-detail/index?id=' + cart.id)}>{cart.refVo.name}</Text>
                                        <View className="tags">
                                            {
                                                cart.refVo.convertShowTags && cart.refVo.convertShowTags.map((tag, index) => (
                                                    <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                ))
                                            }
                                        </View>
                                        {/* {
                                            index == 0 && <View className='tip-btns'>
                                                <View className='cancel-tip-btn'>取消提醒</View>
                                            </View>
                                        }
                                        {
                                            index == 1 && <View className='tip-btns'>
                                                <View className='arrival-tip-btn'>到货提醒</View>
                                            </View>
                                        } */}
                                        {
                                            <View className='text-price'>
                                                <Text className='price-symbol'>￥</Text>{(cart.refVo.salePrice || 0).toFixed(2)} 
                                                <View className='goods-nums'>
                                                    <AtInputNumber min={1} max={99} step={1} type='number' disabledInput={true} value={cart.num} onChange={this.handleChange.bind(this, cart.type, cart.refId, cart.num)} />
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </AtSwipeAction>
                        ))
                    }
                    </View>
                </View>
                }



                {
                    this.state.carts.length > 0 && <View className='footer-wrap'>
                        <View className='footer-actions'>
                            <View className='footer-left'>
                                {
                                    this.state.allChked == true ?
                                        <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-actived.png' mode='widthFix' onClick={this.changeAllChked} />
                                        :
                                        <Image src='http://bookclub-imgs.doule.me/imgs/car/icon-chk-normal.png' mode='widthFix' onClick={this.changeAllChked} />
                                }
                                全选
                                <View className='text-price'>
                                    总计: <Text className='price-symbol'> </Text>{(this.state.selectedNum || 0)}个商品
                                </View>
                            </View>
                            <View className='footer-right'>
                                <GlobalBtn text='结算' onBtnAction={this.gotoSubmit.bind(this)} />
                                {/* <Image className='car-btn' src='http://gold-shop1-img.doule.me/images/car/icon-car-btn.png' mode='widthFix' /> */}
                            </View>
                        </View>
                    </View>
                }
            </View>
        )
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    gotoMySubPage = (url, e) => {
      if (e) e.stopPropagation();
      Taro.navigateTo({
        url: '/packageMy/pages/' + url
      })
    }

    gotoSubmit = () => {
        let _filters = Object.entries(this.state.chkIds).filter(item => item[1] == true);
        if (_filters != null && _filters.length > 0) {
            let _ids = _filters.map(item => item[0]);
            if (_ids.length > 0) {

                if (this.state.typeChked.type == 'CHILDREN_BORROW' && this.state.userInfo.isChildrenVip == 0 && this.state.userInfo.isChildrenBorrowVip == 0) {
                    showTextToast('请在办理会员后才能借阅绘本');
                    setTimeout(() => {
                        this.gotoMySubPage('my/vip/index', null)
                    }, 1500);
                    return;
                }
                
                if (this.state.typeChked.type == 'ADULT_PARTICIPATE_RESTURANT') {
                    this.gotoMySubPage('order/meal-submit/index?ids=' + _ids.join(',') + '&type=ADULT_PARTICIPATE_RESTURANT', null)
                } else {
                    this.gotoPage('payment/submit/index?ids=' + _ids.join(',') + '&type=' + this.state.typeChked.type, null)
                }
            }
        } else {
            showTextToast('未选中商品');
        }
    }
    
    confirmDelted = (id) => {
        if (!id) {
          showTextToast('未找到相应商品');
          return;
        }
        Taro.showLoading({
            title: '删除购物车商品中',
            mask: true
        })
        removeCart({ id: id }).then(res => {
            showTextToast('删除购物车商品成功');
            this.fetchCarts();
        }).then(() => {
            Taro.hideLoading();
        })
    }

    handleSwipeActionClick = (id, node) => {
        if (node && node.text == '删除') {
            this.confirmDelted(id);
        }
    }

    changeAllChked = () => {
    //   let ids = this.state.carts.map(cart => cart.id);
    //   let objMapping = {};
    //   ids.map(id => {
    //       objMapping[id] = true;
    //   })
    //   this.setState(prevState => ({
    //       chkIds: !prevState.allChked ? objMapping : {},
    //       allChked: !prevState.allChked
    //   }));
    //   setTimeout(() => {
    //       this.chkedPrice();
    //   }, 0);
    }

    handleChange(type, id, cartNum, currNum) {
        Taro.showLoading({
            title: '正在操作',
            mask: true
        });
        if (currNum < cartNum) {
            subtractNum({ type: type, id: id }).then(res => {
                this.fetchCarts();
            }).then(() => {
                Taro.hideLoading();
            });
        } else {
            addToCart({ type: type, id: id, num: 1 }).then(res => {
                this.fetchCarts();
            }).then(() => {
                Taro.hideLoading();
            });
        }
        // shopingUpCart({ gid: gid, cid: id, quantity: value, token: Taro.getStorageSync('token') }).then(res => {
        //     this.getCar();
        // }).then(() => {
        //     Taro.hideLoading();
        // })
    }

    chkedPrice = () => {
        if (!this.state.carts || this.state.carts.length == 0) return;
        let c = (this.state.carts.map(cart => this.state.chkIds[cart.id] == true ? cart.price * cart.quantity : 0) || []).reduce(function (a, b) {
            return a + b;
        });
        let selectedNum = this.state.carts.filter(cart => this.state.chkIds[cart.id] == true).length;
        this.setState(prevState => ({
            totalPrice: c,
            selectedNum: selectedNum
        }));
    }

    changeChkStatus = (type, fieldKey, e) => {
        let chkIdRecords = JSON.parse(JSON.stringify(this.state.chkIds));
        if (chkIdRecords[fieldKey]) {
            let _flag = !chkIdRecords[fieldKey];
            chkIdRecords[fieldKey] = _flag;
            let _lastNum = this.state.typeChked.num;
            if (_flag == false && _lastNum > 0) {
                _lastNum = _lastNum - 1;
            }
            this.setState(prevState => ({
                chkIds: chkIdRecords,
                chkType: '',
                typeChked: { type: _lastNum == 0 ? '' : this.state.typeChked.type, num: _lastNum },

            }));
        } else {
            if (this.state.typeChked.type != '' && this.state.typeChked.type != type) {
                showTextToast('请选择同类型的商品.')
                return;
            }
            chkIdRecords[fieldKey] = true;
            this.setState(prevState => ({
                chkIds: chkIdRecords,
                chkType: type,
                typeChked: { type: type, num: this.state.typeChked.num + 1 }
            }));
        }
        setTimeout(() => {
            let _chkCount = Object.values(this.state.chkIds).filter(val => val == true).length;
            this.setState(prevState => ({
                allChked: _chkCount == this.state.carts.length
            }));
            this.chkedPrice();
        }, 0);
    }

    

    fetchCarts = () => {
        getCarts().then(res => {
            let typeCarts = {
                'CHILDREN_BORROW': [],
                'CHILDREN_BUY': [],
                'ADULT_BUY': [],
                'ADULT_PARTICIPATE_RESTURANT': [],
            };
            res.list.map(cart => {
                let _vo = cart.refVo;
                let _showTags = _vo.showTags.split(',');
                if (_vo.ages && _vo.ages.length) {
                    let _ageArrs = [];
                    _vo.ages.map(item => {
                        _ageArrs.push({
                            type: 'age',
                            name: item.name
                        })
                    });
                    _showTags = [ ..._ageArrs, ..._showTags ];
                }
                _vo['convertShowTags'] = _showTags;
                // debugger;
                typeCarts[cart.type].push(cart);
            })
            this.setState(prevState => ({
                carts: res.list,
                typeCarts: typeCarts
            }));
        }).catch(() => {
            this.setState(prevState => ({
                carts: [],
                typeCarts: {}
            }));
        })
    }

    addToCart = (type, id) => {
        let _type = '';
        if (type && type == 'ADULT_PARTICIPATE_RESTURANT') {
            _type = type;
        } else {
            if (this.state.group == '0') {
                if (this.state.isBuy == 'true') {
                    _type = 'CHILDREN_BUY'
                } else if (this.state.isBuy == 'false') {
                    _type = 'CHILDREN_BORROW'
                }
            } else if (this.state.group == '1') {
                _type = 'ADULT_BUY'
            }
        }
        addToCart({ type: _type, id: this.$router.params.id, num: 1 }).then(res => {
            showTextToast('修改成功.')
        });
    }

}
