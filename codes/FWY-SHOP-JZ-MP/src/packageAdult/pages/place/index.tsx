import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'

import { getPlaceList } from '../../../services/place';

export default class AdultPlacePage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            places: [],
        }
    }

    componentDidShow() {
        this.fetchList(1);
    }

    config: Config = {
        navigationBarTitleText: '场馆预约',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='adult-place-page'>

                {
                    Array.isArray(this.state.places) && this.state.places.map((place, index) => {
                        return (
                            <View className='content-wrap' key={index}>
                                <View className='lf-wrap' onClick={this.gotoSubPage.bind(this, 'place-detail/index?id=' + place.id)}>
                                    <View className='lf-wrap-series-top'>
                                        <Image src={place.coverPicUrl} mode='widthFix' />
                                    </View>
                                    <View className='lf-wrap-series-bottom'>
                                        <View className='name'>
                                            {place.name}
                                            <View className='course-price' >¥{place.weekdaysPrice || 0}.00 / 每小时</View>
                                        </View>
                                        <View className='desc'>
                                            {place.content}
                                        </View>
                                        <View className='status'>
                                            <View className='limit'>营业：周一至周日 {place.startTime}-{place.endTime} / 容纳<Text className='person'>{place.maxNum}</Text>人</View>
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
        url: '/packageAdult/pages/' + url
      })
    }

    gotoPage = (url, e) => {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }

    fetchList = (group) => {
        getPlaceList().then(res => {
            // res.list.map(item => {
            //   let _showTags = item.showTags.split(',');
            //   item['convertShowTags'] = _showTags;
            // })
            this.setState(prevState => ({
                places: res.list || []
            }));
        });
    }
}
