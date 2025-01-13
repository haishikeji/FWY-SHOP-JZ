package com.px.zhyc.app.interceptor;

import com.px.zhyc.common.cache.RedisKeyConstant;
import com.px.zhyc.common.cache.RedisUtil;
import com.px.zhyc.common.entity.passport.UserVO;
import com.px.zhyc.common.exception.BaseException;
import com.px.zhyc.common.exception.PassportException;
import com.px.zhyc.common.utils.CheckUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 描述：
 *
 * @autho：wenskys
 * @create 2020/5/14 15:01
 **/
@Component
public class ManageLoginInterceptor extends HandlerInterceptorAdapter {

    @Resource
    private RedisUtil redisUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String token = request.getHeader("token");
        CheckUtils.notNull(token, "token");
        boolean hasLogin = redisUtil.hHasKey(RedisKeyConstant.BACK_LOGIN_INFO, token);
        if (!hasLogin) {
            throw BaseException.newException(PassportException.INVALID_TOKEN, "back login, invalid token[{0}]", token);
        }
        // 刷新缓存
        UserVO user = (UserVO) redisUtil.hget(RedisKeyConstant.BACK_LOGIN_INFO, token);
        redisUtil.hset(RedisKeyConstant.BACK_LOGIN_INFO, token, user, RedisKeyConstant.BACK_LOGIN_INFO_TIME);
        return true;
    }
}
