import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image, Picker } from '@tarojs/components'
import { AtAvatar, AtInput, AtList, AtListItem } from 'taro-ui'

import { babyEdit, babyAdd, fetchBabyDetail } from '../../../../services/baby';

import GlobalBtn from '../../../../components/global/globalBtn'

import { showTextToast } from '../../../../utils/util';

export default class MyBabyAddList extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            userInfo: {},
            name: '',
            birthday: '',
            gender: 'MALE',
        }
    }

    componentDidShow() {
        this.setState(prevState => ({
            userInfo: Taro.getStorageSync('member')
        }));
        let _id = this.$router.params.id;
        if (_id) {
            this.getBabyDetail(_id);
        }
    }

    config: Config = {
        navigationBarTitleText: '添加宝贝',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='my-baby-add'>

                <View className='top-wrap'>
                    
                    <View className='pay-avatar'>
                        {
                        this.state.userInfo && this.state.userInfo.profile ?
                            <AtAvatar circle image={this.state.userInfo.profile} size='large'></AtAvatar> :
                            <View className='nologin'><AtAvatar circle text='金' size='large'></AtAvatar></View>
                        }
                    </View>
                    
                    <View className='pay-desc'>
                        <Text className='nickname'>{this.state.userInfo ? this.state.userInfo.nickname : ''}</Text>
                    </View>
                    
                    <View className='ipt-wrap'>
                        <AtInput name='name' type='text' placeholder='请输入宝宝的名称' className='ipt-class' placeholderClass='ipt-placeholder'
                            value={this.state.name} onChange={this.bindInputChange.bind(this, 'name')}
                        />
                    </View>
                    <View className='ipt-wrap pt20'>
                        {/* <AtInput name='birthday' type='text' disabled className='ipt-class' placeholderClass='ipt-placeholder'
                            value={this.state.birthday} onChange={this.bindInputChange.bind(this, 'birthday')}
                        /> */}
                         <View className='pd-wrap'>
                            <Picker mode='date' className='date-check' onChange={this.onDateChange}>
                                <AtList>
                                    <AtListItem extraText={this.state.birthday} />
                                </AtList>
                            </Picker>
                            <View className='birthday-text'>{ !this.state.birthday && <Text>请选择宝宝年龄</Text> }</View>
                         </View>
                    </View>
                    
                    <View className='gender-wrap'>
                        <View className='at-row'>
                            <View className='at-col gender' onClick={this.bindInputChange.bind(this, 'gender', 'MALE')}>
                                { this.state.gender == 'MALE' && <Image className='baby-gender-checked' src='http://bookclub-imgs.doule.me/imgs/my/icon-chk-actived.png' mode='widthFix' /> }
                                <Image className='baby-gender-img' src='http://bookclub-imgs.doule.me/imgs/my/pic-baby-add-male.png' mode='widthFix' />
                                <View className='text'>男孩</View>
                            </View>
                            <View className='at-col at-col-2'></View>
                            <View className='at-col gender' onClick={this.bindInputChange.bind(this, 'gender', 'FEMALE')}>
                                { this.state.gender == 'FEMALE' && <Image className='baby-gender-checked' src='http://bookclub-imgs.doule.me/imgs/my/icon-chk-actived.png' mode='widthFix' /> }
                                <Image className='baby-gender-img' src='http://bookclub-imgs.doule.me/imgs/my/pic-baby-add-female.png' mode='widthFix' />
                                <View className='text'>女孩</View>
                            </View>
                        </View>
                    </View>

                </View>

                <View className='global-btn-wrap'>
                    <GlobalBtn text='添加' onBtnAction={this.addBaby} />
                </View>

            </View>
        )
    }

    backBabyListPage = () => {
      Taro.navigateBack()
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

    addBaby = e => {
        if (!this.state.name) {
            showTextToast('请填写名称');
            return;
        }
        if (!this.state.birthday) {
            showTextToast('请选择生日');
            return;
        }
        if (!this.state.gender) {
            showTextToast('请选择性别');
            return;
        }
        let params = {
            name: this.state.name,
            birthday: this.state.birthday,
            gender: this.state.gender
        }
        let _id = this.$router.params.id;
        if (_id) {
            params['id'] = _id;
            babyEdit(params).then(res => {
                showTextToast('修改成功');
                this.backBabyListPage();
            })
        } else {
            babyAdd(params).then(res => {
                showTextToast('添加成功');
                this.backBabyListPage();
            })
        }
    }
  
    getBabyDetail = (id) => {
      if (!id) {
          showTextToast('未找到宝宝信息');
          return false;
      }
      fetchBabyDetail({ id: id }).then(res => {
          this.setState(prevState => ({
              id: res.vo.id,
              name: res.vo.name,
              birthday: res.vo.birthday,
              gender: res.vo.gender
          }));
      })
    }

    onDateChange = e => {
      this.setState({
        birthday: e.detail.value
      })
    }

    bindInputChange = (name, value) => {
      var params = {};
      params[name] = value;
      this.setState(params);
      return value;
    }

}
