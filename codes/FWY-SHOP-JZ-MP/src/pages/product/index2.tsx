import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { AtIcon, AtButton } from 'taro-ui'

import { showTextToast } from '../../utils/util';
import { fetchAdvertShowBanners } from '../../services/banner';
import { getProductRecommend } from '../../services/product';
import { getCaseinfoRecommend } from '../../services/caseinfo';

import jump from '../../utils/jump';

export default class ProductIndex extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
      tabIndex: 0,
      isOpened: false,
      dialogTipStatus: false,
      banners: [],
      ads: [],
      lastNotice: {},
      userInfo: {},
      recommends:[],
      caseInfoRecommends:[]
    }
  }

  componentWillMount () {
  }

  
  componentDidShow () {
    this.setState(prevState => ({
        userInfo: Taro.getStorageSync('member')
    }));
    this.fetchBannerList('B0101', 'banners');
    this.fetchBannerList('B0102', 'ads');
    this.fetchRecommends();
    this.fetchCaseInfoRecommends();
  }


  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '产品|案例',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    const topWrapStyle = {
      paddingTop: Taro.$navBarMarginTop + 'px'
    }
    return (
      <View className='adult-index-page'>

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
                  <View className='demo-text-1' onClick={this.jumpWebview.bind(this, '建材服务商城', banner.url)}><Image src={banner.adCoverUrl} mode='widthFix' /></View>
                  {/* <View onClick={this.jumpWebview.bind(this, '买金网', banner.url)}><Image className='banner-img' src={banner.link} /></View> */}
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>
        
        <View className='btn-wrap'>
          <View className='at-row'>
            <View className='at-col' onClick={this.gotoSubPage.bind(this, 'product/list/index')}>
              <View>
                <Image src='http://elder-app-imgs.doule.me/images/index/icon-school-desc1.png' mode='widthFix' />
              </View>
              <Text className='btn-go-text'>产品</Text>
            </View>
            <View className='at-col at-col-1'></View>
            <View className='at-col' onClick={this.gotoSubPage.bind(this, 'case/list/index')}>
              <View>
                <Image src='http://elder-app-imgs.doule.me/images/index/icon-school-type1.png' mode='widthFix' />
              </View>
              <Text className='btn-go-text'>案例</Text>
            </View>
            <View className='at-col at-col-1'></View>
          </View>
        </View>
        
        {/* <View className='ads'><Image src={ this.state.ads.length ? this.state.ads[0].adCoverUrl : '' } mode='widthFix' /></View> */}
        
        { (this.state.ads && this.state.ads.length) && 
          <View className='ads' onClick={this.jumpWebview.bind(this, this.state.ads[0].descript, this.state.ads[0].url)}>
            <Image src={ this.state.ads.length ? this.state.ads[0].adCoverUrl : '' } mode='aspectFill' />
          </View> }

        {/* <View style="height: 10px; background: #f4f4f4;"></View> */}

        { (this.state.recommends && this.state.recommends.length > 0) && <View className='content-wrap'>
            <View className='content-title-wrap'>
              <Text className='title'>产品推荐</Text>
              { <Text className='more-dynamic' onClick={this.gotoSubPage.bind(this, 'product/list/index')}>更多</Text> }
            </View>
            <ScrollView className='recommend-scroll' scrollX={true} scrollWithAnimation style="height: 250rpx">
              <View>
                {
                  Array.isArray(this.state.recommends) && this.state.recommends.map((recommend, index) => {
                    return (
                      <View className='content-list'>
                        <View className='lf-wrap' onClick={this.gotoSubPage.bind(this,'product/detail/index?id=' + recommend.id)}>
                            <View className='lf-wrap-goods-left'>
                                <Image src={recommend.coverPicUrl} mode='scaleToFill' />
                            </View>
                            <View className='lf-wrap-goods-right'>
                                <Text className='name'>{recommend.productName}</Text>
                                <View className="tags">
                                      <View className= 'tag,green'  >{recommend.brand}</View>
                                </View>
                                { recommend.chandi && <View><Text className='author'>产地：{recommend.chandi}</Text> </View>}
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

        { this.state.caseInfoRecommends.length > 0 && 
          <View className='card-list'>
            <View className='content-title-wrap'>
              <Text className='title'>案例推荐</Text>
              { <Text className='more-dynamic' onClick={this.gotoSubPage.bind(this, 'case/list/index')}>更多</Text> }
            </View>
            <ScrollView className='recommend-scroll' scrollX={true} scrollWithAnimation style="height:284px">
                {this.state.caseInfoRecommends.map((recommend, index) => {
                    return (
                        <View className='card-item' onClick={this.gotoSubPage.bind(this,'case/detail/index?id=' + recommend.id)}>
                          <View className='title-row'>
                              <View className='title-avatar'>
                                  <Image src={recommend.busiLogo} mode="scaleToFill"></Image>
                              </View>
                              {/* <View className='title-shop'>
                                  <View className='vip'>
                                      厂家旗舰店
                                  </View>
                              </View> */}
                              <View className='title-name'>
                                  {recommend.businessName}
                              </View>
                              <View className='title-address'>
                                  {recommend.fuwuCitys}
                              </View>
                          </View>
                          <View className='pic-row'>
                              <Image src={recommend.coverPicUrl}></Image>
                          </View>
                          <View className='desc-row'>
                              <View className='desc-info'>
                                  【案例】{recommend.projectName}
                              </View>
                              <View className='like-num'>
                                  
                              </View>
                          </View>
                          <View className='footer-row'>
                              <View className='tags'>
                                  <View className='tag'>
                                      {recommend.buildType}
                                  </View>
                              </View>
                              <View className='publish-time'>
                                  {recommend.buildDate}
                              </View>
                          </View>
                      </View>
                    )
                })
                
                }
                
            </ScrollView>
          </View>
        }
        
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
          url: '/packageMy/pages/' + url + '?type=ADULT_BUY'
      })
  }

  gotoPage = (url, e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/' + url
    })
  }

  fetchBannerList = (code, key) => {
    fetchAdvertShowBanners({ code: code }).then(res => {
      let _params = {};
      _params[key] = res.list || [];
      this.setState(prevState => (_params));
    });
  }

  fetchRecommends = () => {
      getProductRecommend().then(res => {
      this.setState(prevState => ({
        recommends: res.list || []
      }));
    });
  }
  fetchCaseInfoRecommends = () => {
    getCaseinfoRecommend().then(res => {
    this.setState(prevState => ({
      caseInfoRecommends: res.list || []
    }));
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
