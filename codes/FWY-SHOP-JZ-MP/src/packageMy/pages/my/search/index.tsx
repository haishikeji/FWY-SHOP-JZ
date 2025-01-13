import Taro, { Component, Config } from '@tarojs/taro'
import './index.scss'

import { View, Image } from '@tarojs/components'
import { AtTabs, AtSearchBar } from 'taro-ui'

import { showTextToast } from '../../../../utils/util';
import { getBookSearch } from '../../../../services/book';
import { getSearchHistoryByMember, getSearchHistoryGlobal } from '../../../../services/search';

// import classNames from 'classnames';

export default class Index extends Component {

  constructor () {
    super(...arguments)
    this.state = { 
      tabIndex: 0,
      tempKeyword: '',
      keyword: '',
      result: [],
      historys: [],
      ranks: [],
      tabList: [{ title: '借绘本', id: 0 }, { title: '买绘本', id: 1 }, { title: '买书', id: 2 }],
    //   tabList: [{ title: '借绘本', id: 0 }, { title: '买绘本', id: 1 }, { title: '线下课程', id: 2 }, { title: '线上课程', id: 3 }],
    }
  }
  
  componentDidShow () {
      if (this.$router.params.type) {
          let _tabIndex = this.state.tabIndex;
          if (this.$router.params.type == 'ADULT_BUY') {
            _tabIndex = 2
          }
          this.setState(prevState => ({
              tabIndex: _tabIndex,
          }), () => {
            this.fetchSearchHistoryByMember();
            this.fetchRanks(_tabIndex);
          });
      } else {
        this.fetchSearchHistoryByMember();
        this.fetchRanks(this.state.tabIndex);
      }
  }

  config: Config = {
    navigationBarTitleText: '搜索',
    navigationBarBackgroundColor: '#fff',
    navigationBarTextStyle: 'black',
    // navigationStyle: 'custom',
  }

  render () {

    let { keyword } = this.state;

    const topWrapStyle = {
        // paddingTop: Taro.$navBarMarginTop + 'px'
        paddingTop: '0px'
    }
    return (
      <View className='home-page'>

        <View className='top-wrap' style={topWrapStyle}>
          <View className='search-wrap'>
            {/* <View className='search-left'>
              <AtButton circle className='avatar-login-btn'>
                {
                  <Image className='top-avatar' src={this.state.userInfo.profile || 'http://bookclub-imgs.doule.me/imgs/header/icon-avatar.png'} mode='widthFix' />
                }
              </AtButton>
            </View> */}
            <View className='search-center'>

                <AtSearchBar
                    actionName='搜一下'
                    placeholder='请输入搜索关键字'
                    value={this.state.tempKeyword}
                    onChange={this.handleChange.bind(this)}
                    onClear={this.handleClear.bind(this)}
                    onActionClick={this.execSearch.bind(this)}
                />
              {/* <View className='search-ipt'> */}


                {/* <AtIcon value='search' size='14' color='#999'></AtIcon>小猪佩奇 */}
                {/* <AtInput name='value5' autoFocus={true} placeholder='请输入搜索关键字' clear={true} value={this.state.keyword} onChange={this.handleChange.bind(this)} /> */}
              {/* </View> */}
            </View>
            {/* <View className='search-right'>
              <Image className='top-notice' src='http://bookclub-imgs.doule.me/imgs/header/icon-notice.png' mode='widthFix' />
            </View> */}
          </View>
        </View>

        {/* <View style="height: 10px; background: #f4f4f4;"></View> */}

        { (!keyword && this.state.historys.length) && <View>
            <View className='title'>历史搜索</View>
            <View className='content-wrap'>
                <View className='history-wrap'>
                    {
                        Array.isArray(this.state.historys) && this.state.historys.map((history, index) => (
                            <View key={index} className='history-wrap-item' onClick={this.handleTagSearch.bind(this, history)}>{ history }</View>
                        ))
                    }
                </View>
            </View>
        </View> }

        <View>
            { !keyword && <View className='title'>热门搜索</View> }
            <View className='content-wrap'>

                <AtTabs className='card-tabs' current={this.state.tabIndex} tabList={this.state.tabList} onClick={this.onChangeTabIndex.bind(this)}>
                </AtTabs>
                <View className='search-result'>
                    {
                        Array.isArray(this.state.result) && this.state.result.map((book, index) => (
                            <View key={index} className='search-result-item' onClick={this.gotoPage.bind(this, book.id)}>{ book.name }</View>
                        ))
                    }
                </View>
                
                { (!this.state.result.length && this.state.ranks.length) && <View className='search-result'>
                    {
                        Array.isArray(this.state.ranks) && this.state.ranks.map((rank, index) => (
                            <View key={index} className='search-result-item' onClick={this.handleTagSearch.bind(this, rank.keyword)}>{ rank.keyword }</View>
                        ))
                    }
                </View> }
            </View>
        </View>
      </View>
    )
  }

