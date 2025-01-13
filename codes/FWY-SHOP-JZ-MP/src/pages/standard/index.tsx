import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import { getStandardShowAllTypes } from '../../services/standard';
import { fetchAdvertShowBanners } from '../../services/banner';

import classNames from 'classnames'
import jump from '../../utils/jump';
export default class StandardPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            selectedAge: '',
            selectedType: '',
            row2Show: false,
            categories: [],
            filterTypes: [],
            filterAges: [],
            isBuy: false,
            group: 0,
            banners: [],
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.fetchBannerList();
        this.fetchList('');
    }


    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '标准',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='borrow-page'>

                <View className='top-banner'>
                    <Image src={ this.state.banners.length ? this.state.banners[0].adCoverUrl : '' } mode='widthFix' />
                </View>
                
                <View>
                    <View className='filters-row filters-row2'>
                        <View className='left'>
                            分类
                        </View>
                        <View className='center'>
                            <View className={classNames('item', this.state.selectedType == '' && 'actived')} onClick={this.changeFilter.bind(this, 'selectedType', '')}>
                                全部
                            </View>
                            {
                                Array.isArray(this.state.filterTypes) && this.state.filterTypes.map((type, index) => {
                                    return (
                                        <View key={index} className={classNames('item', this.state.selectedType == type.code && 'actived')} onClick={this.changeFilter.bind(this, 'selectedType', type.code)}>
                                            {type.name}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                </View> 


                {
                    
                    Array.isArray(this.state.categories) && this.state.categories.map((category, index) => {
                        return (<View className='content-wrap' key={index}>

                            <View className='content-title-wrap'>
                                <Text className='title'>{category.name}</Text>
                                <View className='more-dynamic' onClick={this.gotoPage.bind(this, 'standard/more/index?pid=' + category.id + '&title=' + category.name )}>更多<AtIcon value='chevron-right' size='14' color='#B4B1B1'></AtIcon></View>
                            </View>

                            <View className='book-wrap'>
                                <View className='at-row'>
                                    <View className='at-col at-col-4'>
                                        {
                                            category.standards.length > 0 && <View className='recommend-item' onClick={this.gotoDetailPage.bind(this,  category.standards[0].outLink ? category.standards[0].outLink :'standard/detail/index?id=' + category.standards[0].id , '标准详情')} >
                                                <View className='pic'>   
                                                    <Image src={ category.standards[0].coverPicUrl } mode='scaleToFill' />
                                                </View>
                                                <View className='infos'>
                                                    <View className='name'>{category.standards[0].name}</View>
                                                    <View className='tags'>
                                                        {
                                                            category.standards[0].convertShowTags.map((tag, index) => (
                                                                <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                    <View className='at-col at-col-4'>
                                        {
                                            category.standards.length > 1 && <View className='recommend-item' onClick={this.gotoDetailPage.bind(this,  category.standards[0].outLink ? category.standards[0].outLink :'standard/detail/index?id=' + category.standards[1].id , '标准详情')} >
                                                <View className='pic'>
                                                    <Image src={ category.standards[1].coverPicUrl } mode='scaleToFill' />
                                                </View>
                                                <View className='infos'>
                                                    <View className='name'>{category.standards[1].name}</View>
                                                    <View className='tags'>
                                                        {
                                                            category.standards[1].convertShowTags.map((tag, index) => (
                                                                <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                    <View className='at-col at-col-4'>
                                        {
                                            category.standards.length > 2 && <View className='recommend-item' onClick={this.gotoDetailPage.bind(this,  category.standards[0].outLink ? category.standards[0].outLink :'standard/detail/index?id=' + category.standards[2].id , '标准详情')} >
                                                <View className='pic'>
                                                    <Image src={ category.standards[2].coverPicUrl } mode='scaleToFill' />
                                                </View>
                                                <View className='infos'>
                                                    <View className='name'>{category.standards[2].name}</View>
                                                    <View className='tags'>
                                                        {
                                                            category.standards[2].convertShowTags.map((tag, index) => (
                                                                <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                                            ))
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                        }
                                    </View>
                                </View>
                            </View>
                            </View>
                        )
                    })
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
    gotoPage = (url, e) => {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    changeFilter = (name, val, e) => {
        let _params = {};
        _params[name] = val;
        this.setState(prevState => (_params));
        this.fetchList(val);
    }

    search = () => {
        this.fetchList(this.state.selectedType);
    }

    resetSearch = () => {
        this.setState(prevState => ({
            selectedType: '',
            selectedAge: ''
        }));
        this.fetchList('');
    }

    changeArrow = (e) => {
        this.setState(prevState => ({
            row2Show: !prevState.row2Show
        }));
    }


    setTipDialog = (status, e) => {
        this.setState(prevState => ({
            dialogTipStatus: status
        }));
    }

    onGotoBuy = (e) => {
        Taro.redirectTo({
            url: '/pages/buyback/apply/index'
        })
    }

    onGotoRecord = (e) => {
        Taro.redirectTo({
            url: '/pages/buyback/record/index'
        })
    }

    fetchBannerList = () => {
        let _code = 'A0103';
      fetchAdvertShowBanners({ code: _code }).then(res => {
        this.setState(prevState => ({
          banners: res.list || []
        }));
      });
    }

    fetchList = (typeId: '') => {
        getStandardShowAllTypes({ typeId: typeId}).then(res => {
            let arrs = [];
            res.list.map(item => {
                item['standards'] = res.standardMapping[item.id];
                if (item['standards']) {
                    item['standards'].map(book => {
                        let _showTags = [];
                        if (book.showTags) {
                            _showTags = book.showTags.split(',');
                        }
                        if (book.ages && book.ages.length) {
                            let _ageArrs = [];
                            book.ages.map(age => {
                                _ageArrs.push({
                                    type: 'age',
                                    name: age.name
                                })
                            });
                            _showTags = [ ..._ageArrs, ..._showTags ];
                        }
                        book['convertShowTags'] = _showTags;
                    })
                }
                let _selectedTypeNames = this.state.filterTypes.filter(item => item.code == this.state.selectedType);
                if (_selectedTypeNames && _selectedTypeNames.length && _selectedTypeNames[0].name == item.name) {
                    arrs.push(item);
                }
            })

            // debugger;
            // if (this.state.selectedType) {
                // res.list = arrs;
            // }

            if (typeId == '') {
                let _filterTypes = [];
                res.list.map(item => {
                    _filterTypes.push({
                        code: item.id,
                        name: item.name
                    });
                })
                this.setState(prevState => ({
                    filterTypes: _filterTypes || [],
                }));
            }
            console.log(res.list.filter(item => item.standards && item.standards.length));
            this.setState(prevState => ({
                categories: res.list.filter(item => item.standards && item.standards.length) || [],
            }));
        });
    }
    jumpWebview = (title, url) => {
          jump({
              title: title,
              url: url
          });
      }
}
