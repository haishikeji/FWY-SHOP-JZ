import Taro, { Component, Config, removeStorage } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image,Button,Picker } from '@tarojs/components'
import {  AtInput,AtInputNumber,AtCheckbox, AtButton,AtDrawer,AtList, AtListItem,AtIcon ,AtToast  } from 'taro-ui'
import { addToEstimate,fetchTypeList} from '../../../../services/estimate';
import Api from '../../../../configs/api';

import { showTextToast } from '../../../../utils/util';
import jump from '../../../../utils/jump';
import classNames from 'classnames'
import wxDiscode from 'src/components/taroWxParse/wxParse/wxDiscode';

export default class MorePage extends Component {

    constructor() {
        super(...arguments)
        this.state = {
            id:null,
            name:null,
            city:null,
            buildTypeCheckedList:['1'],
            hasFurnitureCheckedList:['1'],
            temp30CheckedList:['lt'],
            ventilateCheckedList: [],
            fileName : '',
            filePath: '',
            result:'',
            isSuccess:false,
            materialList:[],
            drawerShow:false,
            cailiaozhonglei:[],
            selectorChecked: '请选择材料种类',
            drawer_cailiaoType:"",
            drawer_cailiaoName:"",
            drawer_hcho_value:"",
            drawer_mianji:1,
            cailiao:[],
            spaceVolume:1
        }
    }

    componentWillMount() {
        let token = Taro.getStorageSync('token');
        console.log("token: "+token)
        if (!token) {
            Taro.showToast({
                title: '请先登录',
                icon:"none"
              })
            // 切换到登录页面
            setTimeout(() => {
              Taro.switchTab({
                url: '/pages/my/index'
              });
            }, 1000);
        }
    }

    componentDidShow() {
        this.fetchTypeList();
    }

    config: Config = {
        navigationBarTitleText: '空气质量评估',
        navigationBarBackgroundColor: '#fff',
        navigationBarTextStyle: 'black',
    }

