
import Taro, { Component, Config } from '@tarojs/taro';
import { View, Button, Image } from '@tarojs/components';
import { showTextToast } from '../../../../utils/util';

import { AtInput } from 'taro-ui'

import { sendSms, execBindPhone, memberRefreshInfo } from '../../../../services/auth';

import GlobalBtn from '../../../../components/global/globalBtn'

import './index.scss';

class BindPhonePage extends Component {

    config: Config = {
        navigationBarTitleText: '绑定手机号',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    state = {
        phone: '',
        valicode: '',
        code_ts: '获取验证码',
        show_btn: true,
        count: 60,
        platform: '',
        userInfo: {},
    }

    componentDidMount() {
        let _member = Taro.getStorageSync('member');
        this.setState(prevState => ({
            userInfo: _member
        }));
    }

    bindPhone = (e) => {
        if (this.state.phone === '' || !(/^1[3456789]\d{9}$/.test(this.state.phone))) {
            showTextToast('请输入正确的手机号码');
        } else if (!this.state.valicode) {
            showTextToast('请输入正确的验证码');
            return;
        }
        Taro.showLoading({
            title: '绑定手机号码中...',
            mask: true
        })
        execBindPhone({ phone: this.state.phone, vcode: this.state.valicode }).then(() => {
            showTextToast('绑定手机号码成功.');
            memberRefreshInfo({}).then(detailRes => {
                Taro.setStorageSync('member', detailRes.member);
                setTimeout(() => {
                    Taro.hideLoading();
                    Taro.reLaunch({
                        url: '/pages/product/index'
                    })
                }, 500);
            })
        }).catch((err) => {
            showTextToast('绑定手机号码失败');
            setTimeout(() => {
                Taro.hideLoading();
            }, 500);
        });
    }
    
    getCode = (e) => {
        if (this.state.phone === '' || !(/^1[3456789]\d{9}$/.test(this.state.phone))) {
            showTextToast('请输入正确的手机号码');
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

    render() {

        let { userInfo } = this.state;

        return (
            <View className='bind-phone-container'>
                <Image src={ userInfo.profile } className='avatar-logo' mode="aspectFill" />
                <View className='avatar-name-title'>{ userInfo.nickname || '未登录' }</View>
                <View className='avatar-name-tip'>为了您的账号安全请绑定手机号</View>

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
                    <GlobalBtn text='确认绑定' onBtnAction={this.bindPhone} />
                </View>

            </View>
        );
    }
}
export default BindPhonePage;