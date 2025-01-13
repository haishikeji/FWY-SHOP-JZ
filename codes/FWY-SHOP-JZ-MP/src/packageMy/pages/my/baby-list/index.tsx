import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text } from '@tarojs/components'
import { AtSwipeAction } from 'taro-ui'

import { fetchBaby, deleteBaby } from '../../../../services/baby';

import { showTextToast } from '../../../../utils/util';

import NoDataComponent from '../../../../components/not-data';

export default class BabyList extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
        tabIndex: 0,
        babyList: [],
    }
  }

  componentDidMount() {
      this.fetchList();
  }
  
  componentDidShow () {
    this.fetchList();
  }

  config: Config = {
    navigationBarTitleText: '宝宝列表',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    return (
        <View className='baby-list'>

          {
            (!this.state.babyList || this.state.babyList.length == 0) && 
              <NoDataComponent text='还没有添加宝宝信息' btnText='添加宝宝' img='http://bookclub-imgs.doule.me/imgs/address/pic-not-address.png' onBtnAction={this.gotoAddPage} />
          }
          
          {
            Array.isArray(this.state.babyList) && this.state.babyList.map((item, index) => (
              <AtSwipeAction key={index} autoClose={true} onClick={this.handleSwipeActionClick.bind(this, item.id)} options={[
                  {
                      text: '取消',
                      style: {
                          backgroundColor: '#e8ecf8',
                          color: '#333'
                          // backgroundColor: '#6190E8'
                      }
                  },
                  {
                      text: '删除',
                      style: {
                          backgroundColor: '#FF4949',
                          color: 'white'
                      }
                  }
                ]}>
                <View className='content-wrap'>
                  <View className='baby-wrap' onClick={this.returnBack.bind(this, item)}>
                      <View className='baby-wrap-left'>
                          {/* <Image src='http://gold-shop-img.doule.me/images/order/submit/icon-address.png' /> */}
                          { item.gender == 'MALE' && <Image className='baby-gender-img' src='http://bookclub-imgs.doule.me/imgs/my/pic-baby-add-male.png' mode='widthFix' />}
                          { item.gender == 'FEMALE' && <Image className='baby-gender-img' src='http://bookclub-imgs.doule.me/imgs/my/pic-baby-add-female.png' mode='widthFix' />}
                      </View>
                      <View className='baby-wrap-center'>
                          <View>{item.name}</View>
                          {/* <Text className='phone'>{item.name}</Text> */}
                          <View className='baby'>
                              宝宝生日: <Text className='birthday'>{item.birthday || ''}</Text>
                          </View>
                      </View>
                      <View className='baby-wrap-right'>
                          <Image src='http://gold-shop-img.doule.me/images/address/icon-edit.png' onClick={this.editBaby.bind(this, item.id)} />
                      </View>
                  </View>
                </View>
              </AtSwipeAction>
            ))
          }

          {
            (this.state.babyList && this.state.babyList.length) && <View className='increase-baby' onClick={this.gotoAddPage}>
              <Text>添加宝宝</Text>
            </View>
          }
        </View>
    )
  }
  
  fetchList = () => {
    fetchBaby().then(res => {
      this.setState(prevState => ({
          babyList: res.list
      }));
    })
  }

  gotoAddPage = (e) => {
    Taro.navigateTo({
      url: '/packageMy/pages/my/baby-add/index'
    })
  }

  returnBack = (baby, e) => {
    Taro.navigateBack();
  }

  editBaby = (id, e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/packageMy/pages/my/baby-add/index?id=' + id
    })
  }

  delBaby = (id, e) => {
    deleteBaby({ id: id }).then(res => {
      showTextToast('删除成功');
      this.fetchList();
    }).then(() => {
      Taro.hideLoading();
    })
  }

  handleSwipeActionClick = (id, node, e) => {
    if (node && node.text == '删除') {
      Taro.showLoading({
          title: '正在删除地址',
          mask: true
      })
      this.delBaby(id, e);
    }
  }

}
