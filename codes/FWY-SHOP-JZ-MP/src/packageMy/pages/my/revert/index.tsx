import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Text, Image } from '@tarojs/components'
import { getBookBorrowList } from '../../../../services/book';

import NoDataComponent from '../../../../components/not-data';

import { AtTabs } from 'taro-ui'
import classNames from 'classnames'

export default class OrderList extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
        tabIndex: 0,
        borrows: [],
        tabList: [{ title: '待归还', id: 0 }, { title: '已还', id: 1 }],
    }
  }

  componentDidMount() {
    //   this.fetchList();
  }
  
  componentDidShow () {

    let _currentPages = Taro.getCurrentPages();
    if (_currentPages && _currentPages.length >= 1) {
        let currPage = _currentPages[_currentPages.length - 1];
        if (currPage.data.status || currPage.data.status == -1) {
            this.$router.params.status = currPage.data.status == -1 ? '' : currPage.data.status;
        }
    }

    if (this.$router.params.status) {
        let _index = this.state.tabList.findIndex((item) => item.id == this.$router.params.status);
        if (_index != -1) {
            this.setState(prevState => ({
                tabIndex: _index
            }));
        }
    } else {
    }
    this.fetchBorrowList(0);
  }

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '待归还',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
  }

  render () {
    return (
        <View className='order-revert'>

            <AtTabs className='card-tabs' current={this.state.tabIndex} tabList={this.state.tabList} onClick={this.onChangeTabIndex.bind(this)}>
            </AtTabs>

            { (!this.state.borrows || this.state.borrows.length == 0) && 
                <View className='no-data-wrap'><NoDataComponent text={ this.state.tabIndex == 0 ? '暂无待归还数据！' : '暂无已归还数据！' } isFull={false} imgSize={'height: 200rpx; width: 200rpx; margin-top: 350rpx;'} img='http://bookclub-imgs.doule.me/imgs/common/pic-not-order.png' /></View>
            }

            {
                Array.isArray(this.state.borrows) && this.state.borrows.map((borrow, index) => {
                    return (
                        <View className='content-wrap' key={index}>
                            <View className='lf-wrap' onClick={this.gotoPage.bind(this, 'book-detail/index?id=' + borrow.book.id + '&group=0&isBuy=false')}>
                                <View className='lf-wrap-goods-left'>
                                    <Image src={borrow.book.coverPicUrl} mode='widthFix' />
                                </View>
                                <View className='lf-wrap-goods-right'>
                                    <Text className='name'>{borrow.book.name}</Text>
                                    <View className="tags">
                                        {
                                            borrow.book.convertShowTags.map((tag, index) => (
                                                <View className={ classNames('tag', tag.type == 'age' ? 'orange' : 'green') } key={index} >{tag.name || tag}</View>
                                            ))
                                        }
                                    </View>
                                </View>
                            </View>
                        </View>
                    )
                })
            }
            
        </View>
    )
  }

    onChangeTabIndex = (index, e) => {
        if (e) e.stopPropagation();
        this.setState(prevState => ({
            tabIndex: index,
        }));
        this.fetchBorrowList(index);
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

    fetchBorrowList = (status) => {
        this.setState(prevState => ({
            borrows: []
        }));
        getBookBorrowList({ status: status }).then(res => {
            res.list.map(item => {
                let book = item.book;
                let _showTags = [];
                if (book.showTags) {
                    _showTags = book.showTags.split(',');
                }
                if (book.ages && book.ages.length) {
                    let _ageArrs = [];
                    book.ages.map(age => {
                        _ageArrs.push({
                            type: 'age',
                            name: age.name
                        })
                    });
                    _showTags = [ ..._ageArrs, ..._showTags ];
                }
                book['convertShowTags'] = _showTags;
            })
            this.setState(prevState => ({
                borrows: res.list
            }));
        })
    }
  
}
