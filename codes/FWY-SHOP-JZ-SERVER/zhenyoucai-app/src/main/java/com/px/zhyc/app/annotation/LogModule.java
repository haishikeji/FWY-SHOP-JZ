package com.px.zhyc.app.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 日志 -> 功能模块名称定义
 * Created by y on 2017/11/16.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.METHOD, ElementType.TYPE})
public @interface LogModule {

    /**
     * 主模块名称
     * @return
     */
    String masterModule() default "";

    /**
     * 子模块名称
     * @return
     */
    String childModule() default "";

}
