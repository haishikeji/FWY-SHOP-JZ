import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text ,Swiper,SwiperItem} from '@tarojs/components'

import { AtRate, AtTabs, AtSlider,AtAvatar,AtIcon} from 'taro-ui'

import { getCaseinfoDetail } from '../../../../services/caseinfo';
import { fetchAdvertShowBanners } from '../../../../services/banner';

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
            playTime: 0,
            timeLenght: null,
            lyrics: [],
            myAudio: {},
            isPlay: false,
            masterPicUrl:[],
            shop:{},
            ads: [],
            userInfo:{},
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.setState(prevState => ({
            userInfo: Taro.getStorageSync('member')
        }));
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
        navigationBarTitleText: '案例详情',
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
                        {this.state.vo.projectName}

                    { !this.state.voExist &&  <AtIcon value='star' size='20' color='#666' onClick={this.handleCollect.bind(this, this.state.vo.id)}></AtIcon> }
                    { this.state.voExist && <AtIcon value='star-2' size='20' color='#59ecc3' onClick={this.handleCollect.bind(this, this.state.vo.id)}></AtIcon>}
                        
                    </View>
                    <View className='at-article__p'>{this.state.vo.subCategoryName || this.state.vo.productCategoryName || ''}</View>
                    
                    <View className='at-product-info,content-wrap,at-desc'>
                        <View>
                            <View>
                                <View className='at-article__info'>
                                    项目地址：{this.state.vo.projectAddr}
                                </View>
                            </View>
                            <View >
                                <View className='at-article__info'>
                                    建设性质：{this.state.vo.buildType}
                                </View>
                            </View>
                            <View>
                                <View className='at-article__info'>
                                    建筑面积：{this.state.vo.usedMianji}
                                </View>
                            </View>
                            <View>
                                <View className='at-article__info'>
                                    设计单位：{this.state.vo.designDanwei}
                                </View>
                            </View>
                            <View>
                                <View className='at-article__info'>
                                    建设单位：{this.state.vo.buildDanwei}
                                </View>
                            </View>
                            <View>
                                <View className='at-article__info'>
                                    完工日期：{this.state.vo.buildDate}
                                </View>
                            </View>
                            
                        </View>
                        </View>
                </View>
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
                            <View className='if-margin'> <AtIcon value='phone' size='14' color='#59ecc3'></AtIcon><Text className='author'>{this.state.shop.contactPhone}</Text> </View>
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
                        <View className='panel__title'>案例详情</View>
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
               

            </View>
        )
    }

    gotoPage = (url, e) => {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    handleClick = (value) => {
        this.setState(prevState => ({
            currentTab: value
        }));
    }
    

    fetchDetail = (id) => {
        if (!id) {
            showTextToast('未找到相关信息');
            return;
        }
        getCaseinfoDetail({ id: id }).then(res => {
            let _picUrls = []
            if (res.vo.masterPicUrl) {
                _picUrls = res.vo.masterPicUrl.split(',')
            }
            this.setState(prevState => ({
                vo: res.vo,
                shop: res.shop || {},
                masterPicUrl:_picUrls
            }));
           
            this.fetchCollectionExistRef(id);

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

    fetchCollectionExistRef = (id) => {
        let _type = 'CASEINFO';
        getCollectionExistRef({ type: _type, refPk: id , noJump: true }).then(res => {
            this.setState({
                voExist: res.exist
            })
        });
    }

    handleCollect = (id) => {
        if (!id) {
            return;
        }
        let _type = 'CASEINFO';
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
