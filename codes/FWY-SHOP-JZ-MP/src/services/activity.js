import request from '../utils/request';
import Api from '../configs/api';

/**
 *  获取首页推荐
 */
export async function fetchAcvitityRecommend(payload) {
  return request.get(Api.fetchAcvitityRecommend, payload);
}

/**
 *  获取我预约的活动
 */
export async function fetchAppointmentList(payload) {
  return request.get(Api.fetchAppointmentList, payload);
}

/**
 *  通过时间段获取课程列表
 */
export async function fetchActivityByDay(payload) {
  return request.get(Api.fetchActivityByDay, payload);
}

/**
 *  线下活动详情
 */
export async function fetchActivityDetail(payload) {
  return request.get(Api.fetchActivityDetail, payload);
}

/**
 *  获取线下课程系列列表
 */
export async function findSeriesList(payload) {
  return request.get(Api.findSeriesList, payload);
}

/**
 *  获取线下课程系列详情
 */
export async function findSeriesDetail(payload) {
  return request.get(Api.findSeriesDetail, payload);
}

/**
 *  日期添加标记点
 */
export async function getRedPoint(payload) {
  return request.get(Api.findRedPoint, payload);
}

