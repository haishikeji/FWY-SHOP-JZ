import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View } from '@tarojs/components';

import classNames from 'classnames';

import './index.scss';

export default class GlobalBtn extends Component {

  static propTypes = {
    text: PropTypes.string,
    onBtnAction: PropTypes.func,
    bold: PropTypes.bool,
    style: PropTypes.string,
    btnStyle: PropTypes.string,
  };

  static defaultProps = {
    text: '',
    bold: false,
    style: '',
    btnStyle: '',
    onBtnAction: function() {},
  };

  
  execAction() {
    this.props.onBtnAction();
  }

  render() {
    const { text } = this.props;
    return (
      <View className='global-btn' onClick={this.execAction} style={this.props.btnStyle}>
        <Text className='text' style={this.props.style}>{text}</Text>
      </View>
    );
  }
}