  gotoPage = (id, e) => {
    if (e) e.stopPropagation();
    let _params = { };
    if (this.state.tabIndex == 0) {
        _params['group'] =  0;
        _params['buyOrBorrow'] =  0;
    } else if (this.state.tabIndex == 1) {
        _params['group'] =  0;
        _params['buyOrBorrow'] =  1;
    } else if (this.state.tabIndex == 2) {
        _params['group'] =  1;
        _params['buyOrBorrow'] =  1;
    }
    Taro.navigateTo({
      url: '/pages/book-detail/index?id=' + id + '&group=' + _params['group'] + '&isBuy=' + (_params['buyOrBorrow'] == 1)
    })
  }

    handleTagSearch(value) {
        this.setState({
            tempKeyword: value,
        }, () => {
            this.execSearch();
        })
    }

  handleChange(value) {
    this.setState({
        tempKeyword: value,
    })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }

  handleClear(value) {
    this.setState({
        tempKeyword: '',
        keyword: '',
        result: [],
    })
    this.fetchSearchHistoryByMember();
    this.fetchRanks(this.state.tabIndex);
  }

  execSearch() {
      if (!this.state.tempKeyword) {
          showTextToast('请输入要检索的关键字');
          return;
      }
    this.setState(prevState => ({
      result: [],
      ranks: [],
    }));
    this.setState({
        keyword: this.state.tempKeyword,
    });
    let _params = { bookName: this.state.tempKeyword };
    if (this.state.tabIndex == 0) {
        _params['group'] =  0;
        _params['buyOrBorrow'] =  0;
    } else if (this.state.tabIndex == 1) {
        _params['group'] =  0;
        _params['buyOrBorrow'] =  1;
    } else if (this.state.tabIndex == 2) {
        _params['group'] =  1;
        _params['buyOrBorrow'] =  1;
    }
    getBookSearch(_params).then(res => {
      this.setState(prevState => ({
        result: res.list || []
      }));
    });
  }

  onChangeTabIndex = (index, e) => {
      if (e) e.stopPropagation();
      this.setState(prevState => ({
          tabIndex: index,
      }), () => {
        if (this.state.keyword) {
            this.execSearch();
        } else {
            this.fetchRanks(index);
        }
      });
  }

  fetchRanks = (tabIndex) => {
    let _type = '';
    if (tabIndex == 0) {
        _type = 'CHILDREN_BORROW';
    } else if (tabIndex == 1) {
        _type = 'CHILDREN_BUY';
    } else if (tabIndex == 2) {
        _type = 'ADULT_BUY';
    }
    this.fetchSearchHistoryGlobal(_type);
  }
  
  fetchSearchHistoryByMember() {
    getSearchHistoryByMember({}).then(res => {
        this.setState(prevState => ({
            historys: res.list || []
        }));
    });
  }
  
  fetchSearchHistoryGlobal(type) {
    getSearchHistoryGlobal({ type: type }).then(res => {
        this.setState(prevState => ({
            ranks: res.list || []
        }));
    });
  }

}
