/**
 * Created by liuyao on 2017/09/27.
 */

import * as types from '@/store/mutation-types'
import cookie from '@/utils/cookie'

import { userAPI } from '@/api'

import {
	baseUrl,
	cookieDomainUrl,
	loginBaseUrl,
	uploadUrl
} from '@/config/env'

const state = {
	token: '',
	loginedUser: { },
	loading: false,
	questionModal: false,
	messageUnreadCount: 0,
	uploadUrl : uploadUrl
}
const mutations = {
	[types.SET_LOGINED_USER](state, payload) {
		state.loginedUser = payload.loginedUser;
	},
	[types.SET_LOADING](state, payload) {
		state.loading = payload.loading;
	},
	[types.SET_TOKEN](state, payload) {
		state.token = payload.token;
	},
	[types.SET_QUESTION_MODAL](state, payload) {
		state.questionModal = payload.flag;
	},
	[types.SET_MESSAGE_UNREAD_COUNT](state, payload) {
		state.messageUnreadCount = payload.unreadCount;
	}
}

const actions = {
	userIsLogin() {
		// loginAPI.isLogin().then((res) => {
		// 	if (res.code == 0) {
		// 		console.log("当前用户已登录.")
		// 	}
		// });
	},
	setLoading({ commit }, status) {
		commit(types.SET_LOADING, { loading: status })
	},
	setLoginedUser({ commit }, status) {
		commit(types.SET_LOGINED_USER, { loginedUser: status })
	},
	setToken({ commit }, status) {
		commit(types.SET_TOKEN, { token: status })
	},
	setQuestionModal({ commit }, flag) {
		commit(types.SET_QUESTION_MODAL, { flag: flag })
	},
	userLogout({ commit }, status) {
        cookie.del('token', cookieDomainUrl);
        cookie.del('auth_info', cookieDomainUrl);
		commit(types.SET_TOKEN, { token: '' })
		commit(types.SET_LOGINED_USER, { loginedUser: {} })
	},
	parseToken({ commit }, params) {
		let next = params.next;
		userAPI.parseToken({ token: params.token }).then(res => {
			if (res.code == 0) {
				commit(types.SET_LOGINED_USER, { loginedUser: res.data.vo });
				next();
	        } else {
	        	next('login')
	        }
		})
	},
	valiToken({ dispatch, commit, state }, status) {
		// if (state.token) {
		// 	accountAPI.fetchUserInfoDetail({ }).then(res => {
		// 		if (res.code == 0) {
		// 			commit(types.SET_LOGINED_USER, { loginedUser: res.data });
		// 			commit(types.SET_LOADING, { loading: false });
		//         } else {
		// 	        dispatch('userLogout');
		// 	        if (status && status.failRedirect) {
		// 	        	window.location.href = loginBaseUrl + window.location.href;
		// 	        }
		//         }
		// 	})
		// } else {
  //       	dispatch('userLogout');
		// }
	},
	// fetchMessageTotal({ commit, state }, params) {
 //        if (state.loginedUser && state.loginedUser.username) {
	// 		messageAPI.messageCount({ }).then(res => {
	// 			if (res.success && res.code === 0) {
	// 				commit(types.SET_MESSAGE_UNREAD_COUNT, { unreadCount: res.data.unread });
	// 			} else {
	// 				commit(types.SET_MESSAGE_UNREAD_COUNT, { unreadCount: 0 });
	// 			}
	// 		});
 //        }
	// },
}

export default {
	state, mutations, actions
}