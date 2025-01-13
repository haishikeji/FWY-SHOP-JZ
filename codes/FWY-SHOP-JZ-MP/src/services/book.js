import request from '../utils/request';
import Api from '../configs/api';

/**
 *  首页绘本分类列表接口
 */
export async function getBookShowHomeTypes(payload) {
  return request.get(Api.fetchBookShowHomeTypes, payload);
}

/**
 *  所有绘本分类列表接口
 */
export async function getBookShowAllTypes(payload) {
  return request.get(Api.fetchBookShowAllTypes, payload);
}

/**
 *  绘本详情接口
 */
export async function getBookDetail(payload) {
  return request.get(Api.fetchBookDetail, payload);
}

/**
 *  绘本系列列表接口
 */
export async function getBookSeries(payload) {
  return request.get(Api.fetchBookSeries, payload);
}

/**
 *  绘本搜索
 */
export async function getBookSearch(payload) {
  return request.get(Api.fetchBookSearch, payload);
}

/**
 *  
 */
export async function showLevel2TypeByParentType(payload) {
  return request.get(Api.fetchShowLevel2TypeByParentType, payload);
}

/**
 *  
 */
export async function getShowBooks(payload) {
  return request.get(Api.fetchShowBooks, payload);
}

/**
 *  
 */
export async function getBookBorrowList(payload) {
  return request.get(Api.fetchBookBorrowList, payload);
}

/**
 *  
 */
export async function execBookRevert(payload) {
  return request.get(Api.execBookRevert, payload);
}