    render() {
        return (
            <View className='bank-card-add'>
                <View className='content-wrap'>
                    <View className='form-wrap'>
                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>项目名称:</Text>
                                </View>
                            </View>
                            <View className='content at-row'>
                                <View className='real-width'>
                                    <AtInput
                                        name='name'
                                        type='text'
                                        placeholder='请输入项目名称'
                                        className='ipt-class'
                                        placeholderClass='ipt-placeholder'
                                        value={this.state.name}
                                        onChange={this.bindInputChange.bind(this, 'name')}
                                    />
                                </View>
                            </View>
                        </View>
                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>项目所在城市:</Text>
                                </View>
                            </View>
                            <View className='content at-row'>
                                <View className='real-width'>
                                    <AtInput
                                        name='city'
                                        type='text'
                                        placeholder='请输入项目所在城市'
                                        className='ipt-class'
                                        placeholderClass='ipt-placeholder'
                                        value={this.state.city}
                                        onChange={this.bindInputChange.bind(this, 'city')}
                                    />
                                </View>
                            </View>
                        </View>
                        
                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>建筑类型(单选):</Text>
                                </View>
                            </View>
                            <View className='content at-row'>
                                <View className='real-width'>
                                    <AtCheckbox
                                        options={[
                                        { label: 'I类民用建筑（住宅、医院、学校、养老院）', value: '1' },
                                        { label: 'II类民用建筑（办公楼）', value: '2' }
                                        ]}
                                        selectedList={this.state.buildTypeCheckedList}
                                        onChange={this.handleRadioChange.bind(this,'buildTypeCheckedList')}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>装修后是否放家具(单选)：</Text>
                                </View>
                            </View>
                            <View className='content at-row'>
                                <View className='real-width'>
                                    <AtCheckbox
                                        options={[
                                        { label: '是', value: '1' },
                                        { label: '否', value: '0' }
                                        ]}
                                        selectedList={this.state.hasFurnitureCheckedList}
                                        onChange={this.handleRadioChange.bind(this,'hasFurnitureCheckedList')}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>环境温度(单选):</Text>
                                </View>
                            </View>
                            <View className='content at-row'>
                                <View className='real-width'>
                                    <AtCheckbox
                                        options={[
                                        { label: '30℃以下', value: 'lt' },
                                        { label: '30℃以上', value: 'gt' }
                                        ]}
                                        selectedList={this.state.temp30CheckedList}
                                        onChange={this.handleRadioChange.bind(this,'temp30CheckedList')}
                                    />
                                </View>
                            </View>
                        </View>

                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>通风情况(多选):</Text>
                                </View>
                            </View>
                            <View className='content at-row'>
                                <View className='real-width'>
                                    <AtCheckbox 
                                        options={[
                                        { label: '自然通风(0.5次/h)', value: 'natural' },
                                        { label: '机械通风(0.5次/h)', value: 'mechanical' }
                                        ]}
                                        selectedList={this.state.ventilateCheckedList}
                                        onChange={this.handleChange.bind(this,'ventilateCheckedList')
                                        }
                                    />
                                </View>
                            </View>
                        </View>
                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>封闭房间体积（仅数字）:</Text>
                                </View>
                            </View>
                            <View className='content at-row' style="padding-top:10px">
                                <View className='real-width'>
                                （计算方法：长×宽×高）
                                <AtInputNumber
                                    type="number"
                                    min={0}
                                    max={9999999}
                                    step={1}
                                    width={180}
                                    value={this.state.spaceVolume}
                                    onChange={this.handleChange.bind(this,'spaceVolume')}
                                    /> <Text style="padding-left:5px;">m³</Text>
                                </View>
                            </View>
                        </View>
                        <View className='form-item'>
                            <View className='at-row title'>
                                <View className='at-col at-col-8'>
                                    <Text className='red'>*</Text>
                                    <Text>装修材料:</Text>
                                </View>
                            </View>
                            <View className='content' style="padding-top:10px">
                            {
                                this.state.cailiao && this.state.cailiao.map((item, index) => {
                                    return (
                                        <View className="cailiao-item">
                                            <View className="icon" onClick={this.bindRemoveCailiao.bind(this,index)}><AtIcon value='subtract-circle' size='24' color='#F00'></AtIcon></View>
                                            <View className="name">{item.materialName} ({item.reportHchoValue} * {item.materialArea})</View>
                                        </View>
                                    )
                                })
                            }
                            </View>
                        </View>
                        <View className="filter-btn-list at-row">
                            <View className="btn at-col "><Button type='primary' openType='getUserInfo' className='no-border' onClick={this.addCailiaoDrawer.bind(this)}>添加装修材料</Button></View>
                            <View className="btn at-col"><Button type='primary' openType='getUserInfo' className='no-border' onClick={this.submit.bind(this)}>计算并查看结果</Button></View>
                        </View>
                    </View>
                </View>
                <View>

                </View>
                <View>
                    <AtDrawer
                        show={this.state.drawerShow}
                        mask
                        right
                        width="300px"
                        onClose={this.drawerOnClose.bind(this)}
                        >
                        <View className='drawer-content-wrap'>
                        <View>添加材料</View>
                        <View className='form-wrap'>
                            <View className='form-item'>
                            <View className='at-row title'>
                                    <View className='at-col at-col-8'>
                                        <Text className='red'>*</Text>
                                        <Text>材料种类:</Text>
                                    </View>
                                </View>
                                <View className='content at-row'>
                                    <View className='real-width'>
                                        <Picker mode='selector' range={this.state.cailiaozhonglei} rangeKey="name" onChange={this.onChange4cailiaozhonglei}>
                                            <AtList>
                                            <AtListItem
                                                title={this.state.selectorChecked}
                                            />
                                            </AtList>
                                        </Picker>
                                    </View>
                                </View>
                            </View>
                            <View className='form-item'>
                                <View className='at-row title'>
                                    <View className='at-col at-col-8'>
                                        <Text className='red'>*</Text>
                                        <Text>材料名称:</Text>
                                    </View>
                                </View>
                                <View className='content at-row'>
                                    <View className='real-width'>
                                        <AtInput
                                            name='drawer_cailiaoName'
                                            type='text'
                                            value={this.state.drawer_cailiaoName}
                                            placeholder='请输入材料名称'
                                            className='ipt-class'
                                            placeholderClass='ipt-placeholder'
                                            onChange={this.bindInputChange.bind(this, 'drawer_cailiaoName')}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View className='form-item'>
                                <View className='at-row title'>
                                    <View className='at-col at-col-8'>
                                        <Text className='red'>*</Text>
                                        <Text>检测报告中甲醛值:</Text>
                                    </View>
                                </View>
                                <View className='content at-row' style="line-height:50px">
                                    <View className='real-width-70'>
                                        <AtInput
                                            name='drawer_hcho_value'
                                            type='text'
                                            value={this.state.drawer_hcho_value}
                                            placeholder='仅数字'
                                            className='ipt-class'
                                            placeholderClass='ipt-placeholder'
                                            onFocus={this.bindInputClear.bind(this)}
                                            onChange={this.bindInputChange.bind(this, 'drawer_hcho_value')}
                                        />
                                    </View>
                                    (mg/m³或mg/L)
                                </View>
                            </View>
                            <View className='form-item'>
                                <View className='at-row title'>
                                    <View className='at-col at-col-8'>
                                        <Text className='red'>*</Text>
                                        <Text>装修材料表面积㎡（仅数字）:</Text>
                                    </View>
                                </View>
                                <View className='content at-row'>
                                    <View className='real-width'>
                                       <AtInputNumber
                                            type="number"
                                            min={0}
                                            max={9999999}
                                            step={1}
                                            width={180}
                                            value={this.state.drawer_mianji}
                                            onChange={this.bindInputChange.bind(this,'drawer_mianji')}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View className='form-item'>
                                <View className="filter-btn-list at-row">
                                    <View className="btn at-col "><Button type='primary' openType='getUserInfo' className='no-border'  onClick={this.drawerOnClose.bind(this)}>取 消</Button></View>
                                    <View className="btn at-col"><Button type='primary' openType='getUserInfo' className='no-border' onClick={this.confirmDrawer.bind(this)}>确 认</Button></View>
                                </View>
                            </View>
                        </View>
                        </View>
                    </AtDrawer>
                </View>
            </View>
        )
    }

