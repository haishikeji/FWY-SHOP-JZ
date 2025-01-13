import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text, ScrollView } from '@tarojs/components'

import { AtTabs, AtFloatLayout } from 'taro-ui'

import { getCourseSeriesDetail, getCourseDetail } from '../../../services/course';
import { fetchAdvertShowBanners } from '../../../services/banner';

import { createOrder, getOrderDetail } from '../../../services/order';
import { getAmountInfo } from '../../../services/common';

import { fetchWxPay } from '../../../services/pay';

import GlobalBtn from '../../../components/global/globalBtn'
import { showTextToast } from '../../../utils/util';

import classNames from 'classnames';

import 'taro-parse/dist/style/main.scss'
import TaroParser from 'taro-parse'

import jump from '../../../utils/jump';

export default class CourseDetailPage extends Component {

    reqStatusTimer = null;

    constructor() {
        super(...arguments)
        this.state = {
            dialogStatus: false,
            selectedAge: '',
            selectedType: '',
            row2Show: false,
            tabTitles: [
                { id: 0, title: '介绍' },
                { id: 1, title: '节目' },
                // { id: 2, title: '购买须知' }
            ],
            currentTab: 0,
            series: {},
            group: 0,
            existBuy: false,
            accountInfo: {},
            surplusPrice: 0,
            type: 'COURSE_SERIES',

            ads: [],
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.setState(prevState => ({
            type: this.$router.params.type || 'COURSE_SERIES',
            group: this.$router.params.group || 0
        }), () => {
            this.fetchDetail(this.$router.params.id);
           // this.fetchAccountInfoDetail();
        });

        this.fetchBannerList('A0102', 'ads');
    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '课程详情',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='online-course-detail-page'>
                {
                    <View className='content-wrap course-content-wrap'>
                        <View className='lf-wrap'>
                            <View className='lf-wrap-course-top'>
                                <Image src={this.state.series.coverPicUrl} mode='widthFix' />
                            </View>
                            <View className='lf-wrap-course-bottom'>
                                <Text className='name'>{this.state.series.name}</Text>
                                <View className='tags'>
                                    {
                                        this.state.series.convertShowTags && this.state.series.convertShowTags.map((tag, index) => (
                                            <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                        ))
                                    }
                                </View>
                                <View className='descript'>
                                    {this.state.series.descript}
                                </View>
                                
                                <View className='text-price'>
                                    <Text className='price-symbol'>￥</Text>{(this.state.series.salePrice || 0).toFixed(2)}
                                </View>
                            </View>
                            
                        </View>
                    </View>
                }

                <View style="height: 20rpx; background: #F3F4F5;"></View>

                <View className='content-wrap'>
        
                    { (this.state.ads && this.state.ads.length) && 
                        <View className='join-ad' onClick={this.jumpWebview.bind(this, this.state.ads[0].descript, this.state.ads[0].url)}>
                            <Image src={ this.state.ads.length ? this.state.ads[0].adCoverUrl : '' } mode='widthFix' />
                        </View>
                    }

                    <AtTabs current={this.state.currentTab} tabList={this.state.tabTitles} onClick={this.handleClick.bind(this)}>
                    </AtTabs>

                    <View className={ classNames('content', 'real-content', this.state.currentTab != 0 && 'real-content-hide') }>
                        {/* <DescRichText desc={this.state.series.content}></DescRichText> */}
                        <TaroParser
                            type='markdown'
                            theme='light'
                            // onImgClick={this.imgClick}
                            // onLinkClick={this.linkClick}
                            onLoaded={() => {
                                Taro.hideLoading()
                            }}
                            yumlApi='https://md.werfei.com/?yuml'
                            latexApi='https://md.werfei.com/?tex'
                            content={this.state.series.content}
                        />
                    </View>

                    { this.state.currentTab == 1 && <View className='content'>
                        <ScrollView scrollY scrollWithAnimation className='course-items'>
                                {
                                    Array.isArray(this.state.series.courses) && this.state.series.courses.map((course, index) => (
                                        <View className='course-item' onClick={this.gotoCoursePlayPage.bind(this, 'online/play/index?id=' + this.state.series.id + '&courseId=' + course.id + '&type=' + this.state.type, ((this.state.existBuy == false && index != 0) || !course.mediaUrl))} key={index}>
                                            <View className='course-item-left'>
                                                <View className='seq'>
                                                    {index < 9 ? '0' + (index + 1) : index}
                                                </View>
                                            </View>
                                            <View className='course-item-right'>
                                                <View className='title'>
                                                    {course.name}
                                                </View>
                                                {/* <View className='desc'>
                                                    时长: -
                                                </View> */}
                                            </View>
                                            <View className='course-item-playicon'>
                                                <View className='icon'>
                                                    {
                                                        ((this.state.existBuy == true || index == 0) && course.mediaUrl) && <Image className='play-icon' src='http://bookclub-imgs.doule.me/imgs/online/icon-course-play.png' mode='widthFix' />
                                                    }
                                                    {
                                                        ((this.state.existBuy == false && index != 0) || !course.mediaUrl) && <Image src='http://bookclub-imgs.doule.me/imgs/online/icon-course-lock.png' mode='widthFix' />
                                                    }
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                    </View> }

                    { this.state.currentTab == 2 && <View className='content'>
                        <View>1.元免费办理会员，在会员期间您可以免费看所有的课程，会员期截止将不能享受会员待遇。</View>
                        <View>2.会员在上过本次课程后不能再次约本课程</View>
                        <View>3.会员需要提前一天取消课程，成功取消的课程可以进行下次预约，如果没有按规定取消本课课程，将不能进行下一次本课的预约，（请与工作人员联系)。但可以进行其他的课预约。</View>
                    </View> }
                </View>

                <View className='global-btn-wrap'>
                    <View className='at-row' style="align-items: center;">
                        <View className='at-col at-col-6'>
                            { this.state.type == 'COURSE_SERIES' && <Text onClick={this.gotoPage.bind(this, 'online/play/index?id=' + this.state.series.id)}>试看</Text> }
                        </View>
                        <View className='at-col'>
                            { this.state.existBuy == true && <GlobalBtn text='立即学习' onBtnAction={this.gotoPage.bind(this, 'online/play/index?id=' + this.$router.params.id + '&type=' + this.state.type)} /> }
                            { this.state.existBuy == false && <GlobalBtn text='购买课程' onBtnAction={this.setDialog.bind(this, true)} /> }
                        </View>
                    </View>
                </View>

                <AtFloatLayout isOpened={this.state.dialogStatus} className='dialog-wrap' onClose={this.setDialog.bind(this, false)}>
                    {
                    <View>
                        <View className='dialog-title-wrap'>
                            {/* <Text className='title'>购买渠道</Text> */}
                            <Image src='http://gold-shop-img.doule.me/images/global/icon-dialog-close.png' className='icon-close-right' onClick={this.setDialog.bind(this, false)} />
                        </View>
                        {/* <View className='divider'></View> */}
                        <View className='dialog-content-wrap'>
                        
                            {/* <View className='food-desc'>
                                <Text className='desc-title'>当前账户余额</Text>
                                <View className='desc-content'>
                                    <View className='text-price'>
                                        <View className='un-price'><Text className='price-symbol'>￥</Text>{(this.state.accountInfo.money || 0).toFixed(2)}</View>
                                    </View>
                                </View>
                            </View> */}
                            
                            <View className='food-desc real-price'>
                                <Text className='desc-title'>需付款</Text>
                                <View className='desc-content'>

                                    <View className='text-price'>
                                        <Text className='price-symbol'>￥</Text>{(this.state.surplusPrice || 0).toFixed(2)}
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View className='global-btn-wrap'>
                            <GlobalBtn text='立即支付' onBtnAction={this.orderSubmit} />
                        </View>
                    </View>
                    }
                </AtFloatLayout>
            </View>
        )
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    gotoCoursePlayPage = (url, hasNext, e) => {
        if (e) e.stopPropagation();
        if (hasNext == true) {
            return;
        }
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }
    
    gotoPlay = (url, index, e) => {
        if (e) e.stopPropagation();
        if (this.state.existBuy == true || index == 0) {
            Taro.navigateTo({
                url: '/pages/' + url
            })
        } else {
            showTextToast('请购买后进行播放');
        }
    }

    setDialog = (status, value, e) => {
      let _vo = {};
      if (status && value) {
        _vo = value
      }

      if (this.state.existBuy == true) {
        showTextToast('您已购买了该课程');
        return;
      }
      if (status == true) {
        let balanceMoeny = (this.state.accountInfo.money || 0);
        let goodsPrice = (this.state.series.salePrice || 0);

        this.setState(prevState => ({
            surplusPrice:goodsPrice,
        }));

        // if (balanceMoeny >= goodsPrice) {
        //     this.setState(prevState => ({
        //         surplusPrice: 0,
        //     }));
        // } else {
            
        //     this.setState(prevState => ({
        //         surplusPrice: goodsPrice - balanceMoeny,
        //     }));
        // }
      }

      this.setState(prevState => ({
          dialogStatus: status,
          dialogVo: _vo
      }));
    }

    handleClick = (value) => {
        this.setState(prevState => ({
            currentTab: value
        }));
    }

    fetchDetail = (id) => {
        if (!id) {
            showTextToast('未找到相关课程');
            return;
        }
        if (this.state.type == 'COURSE') {
            getCourseDetail({ id: id }).then(res => {
                let _showTags = [];
                // if (res.vo.ages && res.vo.ages.length) {
                //     let _ageArrs = [];
                //     res.vo.ages.map(item => {
                //         _ageArrs.push({
                //             type: 'age',
                //             name: item.name
                //         })
                //     });
                //     _showTags = [ ..._ageArrs, ..._showTags ];
                // }
                res.vo['convertShowTags'] = _showTags;

                let _courses = [];
                _courses.push({
                    id: res.vo.id,
                    mediaUrl: res.vo.mediaUrl,
                    name: res.vo.name,
                    time: '',
                })
                res.vo['courses'] = _courses;

                this.setState(prevState => ({
                    series: res.vo,
                    existBuy: res.existBuy
                }));
            });
        } else if (this.state.type == 'COURSE_SERIES') {
            getCourseSeriesDetail({ id: id }).then(res => {
                let _showTags = [];
                // if (res.vo.ages && res.vo.ages.length) {
                //     let _ageArrs = [];
                //     res.vo.ages.map(item => {
                //         _ageArrs.push({
                //             type: 'age',
                //             name: item.name
                //         })
                //     });
                //     _showTags = [ ..._ageArrs, ..._showTags ];
                // }
                res.vo['convertShowTags'] = _showTags;
                this.setState(prevState => ({
                    series: res.vo,
                    existBuy: res.existBuy
                }));
            });
        }
    }

    
  
    orderSubmit = (e) => {
        Taro.showLoading({
            title: '操作中...',
            mask: true
        })
        createOrder({
            cartStr: this.$router.params.id,
            distributionMode: 'YOURSELF',
            orderType: this.state.type == 'COURSE_SERIES' ? 'ONLINE_SERIES_COURSE' : 'ONLINE_COURSE',
            payPlatform: 'WX',
            remark: JSON.stringify({})
        }).then(res => {
            if (res.surplusPrice == 0) {
                showTextToast('购买系列课程成功');
                this.setState(prevState => ({
                    dialogStatus: false
                }));
                this.fetchDetail(this.$router.params.id);
            } else {
                this.genOrderInfo(res.orderId);
            }
        }).catch(() => {
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        })
    }

    genOrderInfo = (orderId) => {
        let _openid = Taro.getStorageSync('member').openid;
        let _params = { openid: _openid, orderId: orderId };

        fetchWxPay(_params).then(res => {
            this.goPay(res.response);
            this.processOrderStatus(orderId);
            this.reqStatusTimer = setInterval(() => {
                this.processOrderStatus(orderId);
            }, 1500);
        }).catch(() => {
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        })
    }

    goPay(payInfo) {
        if (payInfo) {
            Taro.requestPayment({
                timeStamp: payInfo.timeStamp,
                nonceStr: payInfo.nonceStr,
                package: payInfo.package,
                signType: 'MD5',
                paySign: payInfo.paySign,
                success: (res) => {
                    console.log('支付成功. ', res);
                },
                fail: (res) => {
                    if (this.reqStatusTimer) {
                        clearInterval(this.reqStatusTimer);
                    }
                    setTimeout(() => {
                        Taro.hideLoading();
                    }, 1000)
                }
            })
        } else {
            console.log('未获取到订单支付数据.');
            if (this.reqStatusTimer) {
                clearInterval(this.reqStatusTimer);
            }

            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        }
    }

    processOrderStatus = (id) => {
        getOrderDetail({ id: id }).then(res => {
            let _vo = res.vo;
            if (_vo) {
                if (_vo.status == 0) {
                } else if (_vo.status > 0) {
                    if (this.reqStatusTimer) {
                        clearInterval(this.reqStatusTimer);
                    }
                    showTextToast('购买系列课程成功');
                    this.setState(prevState => ({
                        dialogStatus: false
                    }));
                    this.fetchDetail(this.$router.params.id);
                }
            }
        }).then(() => {
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        }).catch(() => {
            showTextToast('购买系列课程失败');
            setTimeout(() => {
                Taro.hideLoading();
            }, 1000)
        })
    }

    fetchAccountInfoDetail = () => {
        getAmountInfo({ }).then(res => {
            this.setState(prevState => ({
                accountInfo: res.vo || {}
            }));
        });
    }

    fetchBannerList = (code, key) => {
      fetchAdvertShowBanners({ code: code }).then(res => {
        let _params = {};
        _params[key] = res.list || [];
        this.setState(prevState => (_params));
      });
    }
  
    jumpWebview = (title, url) => {
      if (!title || !url) return;
      if (url.startsWith('goto')) {
        let _pos = url.indexOf('=');
        if (_pos < 0) {
          showTextToast('未找到链接参数.');
          return;
        }
        let _idStr = url.substring(_pos + 1);
        if (!_idStr) {
          showTextToast('未找到链接参数值.');
          return;
        }
        Taro.navigateTo({
          url: '/pages/goods-detail/index?id=' + _idStr
        })
      } else {
        jump({
            title: title,
            url: url
        });
      }
    }

}
