import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Swiper, SwiperItem, Image, Button } from '@tarojs/components'
import { getCommonShareQrcode, getMappingByTypeAndCode } from '../../../../services/common';
import { fetchAdvertShowBanners } from '../../../../services/banner';
import { fetchEstimateDetail} from '../../../../services/estimate';

import classNames from 'classnames'

import GlobalBtn from '../../../../components/global/globalBtn'
import { showTextToast } from '../../../../utils/util';

export default class OrderList extends Component {

  constructor() {
    super(...arguments)
    this.state = {
      id:null,
      result:{},
      swiperIndex: 0,
      rpx: 0,
      shareText: '',
      banners: [],
      userInfo: {},
      canvasTextHeight: 10,
      bg_w: 0,
      bg_h: 0,
      currY:0
    }
  }

  onShareAppMessage = () => {
      return {
          title: '建材服务商城',
          path: '/pages/adult/index?shareCode=' + this.state.userInfo.shareCode
      };
  }

  componentDidMount() {
    //   this.fetchList();
    //获取屏幕宽度，获取自适应单位
    Taro.getSystemInfo({
      success: (res) => {
        this.setState(prevState => ({
          rpx: res.windowWidth / 750,
          bg_w : res.windowWidth / 750 * 796,
          // 图片高度
          bg_h : res.windowWidth / 750 * 1412,
        }));
      },
    })
  }

  componentDidShow() {
    this.fetchDetail(this.$router.params.id);
  }

