import request from '../utils/request';
import Api from '../configs/api';

/**
 *  获取支付要素
 */
export async function fetchWxPay(payload) {
  return request.post(Api.fetchWxPay, payload);
}