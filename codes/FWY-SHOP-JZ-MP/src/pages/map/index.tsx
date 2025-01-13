import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'
import { fetchExhibitionList } from '../../services/exhibition'

import { View, Map, Image } from '@tarojs/components'

import iconBackSelfPng from '../../assets/images/global/icon-back-self.png'
import iconMapListPng from '../../assets/images/global/icon-map-list.png'

export default class MorePage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            center: {
                latitude: 34.626759,
                longitude: 112.46388,
            },
            markers: [],
        }
    }

    componentWillMount() {
        if (this.$router.params.title) {
            Taro.setNavigationBarTitle({
                title: this.$router.params.title 
            })
        }
    }

    gotoPage = (url, e) => {
        e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/' + url
        })
    }
  
    fetchList = () => {
        fetchExhibitionList().then(res => {
            let _markers = [];
            (res.list || []).map(r => {
                _markers.push({
                    iconPath: r.chartAddress,
                    id: r.id,
                    latitude: r.latitude,
                    longitude: r.longitude,
                    width: 20,
                    height: 30,
                    callout: {
                        content:`${r.address}\r\n${r.startTime} - ${r.endTime}`,
                        color: "#000000",
                        fontSize: 15,
                        borderRadius: 10,
                        bgColor: "#ffffff",
                        padding: 10,
                        display: "BYCLICK"
                      },
                })
            })
            this.setState(prevState => ({
                markers: _markers,
                center: _markers && _markers.length ? {
                    latitude: _markers[0].latitude,
                    longitude: _markers[0].longitude,
                } : {
                    latitude: 34.626759,
                longitude: 112.46388,
                }
            }));
        });
    }

    onTapCallout = event => {
		const markers = this.state.markers;
		for (let i = 0; i < markers.length; i++) { // 本示例只有一个marker，可用于处理单marker和多marker情况
			if (event.detail.markerId === markers[i].id) {
                Taro.navigateTo({
                    url: '/pages/exhibition-detail/index?id=' + markers[i].id
                })
			}
		}
	},
  
    fetchMyLocation = () => {
        Taro.getLocation({
            type: 'gcj02',
            success: (res) => {
              this.setState(prevState => ({
                center: {
                    latitude: res.latitude,
                    longitude: res.longitude
                }
              }));
            }
          })
    }

    componentDidShow() {
        this.fetchList();
    }

    config: Config = {
        navigationBarTitleText: '地图',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='more-page'>
                <Map id="map" longitude={this.state.center.longitude} latitude={this.state.center.latitude} scale={14} markers={ this.state.markers }
                    show-location style="width: 100%; height: 100vh;" onCalloutTap={this.onTapCallout.bind(this)}>
                </Map>
                <View className="back-self-location-btn"><Image src={iconBackSelfPng} mode='widthFix' onClick={ this.fetchMyLocation.bind(this) } /></View>
                <View className="map-list-btn"><Image src={iconMapListPng} mode='widthFix' onClick={this.gotoPage.bind(this, 'exhibition/index')} /></View>
            </View>
        )
    }

}
