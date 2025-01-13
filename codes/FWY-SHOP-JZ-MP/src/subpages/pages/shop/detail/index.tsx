import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text, WebView} from '@tarojs/components'

import { AtRate, AtTabs, AtSlider,AtAvatar,AtIcon} from 'taro-ui'


import { showTextToast } from '../../../../utils/util';

import classNames from 'classnames';

import 'taro-parse/dist/style/main.scss'
import TaroParser from 'taro-parse'

import jump from '../../../../utils/jump';

export default class BookDetailPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            moreShow:false,
            moreText:'查看更多>>'
        }
    }

    componentWillMount() {
    }

    componentDidShow() {
        this.fetchDetail(this.$router.params.id,this.$router.params.type);
    }

    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '商家详情',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='book-detail-page'>
                <View className="shop-head">
                    <View className="title">
                    {/* TODO 图片 */}
                        <View className="avatar"><AtAvatar image='http://zycimg.106tec.com/users/99/20201117/8c8a93dbea3941079f02a0ab82d25d63.jpg' circle={true}></AtAvatar></View>
                        <View className="name">河南品讯科技有限公司河南品讯科技有限公司</View>
                    </View>
                    <View className="info">
                        <View className='at-article__info,at-margin-10'>地　　址：北京车公庄</View>
                        <View className='at-article__info,at-margin-10'>联系电话：北京车公庄</View>
                        <View className='at-article__info,at-margin-10'>展厅位置：北京车公庄</View>
                        <View className='at-article__info,at-margin-10'><AtIcon  value='map-pin' size='15' color='#F00'></AtIcon>北京</View>
                    </View>
                    
                    <View className={ classNames('at-article__info', this.state.moreShow ? 'more-show' : 'desc') }>河南品讯科技有限公司河南品讯科技有限公司</View>
                    <View className="more" onClick={this.onClickMore.bind(this)}>{this.state.moreText}</View>
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
    onClickMore = () => {
        this.setState(prevState => ({
            moreShow: !prevState.moreShow
            moreText: !prevState.moreShow?'收起':'查看更多>>'
        }))
    }

    fetchDetail = (id,_type) => {
        if (!id) {
            showTextToast('未找到相关标准');
            return;
        }
       
    }

}
