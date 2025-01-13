import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, Swiper, SwiperItem, ScrollView } from '@tarojs/components'
import { AtIcon, AtButton,AtSearchBar,AtTabs,AtTabsPane,AtTag,AtActivityIndicator} from 'taro-ui'

import { showTextToast } from '../../../../utils/util';
import { fetchAdvertShowBanners } from '../../../../services/banner';
import {getBuildType,getCaseinfoSearch} from '../../../../services/caseinfo';

import jump from '../../../../utils/jump';

export default class AdultIndex extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
      pageCurr: 0,
      banners: [],
      ads: [],
      categories: [],
      userInfo: {},
      dataList:[],
      searchText:"",
      current:0,
      display:'',
      loadingShow:'',
      loadingText:'数据加载中',
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
    this.fetchAllTypes();
  }


  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '案例',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    const topWrapStyle = {
      paddingTop: Taro.$navBarMarginTop + 'px'
    }
    return (
      <View className='adult-index-page'>
        <View>
          <AtSearchBar value={this.state.searchText} actionName='搜一搜' onChange={this.onSearchBarChange.bind(this)}
            onActionClick={this.onActionClick.bind(this)} />
        </View>
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
                </SwiperItem>
              ))
            }
          </Swiper>
        </View>
        <View className='at-index-content'>
            <AtTabs
              current={this.state.current}
              scroll
              tabList={this.state.categories}
              onClick={this.handleClick.bind(this)}>

              {
                this.state.categories && this.state.categories.map((item,index) => {
                  return (
                    <AtTabsPane current={this.state.current} index={index} key={item.id}>
                        <View className='content-wrap'>
                              <View  className='card-list'>
                              {
                                Array.isArray(this.state.dataList) && this.state.dataList.map((recommend, index) => {
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
                                            <View className='title-name'>{recommend.businessName}</View>
                                            <View className='title-address'>{recommend.fuwuCitys}</View>
                                        </View>
                                        <View className='pic-row'><Image src={recommend.coverPicUrl}></Image></View>
                                        <View className='desc-row'>
                                            <View className='desc-info'>【案例】{recommend.projectName}</View>
                                            <View className='like-num'></View>
                                        </View>
                                        <View className='footer-row'>
                                            <View className='tags'>
                                                <View className='tag'>{recommend.buildType}</View>
                                            </View>
                                            <View className='publish-time'>{recommend.buildDate}</View>
                                        </View>
                                    </View>
                                  )
                                })
                              }
                            </View>  
                        </View>
                    </AtTabsPane>
                  )
                })
              }  
            </AtTabs>
        </View>
        <View className='at-downDragBox' style={this.state.loadingShow}>
          <View className='at-row' >
            {/* <AtActivityIndicator className='at-col at-col-6'></AtActivityIndicator> */}
            <Text className='downText at-col at-col-6'>{this.state.loadingText}</Text>
          </View>
        </View>
      </View>
    )
  }
  handleClick (value) {
    this.setState({
      current: value,
      dataList:[],
      pageCurr: 0
    },()=>{
      this.getCaseinfoSearch(value)
    })
  }
  gotoSubPage = (url, e) => {
    if (e) e.stopPropagation();
    Taro.navigateTo({
      url: '/subpages/pages/' + url
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
  fetchAllTypes = () => {
    getBuildType().then(res => {
      this.setState(prevState => ({
        categories: res.list || [],
      }),()=>{
        this.getCaseinfoSearch(0)
      });
    });
  }
  getCaseinfoSearch = (tabIndex) => {
    Taro.showLoading({
      title: 'loading',
      mask:true
    })
    
    let page = this.state.pageCurr + 1
    let tabList = this.state.categories
    let tabVlue = tabList.length == 0? '':tabList[tabIndex].id||''
    let searchText = this.state.searchText
    getCaseinfoSearch({buildType:tabVlue,name:searchText,pageNum:page}).then(res => {
      Taro.hideLoading()
      this.setState({
        loadingShow:'display:none',
        loadingText:'数据加载中'
      })
      let data  = res.list || []
      if(data.length === 0){
        this.setState({
          loadingShow:'display:block',
          loadingText: this.state.pageCurr==0?'暂无数据':'我是有底线的~~~'
        })
        Taro.showToast({
          title: '没有更多数据了！',
          icon:"none"
        })
        data = [{noData:"暂无数据"}]
      }else{
        if(this.state.pageCurr === 0 ){
          this.setState({
            dataList: data,
            pageCurr: page
          })
        }else{
          this.setState({
            dataList: [...this.state.dataList,...data],
            pageCurr: page
          })
        }
       
      }
     
    });
  }
  onReachBottom() {
    this.getCaseinfoSearch(this.state.current);
  }
  onSearchBarChange (value) {
    this.setState({
      searchText: value
    })
  }
  onActionClick () {
    this.setState(prevState => ({
      pageCurr: 0
    }),()=>{
      this.getCaseinfoSearch(this.state.current);
    });
  }
  onPullDownRefresh(){
    this.setState({
      display:'display:block'
    })
    setTimeout(() => {
      // 请求数据，并渲染
      this.getCaseinfoSearch(this.state.current)
      // 数据成功后，停止下拉刷新
      Taro.stopPullDownRefresh();
    }, 1000);
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
