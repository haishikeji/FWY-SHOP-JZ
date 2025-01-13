import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text } from '@tarojs/components'
import { AtIcon, AtAvatar } from 'taro-ui'
import {  fetchExpertDetail} from '../../../services/question';
import { showTextToast } from '../../../utils/util';
import 'taro-parse/dist/style/main.scss'
import TaroParser from 'taro-parse'
export default class TestaPage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            zhuanjia:{}
        }
    }
    componentWillMount() {
    }

    componentDidShow() {
        this.fetchDetail(this.$router.params.id);
    }

    config: Config = {
        navigationBarTitleText: '嘉宾介绍',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='testa-page'>
                
                <View className="content-wrap">
                    <View className="title">
                        <View className="company-pic">
                            <Image src={this.state.zhuanjia.avatarUrl} mode='widthFix' />
                            {/* <AtAvatar image={this.state.zhuanjia.avatarUrl}  size='large'></AtAvatar> */}
                        </View>
                        {this.state.zhuanjia.realName}
                    </View>
                    {/* <View className="filed-list">
                        <View className="filed-item">
                            <View className="filed-item-left">
                                公司:
                            </View>
                            东麦工贸有限公司
                        </View>
                        <View className="filed-item">
                            <View className="filed-item-left">
                                地址:
                            </View>
                            厦门市湖里区岐山北路223号
                        </View>
                        <View className="filed-item">
                            <View className="filed-item-left">
                                电话:
                            </View>
                            151****4122<View className="show-phone">查看号码</View>
                        </View>
                    </View> */}
                    {/* <View className="tags">
                        <View className="tag">
                            <Text className="num">31</Text>关注
                        </View>
                        <View className="tag">
                            <Text className="num">31</Text>留言
                        </View>
                        <View className="tag">
                            <Text className="num">31</Text>评论
                        </View>
                        <View className="tag">
                            <Text className="num">31</Text>动态
                        </View>
                        <View className="tag">
                            <Text className="num">31</Text>案例
                        </View>
                    </View> */}
                    <View className="desc">
                        {this.state.zhuanjia.description}
                    </View>
                    <View className='content,real-content'>
                        { 
                            this.state.zhuanjia.content && <TaroParser
                                type='markdown'
                                theme='light'
                                onLoaded={() => {
                                    Taro.hideLoading()
                                }}
                                content={this.state.zhuanjia.content}
                            />
                        }
                    </View>
                </View>
            </View>
        )
    }
    fetchDetail = (id) => {
        if (!id) {
            showTextToast('未找到相关信息');
            return;
        }
        fetchExpertDetail({id:id}).then(res => {
            this.setState(prevState => ({
                zhuanjia : res.vo || {},
              }));
        });
    }
}
