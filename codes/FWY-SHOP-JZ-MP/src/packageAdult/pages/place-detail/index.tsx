import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, ScrollView } from '@tarojs/components'

import { getPlaceDetail, getFuture7Days } from '../../../services/place';

import 'taro-parse/dist/style/main.scss'
import TaroParser from 'taro-parse'

import classNames from 'classnames'

export default class AdultPlaceDetailPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            place: { },
            days: [],
            isWeekend: false,
        }
    }

    componentDidShow() {

        this.setState(prevState => ({
            isWeekend: this.isWeekEnd()
        }), () => {
            this.fetchPlaceDetail(this.$router.params.id);
        });
    }


    /**
     * 指定config的类型声明为: Taro.Config
     *
     * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
     * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
     * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
     */
    config: Config = {
        navigationBarTitleText: '场馆详情',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='adult-place-detail-page'>

                
                <View className='content-wrap detail-content-wrap'>
                    <View className='lf-wrap'>
                        <View className='lf-wrap-detail-top'>
                            {/* <Image src={cart.img} mode='widthFix' /> */}
                            <Image src={this.state.place.coverPicUrl} mode='widthFix' />
                        </View>
                        <View className='lf-wrap-detail-bottom'>
                            <View className='name'>
                                {this.state.place.name}
                                <View className='text-price'>
                                    <Text className='price-symbol'>￥</Text>{(this.state.isWeekend == true ? place.weekendPrice : place.weekdaysPrice) || 0}.00 / 每小时
                                </View>
                            </View>
                            {/* <View className="tags">
                                {
                                    this.state.place && this.state.place.convertShowTags.map((tag, index) => (
                                        <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                    ))
                                }
                            </View> */}
                            <View className='book-fields'>
                                {/* <View className="book-field">
                                    <Text className='field-name'>课程时长: </Text><Text className='field-value'>{this.state.place.a}分钟/课时</Text>
                                </View> */}
                                <View className="book-field">
                                    <Text className='field-name'>营业时间：</Text><Text className='field-value'>周一至周日  {this.state.place.startTime}-{this.state.place.endTime}</Text>
                                </View>
                                <View className="book-field">
                                    <Text className='field-name'>场馆地址：</Text><Text className='field-value'>{this.state.place.address}</Text>
                                </View>
                                <View className="book-field">
                                    <Text className='field-name'>位置描述：</Text><Text className='field-value'>{this.state.place.addressDescript}</Text>
                                </View>
                            </View>
                        </View>
                        
                    </View>
                </View>

                <View className='block-title'>
                    可预约时间
                </View>

                <View className='block-wrap'>
                    
                    <ScrollView scrollX scrollWithAnimation className='plan-list'>
                    
                    {
                        Array.isArray(this.state.days) && this.state.days.map((day, index) => {
                            return (
                                <View  key={index} className='plan-item actived' onClick={this.gotoSubPage.bind(this, 'place-time/index?id=' + this.state.place.id + '&day=' + day.day)}>
                                    <View className='name'>
                                        {day.week}({day.day})
                                    </View>
                                    <View className='desc'>
                                        {this.state.isWeekend == true ? place.weekendStartTime : place.startTime}:00起 可订
                                    </View>
                                    <View className={ classNames('tip', day.isFull == true && 'red', day.isFull == false && 'green') }>
                                        {day.isFull == true ? '已满' : '可预订'}
                                    </View>
                                </View>
                            )
                        })
                    }
                    </ScrollView>

                </View>

                <View className='block-title'>
                    注意事项
                </View>

                <View className='block-wrap'>
                    {/* <DescRichText desc={this.state.place.content}></DescRichText> */}
                    <TaroParser
                        type='markdown'
                        theme='light'
                        // onImgClick={this.imgClick}
                        // onLinkClick={this.linkClick}
                        onLoaded={() => {
                            Taro.hideLoading()
                        }}
                        yumlApi='https://md.werfei.com/?yuml'
                        latexApi='https://md.werfei.com/?tex'
                        content={this.state.place.content}
                    />
                </View>

                {/* <View style="height: 10px; background: #f4f4f4;"></View> */}

            </View>
        )
    }

    gotoSubPage = (url, e) => {
      if (e) e.stopPropagation();
      Taro.navigateTo({
        url: '/packageAdult/pages/' + url
      })
    }

    gotoPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    fetchPlaceDetail = (id) => {
        getPlaceDetail({ id: id }).then(res => {
            this.setState(prevState => ({
                place: res.vo || []
            }));
            this.fetchFuture7Days(id);
        });
    }

    fetchFuture7Days = (id) => {
        getFuture7Days({ id: id }).then(res => {
            this.setState(prevState => ({
                days: res.list || []
            }));
        });
    }

    isWeekEnd = () => {
        let _day = new Date().getDay();
        if (_day == 0 || _day == 6) {
            return true;
        } else {
            return false;
        }
    }
}