  config: Config = {
    navigationBarTitleText: '邀请好友',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render() {

    let { swiperIndex, shareText } = this.state;

    return (
      <View className='my-invitation-page'>

        <View style='text-align: center'>
          {/* <canvas style="width: 398rpx; height: 706rpx; margin: 0px auto;" canvas-id="firstCanvas"></canvas> */}
          <Canvas  className='poster' canvasId='poster' style='width: 796rpx; height: 1412rpx;'/>
         {/*  <canvas style="width: 796rpx; height: 1412rpx; margin: 0px auto; position: absolute; left: 10000rpx" canvas-id="poster"></canvas> */}
        </View>
        <View className='global-btn-wrap'>
          <View className='at-row'>
            <View className='at-col'>
               <Button type='primary' className='share-btn' openType="contact">
                <GlobalBtn text='咨询专家' />
              </Button>
            </View>
            <View className='at-col at-col-2'>
              &nbsp;
            </View>
            <View className='at-col'>
              <GlobalBtn text='保存到相册' onBtnAction={this.save.bind(this)} />
            </View>
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
    fetchEstimateDetail({id:id}).then(res => {
        if(res.vo){
          this.drawList(res.vo)
        }
    });
  }
  // 绘画Canvas-分享图列表
  drawList  = (data) =>  {
    let i = this.state.canvasTextHeight
    let currY = 0;
    let _result = data.result
   // TODO 图片
    this.ImageInfo('http://zycimg.106tec.com/weapp-standard-back.jpg').then(res => {
        // 图片的x坐标
        let bg_x = 0;
        // 图片的y坐标
        let bg_y = 0;
        // 图片宽度
        let bg_w = this.state.bg_w 
        // 图片高度
        let bg_h = this.state.bg_h 
        // 图片圆角
        let bg_r = 10;

        // 获取画布
        const cvsCtx = Taro.createCanvasContext('poster', this)
        // 绘制背景底图
        cvsCtx.drawImage(res.path, bg_x, bg_y, bg_w, bg_h)
        cvsCtx.restore()
        cvsCtx.draw(true)
        cvsCtx.font = 'normal bold 25px sans-serif';
        cvsCtx.setFillStyle('#000')
        cvsCtx.fillText('真 优 材 空 气 预 评 估 详 情', 40, 40, 400)
        currY = 40;
        currY = currY + 60
        cvsCtx.font = 'normal bold 25px sans-serif';
        if (_result == '合格') {
          cvsCtx.setFillStyle('#009900')
          cvsCtx.fillText(_result, 180, currY, 120)
        }else {
          cvsCtx.setFillStyle('#FF0000')
          cvsCtx.fillText(_result, 180, currY, 120)
        }
        currY = currY + 40
        cvsCtx.font = 'normal lighter 12px sans-serif'
        cvsCtx.setFillStyle('#941D11')
        cvsCtx.fillText('材料', 23, currY, 120)
        cvsCtx.fillText('甲醛值', 203, currY, 120)
        cvsCtx.fillText('百分比', 281, currY, 120)
        let  materialList = data.materialList || []
        for (let b = 0; b < materialList.length; b++) {
          currY = currY + 38;
          cvsCtx.font = 'normal bold 15px sans-serif';
          cvsCtx.setFillStyle('#cc6633')
          cvsCtx.fillText(materialList[b].materialName, 23, currY, 120)
          cvsCtx.setFillStyle('#cc6633')
          cvsCtx.fillText(materialList[b].nongduResult || materialList[b].hchoCalResultDesc, 208, currY, 120)
          cvsCtx.setFillStyle('#cc6633')
          if (materialList[b].hchoCalResultPresent) {
            cvsCtx.fillText(`${materialList[b].hchoCalResultPresent}%`, 285, currY, 120)
          }
          
          if (currY>bg_h-250) {
            break;
          }
        }
      if (currY> bg_h-250) {
        currY = currY + 50
      }else{
        currY = bg_h-250
      }
      let cps = 0
      this.ImageInfo('https://zycapi.106tec.com/img/logo.png').then(data => {
        cvsCtx.drawImage(data.path, 10, currY, 60, 60)
        cvsCtx.draw(true)
      })
      this.ImageInfo('https://zycapi.106tec.com/img/gongzhonghao.png').then(data => {
        cvsCtx.drawImage(data.path, 80, currY, 60, 60)
        cvsCtx.draw(true)
      })
      this.ImageInfo('https://zycapi.106tec.com/img/weapp_qr.jpg').then(data => {
        cvsCtx.drawImage(data.path, 150,currY, 60, 60)
        cvsCtx.draw(true)
      })
      cvsCtx.font = 'normal lighter 12px sans-serif'
      /* cvsCtx.setFillStyle('#941D11')
      cvsCtx.fillText('长按识别小程序码', 80, i + 385, 120) */
      cvsCtx.stroke()
      cvsCtx.draw(true)
      
    })
    
    
  }
// 获得canvas图片信息
ImageInfo(path: any) {
  return new Promise((resolve, reject) => { // 采用异步Promise保证先获取到图片信息才进行渲染避免报错
    Taro.getImageInfo(
      {
        src: path,
        success: function (res) {
          resolve(res)
        },
        fail: function (res) {
          reject(res)
        }
      }
    )
  })
}

// 保存图片
saveImage(imgSrc: any) {
  Taro.getSetting({
    success() {
      Taro.authorize({
        scope: 'scope.writePhotosAlbum', // 保存图片固定写法
        success() {
          // 图片保存到本地
          Taro.saveImageToPhotosAlbum({
            filePath: imgSrc, // 放入canvas生成的临时链接
            success() {
              Taro.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            }
          })
        },
        fail() {
          Taro.showToast({
            title: '您点击了拒绝微信保存图片，再次保存图片需要您进行截屏哦',
            icon: 'none',
            duration: 3000
          })
        }
      })
    }
  })
}

// 点击保存图片生成微信临时模板文件path
save() {
  const that = this
  setTimeout(() => {
    Taro.canvasToTempFilePath({ // 调用小程序API对canvas转换成图
      x: 0, // 开始截取的X轴
      y: 0, // 开始截取的Y轴
      width: this.state.bg_w , // 开始截取宽度
      height: this.state.bg_h,  // 开始截取高度
      destWidth: 1065,  // 截取后图片的宽度（避免图片过于模糊，建议2倍于截取宽度）
      destHeight: 1905, // 截取后图片的高度（避免图片过于模糊，建议2倍于截取宽度）
      canvasId: 'poster', // 截取的canvas对象
      success: function (res) { // 转换成功生成临时链接并调用保存方法
        that.saveImage(res.tempFilePath)
      },
      fail: function (res) {
        console.log('绘制临时路径失败')
      }
    })
  }, 100) // 延时100做为点击缓冲，可以不用
}
}
