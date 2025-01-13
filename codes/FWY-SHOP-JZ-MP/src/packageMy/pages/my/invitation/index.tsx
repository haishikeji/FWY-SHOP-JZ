import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'

import { AtIcon } from 'taro-ui'

import { findShareFriend } from '../../../../services/invitation';

import GlobalBtn from '../../../../components/global/globalBtn'

export default class OrderList extends Component {

  constructor () {
    super(...arguments)
    this.state = {
      friendCount: 0,
    }
  }

  componentDidMount() {
      this.fetchFriendCount();
  }
  
  componentDidShow () {

  }

  config: Config = {
    navigationBarTitleText: '邀请好友',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {

    let { friendCount } = this.state;

    return (
        <View className='my-invitation-page'>

            <View className="bg-wrap">
                <Image src='http://bookclub-imgs.doule.me/imgs/invitation/icon-invitation-bg.png' mode='widthFix' />
            </View>
                    
            <View className='share-result'>
                <View className='left'>
                  <View className="title" onClick={this.gotoSubPage.bind(this, 'my/invitation-friend/index')}>邀请的好友 <Text className='red'>{friendCount}</Text>人<AtIcon value='chevron-right' size='18' color='#52D5AA'></AtIcon></View>
                  {/* <View className="nums">1人</View> */}
                </View>
                <View className='right'>
                  <View className="title" onClick={this.gotoSubPage.bind(this, 'my/invitation-reward/index')}>奖励记录<AtIcon value='chevron-right' size='18' color='#52D5AA'></AtIcon></View>
                  {/* <View className="nums">-</View> */}
                </View>
            </View>
                    
            <View className='tips-wrap'>
              会员每邀请好友加入会员，赠送会员大礼-<View className='green' onClick={this.gotoSubPage.bind(this, 'my/invitation-rule/index')}>查看详情</View>
            </View>

            <View className='global-btn-wrap'>
                <GlobalBtn text='邀请好友' onBtnAction={this.gotoSubPage.bind(this, 'my/invitation-share/index')} />
            </View>

        </View>
    )
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

    fetchFriendCount = () => {
      findShareFriend({ pageNum: 1, pageSize: 1, noJump: true }).then(res => {
          this.setState(prevState => ({
            friendCount: res.pageInfoParam.totalNum
          }));
      })
    }
  
}
