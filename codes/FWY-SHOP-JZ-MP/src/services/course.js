import request from '../utils/request';
import Api from '../configs/api';

/**
 *  查看线上课程列表
 */
export async function getCourseSeriesAll(payload) {
  return request.get(Api.fetchCourseSeriesAll, payload);
}

/**
 *  查看线上系列课程详情
 */
export async function getCourseSeriesDetail(payload) {
  return request.get(Api.fetchCourseSeriesDetail, payload);
}

/**
 *  查看线上课程详情
 */
export async function getCourseDetail(payload) {
  return request.get(Api.fetchCourseDetail, payload);
}

/**
 *  我的预约
 */
export async function getCourseAppointmentList(payload) {
  return request.get(Api.fetchCourseAppointmentList, payload);
}

/**
 *  标签首页推荐
 */
export async function getCourseRecommend(payload) {
  return request.get(Api.fetchCourseRecommend, payload);
}
/**
 *  标签首页推荐
 */
export async function getByRecommendTag(payload) {
  return request.get(Api.fetchByRecommendTag, payload);
}