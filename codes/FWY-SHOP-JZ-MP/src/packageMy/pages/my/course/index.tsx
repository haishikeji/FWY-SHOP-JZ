import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { getCourseAppointmentList } from '../../../../services/course';

import { View, Image, Text } from '@tarojs/components'

import NoDataComponent from '../../../../components/not-data';

export default class MyCourseList extends Component {

  constructor () {
    super(...arguments)
    this.state = {
        courseList: [],
    }
  }

  componentDidMount() {
    //   this.fetchList();
  }
  
  componentDidShow () {
    this.fetchList();
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '在线课程',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    return (
        <View className='my-course'>

            {
            (!this.state.courseList || this.state.courseList.length == 0) && 
                <NoDataComponent text='您还没有购买线上课程' img='http://bookclub-imgs.doule.me/imgs/common/pic-not-info.png' imgSize={'height: 200rpx; width: 200rpx;'} />
            }

            {
                Array.isArray(this.state.courseList) && <View>
                    <View className='title'>已购买（{this.state.courseList.length}）</View>
                    {
                        Array.isArray(this.state.courseList) && this.state.courseList.map((course, index) => (
                            <View className='content-wrap' key={index}>
                                <View className='lf-wrap' onClick={this.gotoNextPage.bind(this, course.type, course.id)}>
                                    <View className='lf-wrap-goods-left'>
                                        <Image src={course.coverPicUrl} mode='scaleToFill' />
                                    </View>
                                    <View className='lf-wrap-goods-right'>
                                        <Text className='name'>{course.name}</Text>
                                        <View className='time'>
                                            {course.gmtCreateTime}
                                        </View>
                                        <View className='btns'>
                                            <View className='text'>
                                                <Image src='http://bookclub-imgs.doule.me/imgs/online/icon-course-play.png' mode='widthFix' />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        ))
                    }
                </View>
            }

        </View>
    )
  }

    onChangeTabIndex = (index, e) => {
        if (e) e.stopPropagation();
        this.setState(prevState => ({
            tabIndex: index,
        }));
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

    gotoNextPage = (type, id, e) => {
        if (e) e.stopPropagation();
        Taro.navigateTo({
            url: '/pages/online/course-detail/index?id=' + id + '&type=' + type
        })
        // if (type == 'COURSE') {
        //     Taro.navigateTo({
        //         url: '/pages/online/play/index?id=' + id + '&type=' + type
        //     })
        // } else if (type == 'COURSE_SERIES') {
        //     Taro.navigateTo({
        //         url: '/pages/online/course-detail/index?id=' + id + '&type=' + type
        //     })
        // }
    }
    

    fetchList = () => {
        getCourseAppointmentList().then(res => {
            this.setState(prevState => ({
                courseList: res.list
            }));
        })
    }
}
