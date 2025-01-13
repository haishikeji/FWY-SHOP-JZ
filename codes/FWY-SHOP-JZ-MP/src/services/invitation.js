import request from '../utils/request';
import Api from '../configs/api';

/**
 *  获取邀请得好友
 */
export async function findShareFriend(payload) {
  return request.get(Api.findShareFriend, payload);
}

/**
 *  获取邀请奖励
 */
export async function findShareReward(payload) {
  return request.get(Api.findShareReward, payload);
}