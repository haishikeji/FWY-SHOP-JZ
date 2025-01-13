import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text ,Swiper,SwiperItem} from '@tarojs/components'

import { AtRate,AtIcon,AtList,AtListItem} from 'taro-ui'

import { getProductDetail,findReportList,getReportDetail} from '../../../../services/product';
import { fetchAdvertShowBanners } from '../../../../services/banner';

import { saveLookLog} from '../../../../services/common';

import { getCollectionExistRef, execCollectionSaveRef, execCollectionDelRef } from '../../../../services/collect';

import { showTextToast } from '../../../../utils/util';

import classNames from 'classnames';

import 'taro-parse/dist/style/main.scss'
import TaroParser from 'taro-parse'

import jump from '../../../../utils/jump';

export default class BookDetailPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            selectedType: '',
            row2Show: false,
            tabTitles: [
                { id: 0, title: '介绍' },
                // { id: 1, title: '借阅须知' }
            ],
            currentTab: 0,
            vo: {},
            fileUrls:[],
            voExist: false,
            attention: '',
            banners:[{url:'http://bookclub-imgs.doule.me/users/99/20200917/6e94f78fe3c94312bc91dbfae0d8858e.jpg'},
            {url:'http://bookclub-imgs.doule.me/users/99/20200917/6e94f78fe3c94312bc91dbfae0d8858e.jpg'}],

            playTime: 0,
            timeLenght: null,
            lyrics: [],
            myAudio: {},
            isPlay: false,
            masterPicUrl:[],
            shop:{},
            reportList:[],
            caseList:[],
            
            ads: [],
            userInfo:{},
            showPhone:false,
            callPhoneShow:false
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.setState(prevState => ({
            userInfo: Taro.getStorageSync('member')
        }));
        console.log(this.$router.params.id)
        this.fetchDetail(this.$router.params.id);
        //this.fetchBannerList('A0106', 'ads');
    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '材料详情',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='book-detail-page'>
                <View className='swiper-wrap'>
                    <Swiper
                        className='test-h'
                        indicatorColor='#c9c9c9'
                        indicatorActiveColor='#333'
                        circular
                        indicatorDots>
                        {
                        Array.isArray(this.state.masterPicUrl) && this.state.masterPicUrl.map((banner, index) => (
                            <SwiperItem key={index}>
                            <View className='demo-text-1'><Image src={banner} mode='widthFix' /></View>
                            </SwiperItem>
                        ))
                        }
                    </Swiper>
                </View>
                <View className='at-product-description'>
                    <View className='at-article__h2 at-product-title'>
                        {this.state.vo.productName}

                    { !this.state.voExist &&  <AtIcon value='star' size='20' color='#666' onClick={this.handleCollect.bind(this, this.state.vo.id)}></AtIcon> }
                    { this.state.voExist && <AtIcon value='star-2' size='20' color='#59ecc3' onClick={this.handleCollect.bind(this, this.state.vo.id)}></AtIcon>}
                        
                    </View>
                    <View className='at-article__p'>{this.state.vo.subCategoryName || this.state.vo.productCategoryName || ''}</View>
                    
                    <View className='at-product-info,content-wrap,at-desc'>
                        <View className='at-row at-row--wrap'>
                            <View className='at-col at-col-6'>
                                <View className='at-article__info'>
                                    品牌：{this.state.vo.brand}
                                </View>
                            </View>
                            <View className='at-col at-col-6'>
                                <View className='at-article__info'>
                                    上市时间：{this.state.vo.marketTime}
                                </View>
                            </View>
                            <View className='at-col at-col-6'>
                                <View className='at-article__info'>
                                    产地：{this.state.vo.chandi}
                                </View>
                            </View>
                            
                        </View>
                        </View>

                    <View className='at-article__p,at-desc'>{this.state.vo.productDesc || ''}</View>
                </View>
                {this.state.reportList && <View className='at-article bg-white'>
                        <View className='doc-body'>
                            <View className='panel__title'>检测报告</View>
                        </View>
                        <View className='content-list'>
                        <AtList hasBorder={false}>
                            {this.state.reportList.map((item)=>{
                                return (
                                    <AtListItem hasBorder={false} title={item.reportName} onClick={this.getReportDetail.bind(this,item.id)} arrow='right' iconInfo={{ size: 25, color: '#FF4949', value: 'bookmark'}} />  
                                )
                            })}
                        </AtList>
                        </View>
                    </View>
                }
                

                <View className='at-article bg-white'>
                    <View className='doc-body'>
                        <View className='panel__title'>商家</View>
                    </View>
                    <View className='content-list'>
                        <View className='lf-wrap'>
                        <View className='lf-wrap-goods-left'>
                            <Image src={this.state.shop.logo} mode='scaleToFill' />
                        </View>
                        <View className='lf-wrap-goods-right'>
                        <Text className='name'>{this.state.shop.name}</Text>
                            <View className='if-margin'><AtRate size={10} value={4} max={4} /></View>
                            <View className="tags">
                                    <View className= 'tag,green'  >{this.state.shop.fuwuCitys}</View>
                            </View>
                            <View className='if-margin'> 
                                <AtIcon value='phone' size='14' color='#59ecc3'></AtIcon>
                                <Text className='author'>{this.state.showPhone ? this.state.shop.contactPhone : this.state.shop.entryContactPhone}</Text>
                                {!this.state.showPhone && <View className="viewPhone" onClick={this.saveLookLog.bind(this, this.state.shop.id)}>点击查看联系方式</View>}
                                {this.state.callPhoneShow && <View className="viewPhone" onClick={this.makePhoneCall.bind(this, this.state.shop.contactPhone)}>点击呼叫</View>}
                                
                            </View>
                        </View>
                        </View>
                    </View>
                </View>
                {/* { this.state.vo.mediaUrl &&  <View className='at-article bg-white'>
                    <View className='doc-body'> 
                    <View className='panel__title'>产品视频</View>
                    </View>
                    <View className='at-play-video'>
                    <Video  className='at-video-item' id="myVideo" autoplay={false} src={this.state.vo.mediaUrl} enable-danmu danmu-btn controls></Video>
                    </View>
                </View>} */}
               
                <View className='at-article bg-white'>
                    <View className='doc-body'>
                        <View className='panel__title'>材料详情</View>
                    </View>
                    <View className='at-product-info,content-wrap'>
                        <View className={ classNames('content', 'real-content') }>
                        { 
                            this.state.vo.content && <TaroParser
                                type='markdown'
                                theme='light'
                                onLoaded={() => {
                                    console.log(1234);
                                    Taro.hideLoading()
                                }}
                                content={this.state.vo.content}
                            />
                        }
                        </View>
                    </View>
                </View>

                {this.state.caseList && 
                    <View className='at-article bg-white'>
                        <View className='doc-body'>
                            <View className='panel__title'>相关案例</View>
                        </View>
                        <View className="pic-list">
                            {this.state.caseList.map((item)=>{
                                return(
                                <View className='at-row at-row--wrap flex-layout' onClick={this.gotoSubPage.bind(this,'case/detail/index?id=' + item.id)}>
                                    <View className='at-col at-col-6 pic-item'>
                                        <Image src={item.coverPicUrl} mode="widthFix" />
                                        <View className="name">{item.projectName}</View>
                                        <View className="infos">
                                            <View className="tags">
                                                <View className="tag">{item.buildType}</View>
                                            </View>
                                            {/* <View className="like">6</View> */}
                                        </View>
                                    </View>
                                </View>
                                )
                            })}
                            
                        </View>
                    </View>
                }
               

            </View>
        )
    }

    gotoPage = (url, e) => {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }
    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
          url: '/subpages/pages/' + url
        })
      }
    handleClick = (value) => {
        this.setState(prevState => ({
            currentTab: value
        }));
    }
    formatPhone = (name) => {
        let newStr;
     if (name.length > 6) {
            let char = '';
            for (let i = 0, len = name.length - 6; i < len; i++) {
                char += '*';
            }
            newStr = name.substr(0, 3) + char + name.substr(-3, 3);
        } else {
            newStr = name;
        }

        return newStr;
    }

    fetchDetail = (id) => {
        if (!id) {
            showTextToast('未找到相关信息');
            return;
        }
        getProductDetail({ id: id }).then(res => {
            let _picUrls = []
            if (res.vo.masterPicUrl) {
                _picUrls = res.vo.masterPicUrl.split(',')
            }
            if (res && res.shop) {
                res.shop.entryContactPhone = this.formatPhone(res.shop.contactPhone)
            }
            this.setState(prevState => ({
                vo: res.vo,
                shop: res.shop || {},
                masterPicUrl:_picUrls,
                caseList:res.vo.caseList
            }));
            
            this.fetchCollectionExistRef(id);
            this.fetchReportList(id);
            if (res.vo.audioDescUrl) {
                const bgMusic = Taro.getBackgroundAudioManager();
                this.setState({
                    myAudio: bgMusic,
                    isPlay: true
                });
                bgMusic.src = res.vo.audioDescUrl;
                bgMusic.title = res.vo.name;
                bgMusic.onTimeUpdate(() => {
                    this.setState({
                        timeLenght: bgMusic.duration,
                        playTime: bgMusic.currentTime
                    })
                })
                bgMusic.onError(() => {
                    showTextToast('播放错误');
                })
            }
        });
    }
    saveLookLog = (id)=>{
        let _type = 'BUSINESS_PHONE';
        saveLookLog({ type: _type, refPk: id}).then(res => {
            this.setState({
                showPhone: true
            })
            if(this.state.shop.contactPhone ){
                this.setState({
                    callPhoneShow: true
                })
            }
        });
    }
    makePhoneCall = (phone)=>{
        let _type = 'CALL_BUSINESS_PHONE'
        Taro.makePhoneCall({
            phoneNumber: phone, //仅为示例，并非真实的电话号码
            success:()=>{
                saveLookLog({ type: _type, refPk: this.state.shop.id}).then(res => {
                    
                });
            }
          })
    }
    fetchCollectionExistRef = (id) => {
        let _type = 'PRODUCT';
        getCollectionExistRef({ type: _type, refPk: id , noJump: true }).then(res => {
            this.setState({
                voExist: res.exist
            })
        });
    }
    fetchReportList = (id) => {
        findReportList({ productId: id }).then(res => {
            this.setState({
                reportList: res.list || []
            })  
        });
    }
    getReportDetail = (id) => {
        getReportDetail({ id: id }).then(res => {
            if (res.vo) {
                let imgList = res.vo.reportPicUrl.split(",");
                Taro.previewImage({urls:imgList}).then(()=>{})
            }else{
                showTextToast("查看报告失败");
            }
        });
        
    }
    handleCollect = (id) => {
        if (!id) {
            return;
        }
        let _type = 'PRODUCT';
        if (this.state.voExist) {
            execCollectionDelRef({ type: _type, refPk: id , }).then((res) => {
                this.fetchCollectionExistRef(id);
                showTextToast("取消收藏成功");
            });
        } else {
            execCollectionSaveRef({ type: _type, refPk: id }).then((res) => {
                this.fetchCollectionExistRef(id);
                showTextToast("收藏成功");
            });
        }
    }

    previewFile = (_url) => {
        this.jumpWebview("文件查看",_url);
        // Taro.downloadFile({
        //     url: _url,
        //     success: function (res) {
        //       var filePath = res.tempFilePath
        //       Taro.openDocument({
        //         filePath: filePath,
        //         success: function (res) {
        //           console.log('打开文档成功')
        //         }
        //       })
        //     }
        //   })
    }
    
    format(time) {
        let minutes = (time / 60) | 0   // |是向下取正
        let  seconds = time % 60 | 0
        if (seconds<10) {
            seconds = '0' + seconds
        }
        return minutes + ':' + seconds 
    }

    conversion(time) {
        let minutes = (time / 60) | 0   // |是向下取正
        let seconds = time % 60 | 0
        if (minutes<10) {
            minutes = '0' + minutes
        }
        if (seconds<10) {
            seconds = '0' + seconds
        }
        return minutes + ':' + seconds 
    }
    
    sliderChange(e) {
        this.state.myAudio.seek(e.value)
        this.getPlayLyrics(e.value)
    }
    
    getPlayLyrics(time) { 
        var playTime1 = this.conversion(time);
        for (var j = 0; j < this.state.lyrics.length; j++) { 
            if (this.state.lyrics[j].time == playTime1) {
                return this.state.lyrics[j].content
            }
        }
    }

    play() {
        if (this.state.isPlay) {
            this.setState({
                isPlay: false,
            })
            this.state.myAudio.pause()
        } else if (!this.state.isPlay) { 
            this.setState({
                isPlay: true
            })
            this.state.myAudio.play()
        }
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
