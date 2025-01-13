import request from '../utils/request';
import Api from '../configs/api';

/**
 *  获取首页推荐
 */
export async function getCaseinfoRecommend(payload) {
  return request.get(Api.fetchCaseinfoRecommend, payload);
}

/**
 *  首页案例分类列表接口
 */
export async function getBuildType(payload) {
  return request.get(Api.fetchBuildType, payload);
}


/**
 *  案例详情接口
 */
export async function getCaseinfoDetail(payload) {
  return request.get(Api.fetchCaseinfoDetail, payload);
}

/**
 *  案例搜索
 */
export async function getCaseinfoSearch(payload) {
  return request.get(Api.fetchCaseinfoSearch, payload);
}

