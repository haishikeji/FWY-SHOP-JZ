
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button, Image ,Picker } from '@tarojs/components';
import { showTextToast } from '../../../../utils/util';

import { AtInput, AtIcon,AtList, AtListItem } from 'taro-ui'

import { sendSms, AuthLoginByApplet } from '../../../../services/auth';

import GlobalBtn from '../../../../components/global/globalBtn'
import LogoImg from '../../../../assets/images/global/logo.png'

import './index.scss';

class RegPage extends Component {

    config: Config = {
        navigationBarTitleText: '注册',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    state = {
        phone: '',
        password: '',
        valicode: '',
        code_ts: '获取验证码',
        show_btn: true,
        count: 60,
        platform: '',
        showPwd: false,
        zhiyeList:[
          {name:'设计师',value:1},
          {name:'材料商',value:2},
          {name:'健康装修顾客',value:3},
        ],
        selectorChecked:'请选择职业',
        profession: ''
    }

    componentDidMount() {
    }

    componentDidHide() {
        Taro.removeStorageSync('gotoLogined');
    }

    componentWillUnmount() {
        Taro.removeStorageSync('gotoLogined');
    }

    wxReg = (e) => {
      if (!this.state.profession) {
        showTextToast('请选择职业');
        return;
      }
      if (!this.state.phone) {
        showTextToast('请输入正确的手机号码');
        return;
      } else if (!this.state.password) {
        showTextToast('请输入密码');
        return;
      } else if (!this.state.valicode) {
        showTextToast('请输入正确的验证码');
        return;
      }
  
      Taro.showLoading({
        title: '正在操作...',
        mask: true
      })
      Taro.login({
        success: (res) => {
          if (res.code) {
            let _shareCode = Taro.getStorageSync('shareCode');
            console.log('reg _shareCode: ', _shareCode);
            let { nickName, avatarUrl } = e.detail.userInfo;
            AuthLoginByApplet({ code: res.code, nickname: nickName, profile: avatarUrl, platform: 'WX', loginType: 'reg',
                phone: this.state.phone, password: this.state.password, vcode: this.state.valicode, shareCode: _shareCode,profession:this.state.profession }).then(wxRes => {
              showTextToast('注册成功');
              Taro.removeStorageSync('shareCode');
            //   Taro.setStorageSync('token', wxRes.token);
            //   Taro.setStorageSync('member', wxRes.member);
              setTimeout(() => {
                Taro.hideLoading();
                Taro.navigateBack({
                    delta: 1
                })
              }, 1000)
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

    getCode = (e) => {
        if (this.state.phone === '' || !(/^1[3456789]\d{9}$/.test(this.state.phone))) {
            showTextToast('请输入正确的手机号码');
        } else if (this.state.password === '' || this.state.password.length < 6 || this.state.password.length > 16) {
            showTextToast('密码格式不正确');
        } else {
            this.sendSms();
        }
    }

    sendSms() {
        Taro.showLoading({
            title: '验证码发送中',
            mask: true
        })
        setTimeout(() => {
            sendSms({ phone: this.state.phone }).then(() => {
                showTextToast('验证码已发送');
                let count = this.state.count
                // 这里写一个定时器就可以去更新灰色按钮的内容而且show_btn是false时会出现灰色按钮，当倒计时结束又变成可以触发的按钮
                const timer = setInterval(() => {
                    this.setState({
                        count: (count--),
                        show_btn: false,
                        code_ts: count + 'S重发'
                    }, () => {
                        if (count === 0) {
                            clearInterval(timer)
                            this.setState({
                                show_btn: true,
                                count: 60,
                                code_ts: '获取验证码'
                            })
                        }
                    })
                }, 1000)
            }).catch((err) => {
                showTextToast('验证码发送失败');
            }).then(() => {
                Taro.hideLoading()
            });
        }, 500);
    }

    bindInputChange = (name, value) => {
        var params = {};
        params[name] = value;
        this.setState(params);
        return value;
    }

    handleStartSee = (e) => {
      if (e) e.stopPropagation();
      this.setState({
        showPwd: true 
      })
    }
  
    handleEndSee = (e) => {
      if (e) e.stopPropagation();
      this.setState({
        showPwd: false 
      })
    }

    onChange = (e) =>{
      this.setState({
        selectorChecked: this.state.zhiyeList[e.detail.value].name,
        profession: this.state.zhiyeList[e.detail.value].value
      })
    }
    render() {
        return (
            <View className='reg-container'>
                <Image src={LogoImg} className='reg-logo' />
                <View className='reg-logo-title'>建材服务商城</View>
                <View className='real-width'>
                    <Picker mode='selector' range={this.state.zhiyeList} rangeKey="name" onChange={this.onChange}>
                    <AtList>
                      <AtListItem
                        title={this.state.selectorChecked}
                      />
                    </AtList>
                  </Picker>     
                </View>
                <View className='real-width'>
                    <AtInput
                        name='phone'
                        type='phone'
                        placeholder='请输入手机号'
                        className='ipt-class'
                        placeholderClass='ipt-placeholder'
                        value={this.state.phone}
                        onChange={this.bindInputChange.bind(this, 'phone')}
                    />
                </View>

                <View className='real-width pwd-width pwd'>
                    { !this.state.showPwd && <AtInput
                        name='password'
                        type='password'
                        placeholder='请输入6-16位的新密码'
                        className='ipt-class'
                        placeholderClass='ipt-placeholder'
                        value={this.state.password}
                        onChange={this.bindInputChange.bind(this, 'password')}
                    /> }
                    { this.state.showPwd && <AtInput
                        type='text'
                        className='ipt-class'
                        placeholderClass='ipt-placeholder'
                        value={this.state.password}
                    /> }
                    <View className='see' onTouchStart={this.handleStartSee.bind(this)}  onTouchEnd={this.handleEndSee.bind(this)}>
                      {/* <Image src='http://bookclub-imgs.doule.me/imgs/common/pic-logo.jpg' mode="aspectFill" /> */}
                      <AtIcon value='eye' size='22' color={ this.state.showPwd ? '#52D5AA' : '#999' }></AtIcon>
                    </View>
                </View>

                <View className='valicode-wrap'>
                    <View className='real-width valicode-ipt-wrap'>
                        <AtInput
                            clear
                            name='valicode'
                            type='number'
                            placeholder='请输入短信验证码'
                            className='ipt-class'
                            placeholderClass='ipt-placeholder'
                            value={this.state.valicode}
                            onChange={this.bindInputChange.bind(this, 'valicode')}
                        />
                    </View>
                    <View className='valicode-btn'>
                        <Button type='primary' openType='getUserInfo' className='no-border' disabled={!this.state.show_btn} onGetUserInfo={this.getCode}>{this.state.code_ts}</Button>
                    </View>
                </View>

                <View className='btn-wrap'>
                    <Button type='primary' openType='getUserInfo' className='wx-login-btn' onGetUserInfo={this.wxReg}>立即注册</Button>
                </View>

            </View>
        );
    }
}
export default RegPage;