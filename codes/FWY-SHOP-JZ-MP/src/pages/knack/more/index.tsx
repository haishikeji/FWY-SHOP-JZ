import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'

import { fetchAdvertShowBanners } from '../../../services/banner';
import { getShowKnacks, showLevel2TypeByParentType } from '../../../services/knack';
import { getCollectionMapping, execCollectionSaveRef, execCollectionDelRef } from '../../../services/collect';


import { showTextToast } from '../../../utils/util';
import jump from '../../../utils/jump';
import classNames from 'classnames'

export default class MorePage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            pageCurr: 1,
            totalPage: 0,
            selectedAge: '',
            selectedType: '',
            row2Show: false,
            categories: [],
            filterTypes: [],
            isBuy: false,
            banners: [],
            knackList: [],
            cartTotal: 0,
            showHomeType: '',

            collectMapping: {},
        }
    }

    componentWillMount() {
        if (this.$router.params.title) {
            Taro.setNavigationBarTitle({
                title: this.$router.params.title 
            })
        }
        this.setState(prevState => ({
            showHomeType: this.$router.params.showHomeType || ''
        }), () => {
           // this.fetchCollectionMapping();
            this.fetchBannerList();
           // this.fetchList(this.$router.params.pid);
            this.fetchLevel2TypeByParentTypeList(this.$router.params.pid, '', 1);
        });
    }

    componentDidShow() {
    }

    onReachBottom() {
        let _nextPageNum = this.state.pageCurr + 1;
        if (_nextPageNum > this.state.totalPage) {
            return;
        }
        this.setState(prevState => ({
          pageCurr: _nextPageNum
        }));
        this.fetchLevel2TypeByParentTypeList(this.$router.params.pid, this.state.selectedType || '', _nextPageNum);
    }

    config: Config = {
        navigationBarTitleText: '窍门',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='more-page'>
                <View className='top-banner'>
                    <Image src={ this.state.banners.length ? this.state.banners[0].adCoverUrl : '' } mode='widthFix' />
                </View>
                {/* <View className='filters-row'>
                    <View className='center'>
                        <View className={classNames('item', this.state.selectedType == '' && 'actived')} onClick={this.changeFilter.bind(this, 'selectedType', '')}>
                            全部
                        </View>
                        {
                            Array.isArray(this.state.categories) && this.state.categories.map((type, index) => {
                                return (
                                    <View key={index} className={classNames('item', this.state.selectedType == type.id && 'actived')} onClick={this.changeFilter.bind(this, 'selectedType', type.id)}>
                                        {type.name}
                                    </View>
                                )
                            })
                        }
                    </View>
                </View>  */}

                {
                    Array.isArray(this.state.knackList) && this.state.knackList.map((knack, index) => {
                        return (
                            <View className='content-wrap' key={index}>
                                <View className='lf-wrap' onClick={this.gotoDetailPage.bind(this, knack.outLink ? knack.outLink : 'knack/detail/index?id=' + knack.id + '&type='+knack.type,'窍门详情')}>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={knack.coverPicUrl} mode='scaleToFill' />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        <Text className='name'>{knack.name}</Text>
                                        <View className="tags">
                                             { 
                                                knack.convertShowTags && knack.convertShowTags.map((tag, index) => (
                                                    <View className={ classNames('tag',  'green') } key={index} >{tag.name || tag}</View>
                                                ))
                                            }
                                        </View>
                                        { knack.author && <View><Text className='author'>作者：{knack.author}</Text> </View>}
                                        { knack.publishTime && <View><Text className='author'>发布日期：{knack.publishTime}</Text> </View>}
                                        {/* <View className='coll' onClick={this.handleCollect.bind(this, knack.id)}>
                                            { !this.state.collectMapping[knack.id] && <Image src='http://bookclub-imgs.doule.me/imgs/index/icon-more-coll-normal.png' mode='widthFix' /> }
                                            { this.state.collectMapping[knack.id] && <Image src='http://bookclub-imgs.doule.me/imgs/index/icon-more-coll-actived.png' mode='widthFix' /> }
                                            <Text className='coll-text'>收藏</Text>
                                        </View> */}
                                    </View>
                                </View>
                            </View>
                        )
                    })
                }

                <View style="height: 10px; background: #f4f4f4;"></View>

                {/* <View className='go-car-btn' onClick={this.gotoSwitchPage.bind(this, 'car/index')}>
                    <Image src='http://bookclub-imgs.doule.me/imgs/index/icon-global-car.png' mode='widthFix' />
                    <View className='red-num'>{this.state.cartTotal || 0}</View>
                </View> */}
            </View>
        )
    }

    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/subpages/pages/' + url
        })
    }

    gotoSwitchPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.switchTab({
            url: '/pages/' + url
        })
    }
    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }
    fetchBannerList = () => {
        let _code = 'B0101';
      fetchAdvertShowBanners({ code: _code }).then(res => {
        this.setState(prevState => ({
          banners: res.list || []
        }));
      });
    }
    gotoDetailPage = (url,title, e) => {
        console.log(url,title)
        e.stopPropagation();
        if(url.startsWith('https')){
            jump({
                title: title,
                url: url
            });
        }else{
          Taro.navigateTo({
            url: '/pages/' + url
          })
        }
      }
    changeFilter = (name, val, e) => {
        let _params = {};
        _params['knackList'] = [];
        _params['pageCurr'] = 0;
        _params[name] = val;
        this.setState(prevState => (_params));
        this.fetchLevel2TypeByParentTypeList(this.$router.params.pid, val, 0);
    }

    fetchList = (typeId) => {
        showLevel2TypeByParentType({ parentType: typeId }).then(res => {
            this.setState(prevState => ({
                categories: res.list || [],
            }));
        });
    }

    fetchLevel2TypeByParentTypeList = (parentType, level2Type, pageNum) => {
        getShowKnacks({  pageNum: pageNum }).then(res => {
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
                this.setState(prevState => ({
                    knackList: pageNum == 0 ? res.list : prevState.knackList.concat(res.list),
                    totalPage: res.pageInfoParam.totalPage
                }));
            }
            
        });
    }
    
    fetchCollectionMapping = () => {
        let _type = '';
        getCollectionMapping({ type: _type }).then(res => {
            this.setState(prevState => ({
                collectMapping: res.mapping,
            }));
        });
    }

    handleCollect = (id, e) => {
        if (e) e.stopPropagation();
        if (!id) {
            return;
        }
        let _type = '';
        if (this.state.collectMapping[id]) {
            execCollectionDelRef({ type: _type, refPk: id }).then((res) => {
                this.fetchCollectionMapping();
                showTextToast("取消收藏成功");
            });
        } else {
            execCollectionSaveRef({ type: _type, refPk: id }).then((res) => {
                this.fetchCollectionMapping();
                showTextToast("收藏成功");
            });
        }
    }
}
