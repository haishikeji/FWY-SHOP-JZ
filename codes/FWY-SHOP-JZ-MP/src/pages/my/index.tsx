import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image, Text } from '@tarojs/components'
import { AtAvatar, AtButton } from 'taro-ui'

import { AuthLoginByApplet, logoutAPI } from '../../services/auth';
import { showTextToast } from '../../utils/util';

export default class Index extends Component {

  constructor () {
    super(...arguments)
    this.state = {
      userInfo: {},
      isSomeVip: false,
      vipNames: [],
      vipAdultNames: [],
      showMyOrder:false
    }
  }

  config: Config = {
    navigationBarTitleText: '我的',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  componentDidShow () {
    let _member = Taro.getStorageSync('member');
    let _flag = false;
    let _vipNames = [];
    let _vipAdultNames = [];
    if (_member) {
      if (_flag == false) {
        _flag = _member.isChildrenVip == 1;
      }
      if (_flag == false) {
        _flag = _member.isChildrenBorrowVip == 1;
      }
      if (_flag == false) {
        _flag = _member.isAdultBorrowVip == 1;
      }
      if (_flag == false) {
        _flag = _member.isSavingVip == 1;
      }
      if (_flag == false) {
        _flag = _member.childrenCardNum > 0;
      }

      if (_member.isChildrenVip == 1) {
        _vipNames.push('儿童馆会员');
      }
      if (_member.isChildrenBorrowVip == 1) {
        _vipNames.push('儿童馆借阅会员');
      }
      if (_member.isAdultBorrowVip == 1) {
        _vipAdultNames.push('成人馆借阅会员');
      }
      if (_member.isSavingVip == 1) {
        _vipAdultNames.push('储值卡会员');
      }
      if (_member.childrenCardNum > 0) {
        _vipNames.push('次卡会员');
      }
    }
    this.setState(prevState => ({
      userInfo: _member,
      vipNames: _vipNames,
      vipAdultNames: _vipAdultNames,
      isSomeVip: _flag
    }));
  }

  render () {
    return (
      <View className='my-page'>

        <View className='top-wrap'>
          <View className='lf-wrap'>
            <View className='lf-wrap-person-left'>
                {
                  this.state.userInfo && this.state.userInfo.profile ?
                      <AtAvatar circle image={this.state.userInfo.profile || 'http://bookclub-imgs.doule.me/imgs/my/pic-default-avatar.png'} size='large'></AtAvatar> :
                      <View className='nologin' onClick={this.gotoLogin}><AtAvatar circle image='http://bookclub-imgs.doule.me/imgs/my/pic-default-avatar.png' size='large'></AtAvatar></View>
                }
                { !this.state.isSomeVip && <Image className='pic-crown' src='http://bookclub-imgs.doule.me/imgs/my/icon-my-crown-normal.png' mode='scaleToFill' /> }
                { this.state.isSomeVip && <Image className='pic-crown' src='http://bookclub-imgs.doule.me/imgs/my/icon-my-crown-vip.png' mode='scaleToFill' /> }
            </View>
            <View className='lf-wrap-person-right'>
                { (!this.state.userInfo || !this.state.userInfo.nickname) && <AtButton circle onClick={this.gotoLogin} className='nickname-nologin-text'>
                    {
                      <Text className='person-name'>点击登录</Text>
                    }
                  </AtButton>
                }
                {/* { (!this.state.userInfo || !this.state.userInfo.nickname) && <AtButton circle openType='getUserInfo' className='avatar-login-btn' onGetUserInfo={this.login}>
                    {
                      <Text className='person-name'>点击登录</Text>
                    }
                  </AtButton>
                } */}
                { this.state.userInfo.nickname && <Text className='person-name'>{this.state.userInfo.nickname}</Text> }
                { !this.state.isSomeVip && <View className='person-nums'>尚未开通会员</View> }
                <View className='person-nums'>
                  {/* { this.state.userInfo.isReadVip == 1 && <Text>阅读会员</Text> } */}
                  {/* { (this.state.userInfo.isReadVip == 1 && this.state.userInfo.isCourseVip == 1) && <Text> + 课程会员</Text> } */}
                  {/* { (this.state.userInfo.isReadVip == 0 && this.state.userInfo.isCourseVip == 1) && <Text>课程会员</Text> } */}

                  {
                    Array.isArray(this.state.vipNames) && this.state.vipNames.map((vipName, index) => {
                      return (
                        <View>{ vipName }</View>
                      )
                    })
                  }
                  {
                    Array.isArray(this.state.vipAdultNames) && this.state.vipAdultNames.map((vipName, index) => {
                      return (
                        <View>{ vipName }</View>
                      )
                    })
                  }
                </View>
            </View>

            
            <Image className='right-bag-pic' src='http://bookclub-imgs.doule.me/imgs/my/pic-my-bag.png' mode='scaleToFill' />

          </View>
          <View className='join-vip-wrap'>
            <Image className='right-bag-pic' src='http://bookclub-imgs.doule.me/imgs/my/pic-join-vip-bg.png' mode='scaleToFill' />
            <View className='infos'>
              <View className='tip'>{this.state.vipNames.length ? '会员权益畅享中' : '开通会员畅享免费特权'}</View>
              <View className='advantages'>
                { <View className='advantage-item'><Image src='http://bookclub-imgs.doule.me/imgs/my/pic-join-vip-1.png' mode='scaleToFill' />专家一对一</View> }
              </View>
            </View>
            {/* onClick={this.gotoSubPage.bind(this, 'my/vip/index')} */}
            <View className='btn'>  
              { this.state.vipNames.length && <Text>立即查看</Text> }
              { this.state.vipNames.length == 0 && <Text>开通会员</Text> }
            </View>
          </View>
        </View>

        { this.state.showMyOrder && 
          <View className='white-wrap'>
          <View className='btn-wrap'>
            <View className='title-wrap'>
              <View className='title'>我的订单</View>
              <View className='more-order-btn' onClick={this.gotoSubPage.bind(this, 'order/list/index')}>查看全部订单></View>
            </View>
            <View className='at-row my-order'>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'order/list/index?status=0')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-order-1.png' mode='scaleToFill' />
                </View>
                <Text className='btn-go-text'>待付款</Text>
              </View>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'order/list/index?status=1')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-order-2.png' mode='scaleToFill' />
                </View>
                <Text className='btn-go-text'>进行中</Text>
              </View>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'order/list/index?status=2')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-order-3.png' mode='scaleToFill' />
                </View>
                <Text className='btn-go-text'>已完成</Text>
              </View>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'order/list/index?status=3')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-order-4.png' mode='scaleToFill' />
                </View>
                <Text className='btn-go-text'>已取消</Text>
              </View>
              {/* <View className='at-col' onClick={this.gotoSubPage.bind(this, 'order/list/index?status=4')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-order-5.png' mode='scaleToFill' />
                </View>
                <Text className='btn-go-text'>退款</Text>
              </View> */}
            </View>
          </View>
        </View>
        }
        
        
        {/* <View className='white-wrap'>
          <View className='btn-wrap'>
            <View className='title-wrap un-line'>
              <View className='title'>常用工具</View>
            </View>
            <View className='at-row my-tool'>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/revert/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-tool-1.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>待归还</Text>
              </View>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/appointment/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-tool-2.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>我的预约</Text>
              </View>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/playhistory/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-tool-3.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>历史播放</Text>
              </View>
              <View className='at-col ' onClick={this.gotoSubPage.bind(this, 'my/course/index')}>
                <View className='at-col2'>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-tool-4.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text at-col2'>在线课程</Text>
              </View>
            </View>
          </View>
        </View> */}

        
        <View className='white-wrap'>
          <View className='btn-wrap'>
            <View className='title-wrap un-line'>
              <View className='title'>我的服务</View>
            </View>
            <View className='at-row my-service'>
              {/* <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/balance/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-1.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>余额</Text>
              </View> */}
              {/* <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/deposit/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-2.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>押金管理</Text>
              </View> */}
              {/* <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/baby-list/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-3.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>宝贝管理</Text>
              </View> */}
              {/* <View className='at-col' onClick={this.gotoPage.bind(this, 'address/list/index?source=my')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-4.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>地址管理</Text>
              </View> */}
            </View>
            <View className='at-row my-service row-line2'>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/coll/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-5.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>收藏</Text>
              </View>
              <View className='at-col contact-btn'>
                <button open-type='contact'>a</button>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-6.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>客服中心</Text>
              </View>
              <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/feedback/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-7.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>意见反馈</Text>
              </View>
              {/* <View className='at-col' onClick={this.gotoSubPage.bind(this, 'my/invitation/index')}>
                <View>
                  <Image src='http://bookclub-imgs.doule.me/imgs/my/icon-my-service-8.png' mode='widthFix' />
                </View>
                <Text className='btn-go-text'>邀请好友</Text>
              </View> */}
            </View>
          </View>
        </View>


        { (this.state.userInfo && this.state.userInfo.id) && <View className='logout-btn' onClick={this.logout.bind(this)}>
          退出登录
        </View> }


      </View>
    )
  }

  gotoPage = (url, e) => {
    e.stopPropagation();
    Taro.navigateTo({
      url: '/pages/' + url
    })
  }

  gotoLogin = () => {
    Taro.reLaunch({
      url: "/packageMy/pages/auth/login/index"
    });
  }

  gotoSubPage = (url, e) => {
    if (e) e.stopPropagation();
    Taro.navigateTo({
      url: '/packageMy/pages/' + url
    })
  }

  login = (e) => {
    Taro.showLoading({
      title: '正在登录中...',
      mask: true
    })
    Taro.login({
      success: (res) => {
        console.log('res: ', res);
        if (res.code) {
          let { nickName, avatarUrl } = e.detail.userInfo;
          AuthLoginByApplet({ code: res.code, nickname: nickName, profile: avatarUrl, platform: 'WX' }).then(wxRes => {
            // debugger;
            // if (wxRes.code == 10000) {
              // this.reg(res.code);
            // } else if (wxRes.code == 0) {
              showTextToast('登录成功');
              Taro.setStorageSync('token', wxRes.token);
              Taro.setStorageSync('member', wxRes.member);

              let _flag = false;
              let _vipNames = [];
              let _vipAdultNames = [];
              if (wxRes.member) {
                if (_flag == false) {
                  _flag = this.state.userInfo.isChildrenVip == 1;
                  _vipNames.push('儿童馆会员');
                }
                if (_flag == false) {
                  _flag = this.state.userInfo.isChildrenBorrowVip == 1;
                  _vipNames.push('儿童馆借阅会员');
                }
                if (_flag == false) {
                  _flag = this.state.userInfo.isAdultBorrowVip == 1;
                  _vipAdultNames.push('成人馆借阅会员');
                }
                if (_flag == false) {
                  _flag = this.state.userInfo.isSavingVip == 1;
                  _vipAdultNames.push('储值卡会员');
                }
                if (_flag == false) {
                  _flag = this.state.userInfo.childrenCardNum > 0;
                  _vipNames.push('次卡会员');
                }
              }
              this.setState(prevState => ({
                userInfo: wxRes.member,
                vipNames: _vipNames,
                vipAdultNames: _vipAdultNames,
                isSomeVip: _flag
              }));

              setTimeout(() => {
                Taro.hideLoading();
              }, 1000)
            // } else {
              // showTextToast(wxRes.msg);
            // }
          })
        } else {
          showTextToast('登录失败');
          setTimeout(() => {
            Taro.hideLoading();
          }, 1000)
        }
      },
      fail: () => {
        showTextToast('登录失败');
        setTimeout(() => {
          Taro.hideLoading();
        }, 1000)
      }
    })
  }

  logout = (e) => {
    logoutAPI({ token: Taro.getStorageSync('token') }).then(res => {
      Taro.clearStorage();
      showTextToast('退出成功');
      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/product/index'
        });
      }, 1000)
    }).catch(err => {
      Taro.clearStorage();
      showTextToast('退出成功');
      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/product/index'
        });
      }, 1000)
    })
  }

}
