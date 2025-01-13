import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import {  AtList,AtListItem } from 'taro-ui'

import { showTextToast } from '../../utils/util';
import { fetchAdvertShowBanners } from '../../services/banner';
import { fetchStandardRecommend } from '../../services/standard';
import { fetchKnackRecommend } from '../../services/knack';
import { getCourseRecommend } from '../../services/course';
import { AuthLoginByApplet, memberDetailInfoApi } from '../../services/auth';

import classNames from 'classnames';

import jump from '../../utils/jump';

export default class Index extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
      tabIndex: 0,
      isOpened: false,
      dialogTipStatus: false,
      banners: [],
      ads: [],
      lastNotice: {},
      teams: [],
      categories: [],
      recommends: [],
      standardRecommends:[],
      knackRecommends:[],
      courseRecommends:[],
      userInfo: {},
      show:false,
      // refreshLoading: false,
    }
  }

  componentWillMount () {

    // console.log('$router: ', this.$router);
    // let _scene = this.$router.params.scene || '';
    // if (_scene && (_scene + '').indexOf('invi_') != -1) {
    //   Taro.setStorageSync('shareCode', (_scene + '').replace('invi_', ''));
    // }

    Taro.getSystemInfo({}).then(res => {
      Taro.$navBarMarginTop = res.statusBarHeight || 0
    })
  }

  // onPullDownRefresh () {
  //   this.setState(prevState => ({
  //       showRefresh: true
  //   }), () => {
  //     console.log(1233);
  //     setTimeout(() => {
  //       console.log(1234);
  //       this.setState(prevState => ({
  //         showRefresh: false
  //       }), () => {
  //         console.log(1235);
  //         Taro.stopPullDownRefresh({
  //           success (stopRes) {
  //               console.log('刷新成功');
  //           }
  //         });
  //       });
  //     }, 2000);
  //   });
  // }
  
  componentDidShow () {

    let _member = Taro.getStorageSync('member');
    if (_member && !_member.phone) {
      Taro.reLaunch({
        url: "/packageMy/pages/auth/bind-phone/index"
      });
    }
    this.setState(prevState => ({
        userInfo: _member
    }));

    this.fetchBannerList('A0101', 'banners');
    //this.fetchBannerList('A0102', 'ads');
    this.fetchKnackRecommend();
    this.fetchStandardRecommend();
    //this.fetchCourseRecommend();
    
  }


  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '锦囊',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    // navigationStyle: 'custom',
    // backgroundTextStyle: 'dark',
    // enablePullDownRefresh: true,
    // usingComponents: {
    //   'list': '../../components/list/list'
    // }
  }
  
  // initScroll() {
  //   this.setState(prevState => ({
  //     refreshLoading: true,
  //   }));
  //   setTimeout(() => {
  //     this.setState(prevState => ({
  //       refreshLoading: false,
  //     }));
  //   }, 1000)
  // }

  // loadmore() {
  // }

  render () {
    const topWrapStyle = {
      paddingTop: Taro.$navBarMarginTop + 'px'
    }
    return (
      <View className='home-page'>
        <View className='swiper-wrap'>
          <Swiper
            className='test-h'
            indicatorColor='#c9c9c9'
            indicatorActiveColor='#333'
            circular
            indicatorDots>
            {/* <SwiperItem>
              <View className='demo-text-1'><Image src='http://bookclub-imgs.doule.me/imgs/index/pic-swiper-1.png' mode='widthFix' /></View>
            </SwiperItem> */}
            {
              Array.isArray(this.state.banners) && this.state.banners.map((banner, index) => (
                <SwiperItem key={index}>
                  <View className='demo-text-1' onClick={this.jumpWebview.bind(this, banner.descript, banner.url)}><Image src={banner.adCoverUrl} mode='widthFix' /></View>
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>
        {this.state.show && 
        <View className='btn-wrap'>
          <View className='at-row'>
            {/* <View className='at-col' onClick={this.gotoSubPage.bind(this, 'place-time/index')}> */}
            <View className='at-col'  onClick={this.gotoPage.bind(this, 'standard/index')}>
            {/* <View className='at-col' onClick={this.aa.bind(this)}> */}
              <View>
                {/* TODO 图片 */}
                <Image src='http://zycimg.106tec.com/weapp/standard.png' mode='widthFix' />
              </View>
              <Text className='btn-go-text'>标 准</Text>
            </View>
            <View className='at-col at-col-1'></View>
            <View className='at-col' onClick={this.gotoPage.bind(this, 'knack/index')}>
              <View>
                   {/* TODO 图片 */}
                <Image src='http://zycimg.106tec.com/weapp/knack.png' mode='widthFix' />
              </View>
              <Text className='btn-go-text'>窍 门</Text>
            </View>
            <View className='at-col' onClick={this.gotoSubPage.bind(this, 'shop/list/index')}>
              <View>
                   {/* TODO 图片 */}
                <Image src='http://zycimg.106tec.com/weapp/knack.png' mode='widthFix' />
              </View>
              <Text className='btn-go-text'>商 家</Text>
            </View>
            <View className='at-col' onClick={this.gotoSubPage.bind(this, 'shop/detail/index')}>
              <View>
                   {/* TODO 图片 */}
                <Image src='http://zycimg.106tec.com/weapp/knack.png' mode='widthFix' />
              </View>
              <Text className='btn-go-text'>商 家2</Text>
            </View>
          </View>
        </View>
        }

        { (this.state.ads && this.state.ads.length) && 
          <View className='ads' onClick={this.jumpWebview.bind(this, this.state.ads[0].descript, this.state.ads[0].url)}>
            <Image src={ this.state.ads.length ? this.state.ads[0].adCoverUrl : '' } mode='aspectFill' />
          </View> }


          { (this.state.knackRecommends && this.state.knackRecommends.length) && <View className='content-wrap'>
            <View className='content-title-wrap'>
                 {/* TODO 图片 */}
              <Image src='http://zycimg.106tec.com/weapp/standard.png' mode='widthFix' />
              <Text className='title'>窍门</Text>
              { <Text className='more-dynamic' onClick={this.gotoPage.bind(this, 'knack/index')}>更多</Text> }
            </View>
            <ScrollView className='recommend-scroll' scrollX={true} scrollWithAnimation style="height: 250rpx">
              <View>
                {
                  Array.isArray(this.state.knackRecommends) && this.state.knackRecommends.map((recommend, index) => {
                    return (
                      <View className='content-list'>
                        <View className='lf-wrap' onClick={this.gotoDetailPage.bind(this, recommend.outLink ? recommend.outLink : 'knack/detail/index?id=' + recommend.id + '&type='+recommend.type,'窍门详情')}>
                            <View className='lf-wrap-goods-left'>
                                <Image src={recommend.coverPicUrl} mode='scaleToFill' />
                            </View>
                            <View className='lf-wrap-goods-right'>
                                <Text className='name'>{recommend.name}</Text>
                                <View className="tags">
                                    { 
                                        recommend.convertShowTags && recommend.convertShowTags.map((tag, index) => (
                                            <View className={ classNames('tag',  'green') } key={index} >{tag.name || tag}</View>
                                        ))
                                     }
                                </View>
                                { recommend.author && <View><Text className='author'>作者：{recommend.author}</Text> </View>}
                                { recommend.publishTime && <View><Text className='author'>发布日期：{recommend.publishTime}</Text> </View>}
                            </View>
                          </View>
                        </View>
                    )
                  })
                }
              </View>
              </ScrollView>
          </View> 
        }
        

        { (this.state.standardRecommends && this.state.standardRecommends.length) && <View className='content-wrap'>
          <View className='content-title-wrap'>
               {/* TODO 图片 */}
           <Image src='http://zycimg.106tec.com/weapp/standard.png' mode='widthFix' />
            <Text className='title'>标准</Text>
            { <Text className='more-dynamic' onClick={this.gotoPage.bind(this, 'standard/index')}>更多</Text> }
          </View>
            <View style="text-align:left">
              <AtList hasBorder={false}>
                            {this.state.standardRecommends.map((recommend)=>{
                                return (
                                    <AtListItem hasBorder={true} title={recommend.name} onClick={this.gotoDetailPage.bind(this,  recommend.outLink ? recommend.outLink :'standard/detail/index?id=' + recommend.id , '标准详情')} arrow='right' iconInfo={{ size: 25, color: '#FF4949', value: 'bookmark'}} />  
                                )
                            })}
                        </AtList>
            </View>
        </View> }
        { (this.state.courseRecommends && this.state.courseRecommends.length) && <View className='content-wrap'>
          <View className='content-title-wrap'>
            <Text className='title'>课堂推荐</Text>
            { <Text className='more-dynamic' onClick={this.gotoPage.bind(this, 'online/course/index')}>更多</Text> }
          </View>
          <ScrollView className='recommend-scroll' scrollX={true} scrollWithAnimation style="height: 370rpx">
            <View className='recommend-list3'>
              {
                Array.isArray(this.state.courseRecommends) && this.state.courseRecommends.map((recommend, index) => {
                  return (
                    <View className='recommend-item' key={index} onClick={this.gotoPage.bind(this, 'online/course-detail/index?id=' + recommend.id + '&type='+recommend.type)}>
                      <View className='pic'>
                        <Image src={ recommend.coverPicUrl} mode='scaleToFill' />
                      </View>
                      <View className='infos'>
                        <View className='name'>{recommend.type=='COURSE_SERIES' && <Text className={ classNames('tag',  'green') } >系列</Text>}{recommend.name}</View>
                        <View className='text-price'>
                            {recommend.salePrice>0 && <Text className='price-symbol'>￥</Text>}
                            {recommend.salePrice>0?(recommend.salePrice || 0).toFixed(2):'免费'}
                            <View className='un-price'><Text className='price-symbol'>￥</Text>{(recommend.markPrice || 0).toFixed(2)}</View>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </ScrollView>
        </View> }

        <View style="height: 10px; background: #f4f4f4;"></View>
      </View>
    )
  }
    
  gotoSubPage = (url, e) => {
      if (e) e.stopPropagation();
      Taro.navigateTo({
          url: '/subpages/pages/' + url
      })
  }
 
  gotoMyPage = (url, e) => {
      if (e) e.stopPropagation();
      Taro.navigateTo({
          url: '/packageMy/pages/' + url
      })
  }

  aa = () => {
    Taro.scanCode({}).then(res => {
      let path = decodeURIComponent(res.path);
      Taro.reLaunch({
        url: path
      })
    });
  }

  gotoPage = (url, e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/' + url
    })
  }

  gotoDetailPage = (url,title, e) => {
    e.stopPropagation();
    if(url.startsWith('https')){
      this.jumpWebview(title,url);
    }else{
      Taro.navigateTo({
        url: '/pages/' + url
      })
    }
  }

  // reg = () => {
  //   Taro.login({
  //     success: (res) => {
  //       let _code = res.code;
  //       if (res.code) {
  //         Taro.getUserInfo({
  //           success: (userRes) => {
  //             const iv = userRes.iv;
  //             const encryptedData = userRes.encryptedData;
  //             // 下面开始调用注册接口
  //             Taro.wxApi.register_complex({
  //               code: _code,
  //               encryptedData: encryptedData,
  //               iv: iv
  //             }).then((errRes) => {
  //               // 注册接口返回结果
  //               this.login();
  //             })
  //           }
  //         })
  //       }
  //     }
  //   });
  // }

  fetchBannerList = (code, key) => {
    fetchAdvertShowBanners({ code: code }).then(res => {
      let _params = {};
      _params[key] = res.list || [];
      this.setState(prevState => (_params));
    });
  }

  fetchStandardRecommend = () => {
    fetchStandardRecommend({ group: 0 }).then(res => {
      this.setState(prevState => ({
        standardRecommends: res.list || []
      }));
    });
  }
  fetchKnackRecommend = () => {
    fetchKnackRecommend().then(res => {
      if(res.list){
        res.list.map(item => {
          let _array = [];
          if(item.type == 'KNACK_SERIES'){
              _array.push({
                type: 'series',
                name: '系列'
            });
            
          }
          item["convertShowTags"] =  _array;
        })
      }
      this.setState(prevState => ({
        knackRecommends: res.list || []
      }));
    });
  }
  fetchCourseRecommend = () => {
    getCourseRecommend().then(res => {
      if(res.list){
        res.list.map(item => {
          let _array = [];
          if(item.type == 'COURSE_SERIES'){
              _array.push({
                type: 'series',
                name: '系列'
            });
            
          }
          item["convertShowTags"] =  _array;
        })
      }
      this.setState(prevState => ({
        courseRecommends: res.list || []
      }));
    });
  }
  login = (e) => {
    Taro.login({
      success: (res) => {
        console.log('res: ', res);
        if (res.code) {
          let { nickName, avatarUrl } = e.detail.userInfo;
          AuthLoginByApplet({ code: res.code, nickname: nickName, profile: avatarUrl, platform: 'WX' }).then(wxRes => {
            // debugger;
            // if (wxRes.code == 10000) {
              // this.reg(res.code);
            // } else if (wxRes.code == 0) {
              showTextToast('登录成功');
              Taro.setStorageSync('token', wxRes.token);
              Taro.setStorageSync('member', wxRes.member);
            // } else {
              // showTextToast(wxRes.msg);
            // }
          })
        } else {
          showTextToast('登录失败');
        }
      }
    })
  }

  fetchUserDetail = () => {
    memberDetailInfoApi(Taro.getStorageSync('token')).then(res => {
      this.setState(prevState => ({
        userInfo: res.member
      }));
    })
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
