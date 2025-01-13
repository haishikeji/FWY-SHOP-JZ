import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'
import { AtTabs } from 'taro-ui'

import { getCollectionPage } from '../../../../services/collect';

import NoDataComponent from '../../../../components/not-data';

import classNames from 'classnames';

export default class CollList extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
        tabIndex: 0,
        colls: [],
        tabList: [{ title: '窍门', id: 0 }, { title: '标准', id: 1 }, { title: '产品', id: 2 }, { title: '案例', id: 3 }],
    }
  }

  componentDidMount() {
      this.fetchCollectionPage();
  }
  
  componentDidShow () {

    let _currentPages = Taro.getCurrentPages();
    if (_currentPages && _currentPages.length >= 1) {
        let currPage = _currentPages[_currentPages.length - 1];
        if (currPage.data.status || currPage.data.status == -1) {
            this.$router.params.status = currPage.data.status == -1 ? '' : currPage.data.status;
        }
    }

    if (this.$router.params.status) {
        let _index = this.state.tabList.findIndex((item) => item.id == this.$router.params.status);
        if (_index != -1) {
            this.setState(prevState => ({
                tabIndex: _index
            }));
        }
    } else {
    }
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '我的收藏',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    return (
        <View className='my-coll-page'>

            <AtTabs className='card-tabs' current={this.state.tabIndex} tabList={this.state.tabList} onClick={this.onChangeTabIndex.bind(this)}>
            </AtTabs>

            { (!this.state.colls || this.state.colls.length == 0) && 
                <NoDataComponent text='暂无收藏信息哦！' isFull={false} imgSize={'height: 200rpx; width: 200rpx; margin-top: 250rpx;'} img='http://bookclub-imgs.doule.me/imgs/common/pic-not-coll.png' />
            }

            {
                Array.isArray(this.state.colls) && <View>
                    {
                        Array.isArray(this.state.colls) && this.state.colls.map((coll, index) => (
                            <View className='content-wrap' key={index}>
                                <View className='lf-wrap' onClick={this.gotoNextPage.bind(this, coll.type, coll.refPk)}>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={coll.refVo.coverPicUrl} mode='scaleToFill' />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        {coll.type == 'PRODUCT' && <Text className='name'>{coll.refVo.productName}</Text>}
                                        {coll.type == 'CASEINFO' && <Text className='name'>{coll.refVo.projectName}</Text>}
                                        {coll.type == 'KNACK'  && <Text className='name'>{coll.refVo.name}</Text>}
                                        {coll.type == 'STANDARD'  && <Text className='name'>{coll.refVo.name}</Text>}
                                        <View className="book-tags">
                                            {
                                                coll && coll.refVo && coll.refVo.convertShowTags.length && coll.refVo.convertShowTags.map((tag, index) => (
                                                    <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag }</View>
                                                ))
                                            }
                                        </View>
                                        {/* { (coll.type != 'CHILDREN_BORROW' && coll.type != 'CHILDREN_PARTICIPATE_OFFLINE_COURSE') && <View className='text-price'>
                                            <Text className='price-symbol'>￥</Text>{(coll.refVo.salePrice || 0).toFixed(2)} 
                                            <View className='un-price'><Text className='price-symbol'>￥</Text>{(coll.refVo.markPrice || 0).toFixed(2)}</View>
                                        </View> }
                                        { coll.type == 'CHILDREN_PARTICIPATE_OFFLINE_COURSE' && <View className='text-price'>
                                            <Text className='price-symbol'>￥</Text>{(coll.refVo.price || 0).toFixed(2)} 
                                            <View className='un-price'><Text className='price-symbol'>￥</Text>{(coll.refVo.oldPrice || 0).toFixed(2)}</View>
                                        </View> } */}
                                        <View className='btns'>
                                            {/* { coll.type == 'CHILDREN_BORROW' && <View className='btn borrow'>
                                                借
                                                </View>
                                            }
                                            { (coll.type == 'CHILDREN_BUY' || coll.type == 'ADULT_BUY') && <View className='btn buy'>
                                                买
                                                </View>
                                            } */}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </View>
            }
            
        </View>
    )
  }

    onChangeTabIndex = (index, e) => {
        if (e) e.stopPropagation();
        this.setState(prevState => ({
            tabIndex: index,
        }));
        if (index == 1) {
            this.fetchCollectionPage('STANDARD');
        } else if (index == 2) {
            this.fetchCollectionPage('PRODUCT');
        }  else if (index == 3) {
            this.fetchCollectionPage('CASEINFO');
        }else {
            this.fetchCollectionPage();
        }
    }

    gotoNextPage = (type, id, e) => {
        if (e) e.stopPropagation();
        if (type == 'KNACK' || type == 'KNACK_SERIES') {
            Taro.navigateTo({
                url: '/pages/knack/detail/index?id=' + id + '&type='+type 
            });
        } else if (type == 'PRODUCT') {
            Taro.navigateTo({
                url: '/subpages/pages/product/detail/index?id=' + id 
            });
        } else if (type == 'CASEINFO') {
            Taro.navigateTo({
                url: '/subpages/pages/case/detail/index?id=' + id 
            });
        } else if (type == 'STANDARD') {
            Taro.navigateTo({
                url: '/pages/standard/detail/index?id=' + id
            });
        }
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }
  
    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/packageMy/pages/' + url
        })
    }
    
    fetchCollectionPage = (type = 'KNACK,KNACK_SERIES') => {
        getCollectionPage({ types: type }).then(res => {

            // if (type == 'CHILDREN_BORROW' || type == 'CHILDREN_BUY' || type == 'ADULT_BUY') {
                res.list.map(coll => {
                    coll.refVo['convertShowTags'] = [];
                    if (coll.type == 'CHILDREN_BORROW' || coll.type == 'CHILDREN_BUY' || coll.type == 'ADULT_BUY') {
                        let _showTags = coll.refVo.showTags.split(',');
                        if (coll.refVo.ages && coll.refVo.ages.length) {
                            let _ageArrs = [];
                            coll.refVo.ages.map(item => {
                                _ageArrs.push({
                                    type: 'age',
                                    name: item.name
                                })
                            });
                            _showTags = [ ..._ageArrs, ..._showTags ];
                        }
                        coll.refVo['convertShowTags'] = _showTags;
                    }
                })
            // }

            this.setState(prevState => ({
                colls: res.list
            }));
        });
    }
  
}
