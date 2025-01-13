import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text, WebView} from '@tarojs/components'

import { AtRate, AtTabs, AtSlider } from 'taro-ui'

import { getKnackDetail } from '../../../services/knack';
import { fetchAdvertShowBanners } from '../../../services/banner';

import { getCollectionExistRef, execCollectionSaveRef, execCollectionDelRef } from '../../../services/collect';

import { showTextToast } from '../../../utils/util';

import classNames from 'classnames';

import 'taro-parse/dist/style/main.scss'
import TaroParser from 'taro-parse'

import jump from '../../../utils/jump';

export default class BookDetailPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            selectedType: '',
            row2Show: false,
            tabTitles: [
                
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
            ads: [],
            knackType:'',
            userInfo: {},
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        let _tabs = [{ id: 0, title: '内容' }]
        if(this.$router.params.type == 'KNACK_SERIES'){
            _tabs.push( { id: 1, title: '系列'  })
        }
        this.setState(prevState => ({
            tabTitles: _tabs,
            userInfo: Taro.getStorageSync('member')
        }));
        this.fetchDetail(this.$router.params.id,this.$router.params.type);
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
        navigationBarTitleText: '窍门详情',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='book-detail-page'>
                <View className="infos">
                    <View className="info-left">
                        <Image src={this.state.vo.coverPicUrl} mode='scaleToFill' />
                    </View>
                    <View className="info-right">
                        <View className="book-name">{this.state.vo.name}</View>
                        <View className="book-tags">
                            {
                                Array.isArray(this.state.vo.convertShowTags) && this.state.vo.convertShowTags.map((tag, index) => (
                                    <View className={ classNames('tag', tag.type == 'catg' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                ))
                            }
                        </View>
                        <View className="book-field">
                            <Text className='field-name'>作者: </Text><Text className='field-value'>{this.state.vo.author}</Text>
                        </View>
                        <View className="book-field">
                            <Text className='field-name'>发布日期: </Text><Text className='field-value'>{this.state.vo.publishTime}</Text>
                        </View>
                        <View className="book-field">
                            <Text className='field-name'>推荐指数：</Text><View className='field-rate'><AtRate size={15} value={4} /></View>
                        </View>
                        <View className="book-btns">
                            {/* { <View className='filters-btn-confirm' onClick={this.gotoPage.bind(this, 'series/index?id=' + this.state.vo.id + '&group=' + this.state.group + '&isBuy=' + this.state.isBuy)}>查看全系列</View> } */}
                            <View className='coll' onClick={this.handleCollect.bind(this, this.state.vo.id)}>
                                { !this.state.voExist && <Image src='http://bookclub-imgs.doule.me/imgs/index/icon-more-coll-normal.png' mode='widthFix' /> }
                                { this.state.voExist && <Image src='http://bookclub-imgs.doule.me/imgs/index/icon-more-coll-actived.png' mode='widthFix' /> }
                                <Text className='coll-text'>收藏</Text>
                            </View>
                        </View>
                    </View>
                </View>
                
                { this.state.vo.audioDescUrl && <View className="voice-wrap">
                    <View className='left' onClick={this.play}>
                        { this.state.isPlay && <Image src='http://bookclub-imgs.doule.me/imgs/common/icon-voice-stop.png' mode='scaleToFill' /> }
                        { !this.state.isPlay && <Image src='http://bookclub-imgs.doule.me/imgs/common/icon-voice-play.png' mode='scaleToFill' /> }
                    </View>
                    <View className='right'>
                        <View className='slider'>
                            <View className="start-time">{this.format(this.state.playTime)}</View>
                            <AtSlider className='slider-width' step={1} value={this.state.playTime} max={this.state.timeLenght} onChange={(e)=>this.sliderChange(e)} activeColor='#f60' backgroundColor='#BDBDBD' blockColor='#f60' blockSize={12}></AtSlider>
                            <View className="end-time">{this.format(this.state.timeLenght)}</View>
                        </View>
                    </View>
                </View> }

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
                        { 
                            this.state.vo.content && <TaroParser
                                type='markdown'
                                theme='light'
                                onImgClick={this.imgClick}
                                onLoaded={() => {
                                    console.log(1234);
                                    Taro.hideLoading()
                                }}
                                content={this.state.vo.content}
                            />
                        }
                    </View>
                    { this.state.currentTab == 1 && <View className='content'>
                        <ScrollView scrollY scrollWithAnimation className='course-items'>
                                {
                                    Array.isArray(this.state.vo.knacks) && this.state.vo.knacks.map((knack, index) => (
                                        <View className='course-item' onClick={this.gotoPage.bind(this, 'knack/detail/index?id=' + knack.id + '&type=knack')} key={index}>
                                            <View className='course-item-left'>
                                                <View className='seq'>
                                                    {index < 9 ? '0' + (index + 1) : index}
                                                </View>
                                            </View>
                                            <View className='course-item-right'>
                                                <View className='title'>
                                                    {knack.name}
                                                </View>
                                            </View>
                                        </View>
                                    ))
                                }
                            </ScrollView>
                    </View> }
                   
                </View>

            </View>
        )
    }
    onShareAppMessage = () => {
    
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
    

    fetchDetail = (id,_type) => {
        if (!id) {
            showTextToast('未找到相关标准');
            return;
        }
        getKnackDetail({ id: id,type:_type }).then(res => {
            res.vo.refUrl="https://mp.weixin.qq.com"
            //this.jumpWebview("1213","https://mp.weixin.qq.com");
            let _tags = [];
            if(_type == 'KNACK_SERIES'){
                _tags.push({
                    type: 'series',
                    name:'系列'
                })
            }
            res.vo.types.map(item => {
                _tags.push({
                    type: 'catg',
                    name:item.name
                })
            })

            res.vo["convertShowTags"] =  _tags;
            this.setState(prevState => ({
                vo: res.vo
            }));
           
            
            if(res.vo.fileUrl){
                let _file = JSON.parse(res.vo.fileUrl);
                this.setState({
                    fileUrls:_file
                })
            }
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
        let _type = 'KNACK';
        if(this.$router.params.type == 'KNACK_SERIES'){
            _type = 'KNACK_SERIES'
        }
        getCollectionExistRef({ type: _type, refPk: id, noJump: true  }).then(res => {
            this.setState({
                voExist: res.exist
            })
        });
    }

    handleCollect = (id, e) => {
        if (e) e.stopPropagation();
        if (!id) {
            return;
        }
        let _type = 'KNACK';
        if(this.$router.params.type == 'KNACK_SERIES'){
            _type = 'KNACK_SERIES'
        }
        if (this.state.voExist) {
            execCollectionDelRef({ type: _type, refPk: id }).then((res) => {
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
        Taro.downloadFile({
            url: _url,
            success: function (res) {
              var filePath = res.tempFilePath
              Taro.openDocument({
                filePath: filePath,
                success: function (res) {
                  console.log('打开文档成功')
                }
              })
            }
          })
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

    imgClick = (src,imgList) =>{
        Taro.previewImage({urls:imgList,current:src}).then(()=>{})
    }

}