    bindInputChange = (name, value) => {
        var params = {};
        params[name] = value;
        this.setState(params);
        return value;
    }
    onChange4cailiaozhonglei = e => {
        this.setState({
          selectorChecked: this.state.cailiaozhonglei[e.detail.value].name
          drawer_cailiaoType : this.state.cailiaozhonglei[e.detail.value].typeCode
        })
      }
    bindInputClear = () => {
        this.setState(prevState => ({
            drawer_hcho_value:"",
        }));
    }
    drawerOnClose = () => {
        this.setState(prevState => ({
            drawerShow: false,
            selectorChecked:"",
            drawer_cailiaoType:"",
            drawer_cailiaoName:"",
            drawer_hcho_value:"",
            drawer_mianji:1,
        }));
    }
    handleRadioChange = (name, value) => {
        if(value.length == 0) return ;
        if(value.length > 1) value = value.slice(1);
        console.log(value)
        var params = {};
        params[name] = value;
        this.setState(params);
        return value;
    }
    handleChange = (name, value) => {
        var params = {};
        params[name] = value;
        this.setState(params);
        return value;
    }
    gotoSubPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/subpages/pages/' + url
        })
    }
    gotoSwitchPage = (url, e) => {
        if (e) e.stopPropagation();
        Taro.switchTab({
            url: '/pages/' + url
        })
    }
    addCailiaoDrawer = ()=>{
        this.setState({
            drawerShow:true
        })
    }
    bindRemoveCailiao =(index,e) => {
        
        let array = this.state.cailiao
        array.splice(index,1)
        this.setState(()=>{
            cailiao: array
        },()=>{
            console.log(this.state.cailiao)
        })
    }
    submit = () => {
        var _param = {};
        _param["name"] = this.state.name;
        _param["city"] =  this.state.city;
        if (!this.state.name) {
            Taro.showToast({
                title: '请填写项目名称',
                icon:"none"
              })
              return;
        }
        if (!this.state.city) {
            Taro.showToast({
                title: '请填写项目所在城市',
                icon:"none"
              })
              return;
        }
        if(this.state.buildTypeCheckedList.length < 1){
            Taro.showToast({
                title: '请选择建筑类型',
                icon:"none"
              })
              return;
        }else{
            _param["buildType"] = this.state.buildTypeCheckedList[0];
        }

        if(this.state.hasFurnitureCheckedList.length < 1){
            Taro.showToast({
                title: '请选择装修后是否放家具',
                icon:"none"
              })
              return;
        }else{
            _param["hasFurniture"] = this.state.hasFurnitureCheckedList[0];
        }

        if(this.state.temp30CheckedList.length < 1){
            Taro.showToast({
                title: '请选择环境温度',
                icon:"none"
              })
              return;
        }else{
            _param["temp30"] = this.state.temp30CheckedList[0];
        }

        if(this.state.ventilateCheckedList.length < 1){
        }else{
            _param["ventilate"] = this.state.ventilateCheckedList.join(",");
        }
        if(this.state.spaceVolume <= 1){
            Taro.showToast({
                title: '请填写封闭房间体积',
                icon:"none"
              })
              return;
        }else{
            _param["spaceVolume"] = this.state.spaceVolume;
        }
        if(this.state.cailiao.length < 1){
            Taro.showToast({
                title: '请添加材料',
                icon:"none"
              })
            return;
        }else{
            let _array = this.state.cailiao;
            _array.forEach(tem => {
                tem.spaceVolume =  this.state.spaceVolume;
            })
            _param["materialList"] = _array;
        }
        let that = this
        Taro.showModal({
            title: '提示',
            content: '确认已提交全部装修材料信息？',
            success: function (res) {
              if (res.confirm) {
                Taro.showLoading({
                    title: '正在计算...',
                    mask: true
                  })
                addToEstimate(_param).then(res => { 
                    Taro.hideLoading(); 
                    if(res.vo){
                        console.log("==============================")
                        that.gotoSubPage('estimate/resultinfo/index?id='+res.vo.id,null)
                    }else{
                     Taro.showToast({
                         title: '评估失败',
                         icon:"none"
                       })  
                    }
                 });
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        
    }
    fetchTypeList = () => {
        fetchTypeList().then(res => {
          let data = res.list || []
          console.log(data)
          this.setState(prevState => ({
            cailiaozhonglei: data
          }));
        });
    }
    confirmDrawer = () => {
        if (!this.state.drawer_cailiaoType) {
            Taro.showToast({
                title: '请选择材料种类',
                icon:"none"
              })
              return;
        }
        if (!this.state.drawer_cailiaoName) {
            Taro.showToast({
                title: '请填写材料名称',
                icon:"none"
              })
              return;
        }
        if (!this.isNumber(this.state.drawer_hcho_value)) {
            Taro.showToast({
                title: '甲醛值必须为数字',
                icon:"none"
              })
              return;
        }
        let obj = {};
        obj.typeCode=this.state.drawer_cailiaoType;
        obj.materialName = this.state.drawer_cailiaoName;
        obj.reportHchoValue = this.state.drawer_hcho_value;
        obj.materialArea = this.state.drawer_mianji;
        let array = this.state.cailiao;
        array.push(obj)
        this.setState({
            cailiao: array
        },()=>{
            console.log(this.state.cailiao)
            this.drawerOnClose();
        })
    }
    isNumber = (val) => {
        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if(regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    }
}
