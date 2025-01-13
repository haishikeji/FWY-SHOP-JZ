import request from '../utils/request';
import Api from '../configs/api';

/**
 *  文件上传
 */
export async function fileUploadApi(payload) {
  return request.post(Api.fileUploadApi, payload);
}

/**
 *  银行卡上传
 */
export async function fileParseBankApi(payload) {
  return request.post(Api.fileParseBankApi, payload);
}

