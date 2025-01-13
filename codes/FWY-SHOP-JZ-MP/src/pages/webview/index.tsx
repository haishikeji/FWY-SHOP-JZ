import Taro, { Component, Config } from '@tarojs/taro'
import { View, WebView } from '@tarojs/components'
/**
 * // NOTE Taro 的 RN 端还未提供 WebView 组件，可以引入原生组件来解决
 * （备注：Taro v1.2.16 已支持，这块代码还是保留作为演示）
 *
 * Taro 有开启了 tree shaking，对于未用到的内容编译时会自动去除
 * 因此可以把相应端的内容都 import 进来，再根据环境进行调用即可
 *
 * 另外 1.2.17 版本有提供了统一接口方式 https://nervjs.github.io/taro/docs/envs.html
 * 可以参考 ./src/pages/user-login 中的实现
 */
import './index.scss'
 
export default class extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
      navigationBarBackgroundColor: '#cc9656',
      navigationBarTextStyle: 'white',
  }
 
  url = ''
  title = ''
 
  componentWillMount() {

    let _url = Taro.getRouteParams(this.$router, 'url')
    let _title = Taro.getRouteParams(this.$router, 'title')

    this.url = decodeURIComponent(_url || '')
    this.title = decodeURIComponent(_title || '')
    Taro.setNavigationBarTitle({ title: this.title })
  }
 
  render () {
    return (
      <View className='webview'>
          <WebView src={this.url} />
      </View>
    )
  }
}