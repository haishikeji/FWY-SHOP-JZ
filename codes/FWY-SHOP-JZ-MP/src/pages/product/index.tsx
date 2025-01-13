import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, Swiper, SwiperItem, ScrollView,Button } from '@tarojs/components'
import { AtIcon, AtButton,AtSearchBar,AtTabs,AtTabsPane,AtTag,AtDrawer,AtCheckbox} from 'taro-ui'

import { showTextToast } from '../../utils/util';
import { fetchAllShop } from '../../services/business';
import { fetchAdvertShowBanners } from '../../services/banner';
import {fetchLevel1Type,getProductSearch,findLevel2TypeByPid} from '../../services/product';

import jump from '../../utils/jump';
import classNames from 'classnames'

export default class ProductIndex extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
      pageCurr: 1,
      tabIndex: 0,
      banners: [],
      ads: [],
      categories: [],
      subCategories:[],
      userInfo: {},
      dataList:[],
      searchText:"",
      selectedSubType : null,
      current:0,
      display:'',
      loadingShow:'',
      loadingText:'数据加载中',
      selectedType:null,
      drawerShow:false,
      businessList:[],
      brandCheckedList:[]
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
    this.fetchAllShop();
  }


  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '建材服务商城',
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
        <View className='filters-row'>
            <View className="at-row title-row">
                <View className="at-col">材料分类</View>
                <View className="at-col brand-filter" onClick={this.showBrand.bind(this)}>品牌(筛选)</View>
            </View>
            <View className="type-row">
                {
                    Array.isArray(this.state.categories) && this.state.categories.map((item, index) => {
                        return (
                            <View key={index} className={classNames('item', this.state.selectedType == item.id && 'actived')} onClick={this.changeFilter.bind(this, 'selectedType', item.id)}>
                                {item.title}
                            </View>
                        )
                    })
                }
            </View>
            <View>
                <AtDrawer
                show={this.state.drawerShow}
                mask
                right
                width="300px"
                onClose={this.drawerOnClose.bind(this)}
                >
                  <View className='brand-fiter'>
                      <View className='at-row title'>
                          <View className='at-col at-col-8'>
                              <Text>品牌(单选):</Text>
                          </View>
                      </View>
                      <View className='brand-list at-row'>
                          <ScrollView className="scroll-view" scrollY={true} >
                            <View className='brands'>
                                <AtCheckbox
                                    options={this.state.businessList}
                                    selectedList={this.state.brandCheckedList}
                                    onChange={this.handleCheckboxChange.bind(this,'brandCheckedList')}
                                />
                            </View>
                          </ScrollView>
                        </View>
                        <View className="filter-btn-list at-row">
                          <View className="btn at-col "><Button type='primary' openType='getUserInfo' className='no-border'  onClick={this.resetDrawer.bind(this)}>重 置</Button></View>
                          <View className="btn at-col"><Button type='primary' openType='getUserInfo' className='no-border' onClick={this.confirmDrawer.bind(this)}>确 认</Button></View>
                        </View>
                  </View>
                  
                
            </AtDrawer>
            </View>
        </View>
        <View className='content-wrap'>
              <View>
              {
                Array.isArray(this.state.dataList) && this.state.dataList.map((recommend, index) => {
                  return (
                    <View className='content-list'>
                      <View className='lf-wrap' onClick={this.gotoSubPage.bind(this,  'product/detail/index?id=' + recommend.id)}>
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
  changeFilter = (name, val, e) => {
    let _params = {};
    _params[name] = val;
    this.setState(prevState => (_params),()=>{this.getProductSearch(1)});
  }
  fetchAllShop = () => {
    fetchAllShop().then(res => {
      let data = res.list || []
      let dataArray = data.map((item)=>{
        let json = {}
        json.label = item.name
        json.value = item.id
        return json
      })
      this.setState(prevState => ({
        businessList: dataArray
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
  fetchAllTypes = () => {
    fetchLevel1Type().then(res => {
      this.setState(prevState => ({
        categories: res.list || [],
      }),()=>{
        this.getProductSearch(1)
      });
    });
  }
  getProductSearch = (page) => {
    Taro.showLoading({
      title: 'loading',
      mask:true
    })
    let selectedType = this.state.selectedType || ''

    let busiIds = this.state.brandCheckedList.join(",")
    getProductSearch({parentType:selectedType,busiIds:busiIds,pageNum:page}).then(res => {
      Taro.hideLoading()
      this.setState({
        loadingShow:'display:none',
        loadingText:'数据加载中'
      })
      let data  = res.list || []
      if(data.length === 0){
        if(page === 1 ){
          this.setState({
            dataList: data
          })
        }
        this.setState({
          loadingShow:'display:block',
          loadingText: page==1?'暂无数据':'我是有底线的~~~'
        })
        Taro.showToast({
          title: '没有更多数据了！',
          icon:"none"
        })
        data = [{noData:"暂无数据"}]
      }else{
        if(page === 1 ){
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

    this.getProductSearch(this.state.pageCurr+1);
  }
  onSearchBarChange (value) {
    this.setState({
      searchText: value
    })
  }
  showBrand = () => {
    this.setState(prevState => ({
      drawerShow: !prevState.prevState,
    }));
  }
  drawerOnClose = () => {
    this.setState(prevState => ({
      drawerShow: false
    }));
  }
  handleCheckboxChange = (name, value) => {
    var params = {};
    params[name] = value;
    console.log(value)
    this.setState(params);
    return value;
  }
  confirmDrawer = () => {
    this.setState(prevState => ({
      drawerShow: false
    }));
      this.getProductSearch(1)
  }
  resetDrawer = () => {
    this.setState(prevState => ({
      brandCheckedList: []
    }));
  }
  onActionClick () {
    this.setState(prevState => ({
      pageCurr: 0
    }),()=>{
      this.getProductSearch(this.state.current);
    });
  }
  onSelectSubType (item) {
    this.setState({
      selectedSubType:item.name,
      pageCurr:0
    },()=>{
      this.getProductSearch(this.state.current)
    })
  }
  onPullDownRefresh(){
    this.setState({
      display:'display:block'
    })
    setTimeout(() => {
      // 请求数据，并渲染
      this.getProductSearch(this.state.current)
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
