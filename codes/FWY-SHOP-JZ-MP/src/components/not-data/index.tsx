import Taro, { Component } from '@tarojs/taro';
import PropTypes from 'prop-types';
import { View, Image } from '@tarojs/components';
import GlobalBtn from '../global/globalBtn'

import classNames from 'classnames'

import './index.scss';

export default class NoDataComponent extends Component {

  static propTypes = {
    img: PropTypes.string,
    imgSize: PropTypes.string,
    text: PropTypes.string,
    btnText: PropTypes.string,
    onBtnAction: PropTypes.func,
    isFull: PropTypes.bool,
  };

  static defaultProps = {
    img: '',
    text: '',
    btnText: '',
    isFull: true,
    onBtnAction: function() {},
  };

  
  execAction() {
    this.props.onBtnAction();
  }

  render() {
    const { img, imgSize, text, btnText, isFull } = this.props;
    return (
      <View className={ classNames(isFull && 'no-data-component-full', !isFull && 'no-data-component') }>
        <Image className='err-img' src={img} mode='widthFix' style={imgSize} />
        <View className='err-text'>{text}</View>
        { btnText && <View className='btn-wrap'>
            <GlobalBtn text={btnText} onBtnAction={this.execAction.bind(this)} />
        </View> }
      </View>
    );
  }
}