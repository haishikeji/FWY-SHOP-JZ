import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { AtIcon, AtSearchBar } from 'taro-ui'
import { fetchExhibitionList } from '../../services/exhibition'
import { fetchAdvertShowBanners } from '../../services/banner'

import iconBackPng from '../../assets/images/global/icon-back.png'
import iconMapPng from '../../assets/images/global/icon-map.png'

const debounce = (func, wait,immediate) => {
    let timeout
    return function (...args) {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            timeout = null
            if (!immediate) func.apply(this, args)
        }, wait)
        if (immediate && !timeout) func.apply(this, [...args])
    }
}

export default class MorePage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            banners: [],
            dataList: [],
            keyword: '',
        }
    }

    componentWillMount() {
        if (this.$router.params.title) {
            Taro.setNavigationBarTitle({
                title: this.$router.params.title 
            })
        }
    }

    componentDidShow() {
        this.fetchBannerList('B0101', 'banners');
        this.fetchList();
    }
  
    fetchList = (value = this.state.keyword) => {
        fetchExhibitionList({ selectStr: value }).then(res => {
            this.setState(prevState => ({
                dataList: res.list || []
            }));
            this.fetchMyLocation(res.list);
        });
    }

    fetchBannerList = (code, key) => {
      fetchAdvertShowBanners({ code: code }).then(res => {
        let _params = {};
        _params[key] = res.list || [];
        this.setState(prevState => (_params));
      });
    }
  
    fetchMyLocation = (list) => {
        Taro.getLocation({
            type: 'gcj02',
            success: (res) => {
              this.setState(prevState => ({
                selfLocation: {
                    latitude: res.latitude,
                    longitude: res.longitude
                }
              }));
              list.map(l => {
                  l.distance = this.getDistance(res.latitude, res.longitude, l.latitude, l.longitude)
              })
            }
          })
    }

    Rad(d) { 
        //根据经纬度判断距离
        return d * Math.PI / 180.0;
    }
    
    getDistance(lat1, lng1, lat2, lng2) {
        // lat1用户的纬度
        // lng1用户的经度
        // lat2商家的纬度
        // lng2商家的经度
        var radLat1 = this.Rad(lat1);
        var radLat2 = this.Rad(lat2);
        var a = radLat1 - radLat2;
        var b = this.Rad(lng1) - this.Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;
        let kms = Math.round(s * 10000) / 10000;
        s = kms.toFixed(1) + 'km' //保留两位小数
        if (kms < 1) {
            s = kms * 1000 + 'm'
        }
        return s
    }

    gotoPage = (url, e) => {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    gotoTabPage = (url, e) => {
        e.stopPropagation();
        Taro.switchTab({
            url: '/pages/' + url
        })
    }

    handleChange(value) {
        console.log(333, value)
        this.setState({
            keyword: value,
        })
        this.fetchList(value)
        // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
        return value
      }
    
      handleClear(value) {
        this.setState({
            keyword: '',
        })
      }

    config: Config = {
        navigationBarTitleText: '展厅',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
        navigationStyle: 'custom',
    }

    render() {
        const topWrapStyle = {
          paddingTop: Taro.$navBarMarginTop + 'px'
        }
        return (
            <View className='exhibition-page'>
                <View className='top-wrap' style={topWrapStyle}>
                    <View className='search-wrap'>
                        <View className='search-left'>
                            <Image className='top-notice' src={iconBackPng} mode='widthFix' onClick={this.gotoTabPage.bind(this, 'map/index')} />
                        </View>
                        <View className='search-center'>
                            <View className='search-ipt'>
                            {/* <View className='search-ipt'> */}
                                {/* <AtIcon value='search' size='14' color='#999'></AtIcon>小猪佩奇 */}
                                
                                <AtSearchBar
                                    placeholder='请输入搜索关键字'
                                    value={this.state.keyword}
                                    onChange={this.handleChange.bind(this)}
                                    onClear={this.handleClear.bind(this)}
                                />
                            </View>
                        </View>
                        <View className='search-right'>
                            <Image className='top-notice' src={iconMapPng} mode='widthFix' onClick={this.gotoTabPage.bind(this, 'map/index')} />
                        </View>
                    </View>
                </View>

                <View className='swiper-wrap'>
                    <Swiper
                        className='test-h'
                        indicatorColor='#c9c9c9'
                        indicatorActiveColor='#333'
                        autoplay
                        circular
                        indicatorDots>
                        {/* <SwiperItem>
                        <View className='demo-text-1'><Image src='http://bookclub-imgs.doule.me/imgs/index/pic-swiper-1.png' mode='widthFix' /></View>
                        </SwiperItem> */}
                        {
                        Array.isArray(this.state.banners) && this.state.banners.map((banner, index) => (
                            <SwiperItem key={index}>
                            <View className='demo-text-1'><Image src={banner.adCoverUrl} mode='widthFix' /></View>
                            {/* <View onClick={this.jumpWebview.bind(this, '买金网', banner.url)}><Image className='banner-img' src={banner.link} /></View> */}
                            </SwiperItem>
                        ))
                        }
                    </Swiper>
                </View>
                
                <View className="content-list">
                    {
                        Array.isArray(this.state.dataList) && this.state.dataList.map((item, index) => (
                            <View className="list-item" onClick={this.gotoPage.bind(this, 'exhibition-detail/index?id=' + item.id)}>
                                <View className="left-img">
                                    <Image src={ item.chartAddress } mode='widthFix' />
                                </View>
                                <View className="right-infos">
                                    <View className="title-field">{ item.exhibitionHallName }</View>
                                    <View className="other-field" style="color: #ff6b14">{ item.address }</View>
                                    <View className="other-field">{ item.distance }</View>
                                    <View className="other-field" style="color: #ff6b14">{ item.productionLabel }</View>
                                    <View className="other-field">营业时间：{ item.startTime } - { item.endTime }</View>
                                    {/* <View className="other-field">{ item.businessAbbreviation }</View> */}
                                </View>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

}
