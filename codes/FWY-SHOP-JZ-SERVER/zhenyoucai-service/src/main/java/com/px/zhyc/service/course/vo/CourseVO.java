package com.px.zhyc.service.course.vo;


import com.px.zhyc.common.entity.GeneralViews;
import com.px.zhyc.common.enums.course.GroupEnum;
import com.px.zhyc.dao.courseseries.dataobject.CourseSeriesDO;
import com.px.zhyc.dao.coursetype.dataobject.CourseTypeDO;
import com.px.zhyc.dao.memberopen.dataobject.MemberOpenDO;
import com.px.zhyc.dao.sysuser.dataobject.SysUserDO;
import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 线上课程管理(Course)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-22 22:51:45
 */
@Getter
@Setter
public class CourseVO {

    public interface BackShowView extends GeneralViews.NormalView {};
    @JsonView(BackShowView.class)
    private Long id;
    /**
     * 课程类型
     */
    @ApiModelProperty("课程类型")
    @Enumerated(EnumType.STRING)
    @JsonView(BackShowView.class)
    private GroupEnum courseGroup;

    /**
     * 绘本名称
     */
    @ApiModelProperty("绘本名称")
    @JsonView({BackShowView.class, CourseSeriesDO.ApiShowView.class})
    private String name;

    /**
     * 多媒体文件URL
     */
    @ApiModelProperty("多媒体文件URL")
    @JsonView({BackShowView.class, CourseSeriesDO.ApiShowView.class})
    private String mediaUrl;

    /**
     * 音频介绍
     */
    @ApiModelProperty("音频介绍")
    @JsonView(BackShowView.class)
    private String audioDescUrl;

    /**
     * 课件URL
     */
    @ApiModelProperty("课件URL")
    @JsonView(BackShowView.class)
    private String coursewareUrl;

    /**
     * 授课讲师
     */
    @ApiModelProperty("授课讲师")
    @JsonView(BackShowView.class)
    private SysUserDO refTeacher;

    /**
     * 课程封面
     */
    @ApiModelProperty("课程封面")
    @JsonView(BackShowView.class)
    private String coverPicUrl;

    /**
     * 课程介绍主图
     */
    @ApiModelProperty("课程介绍主图")
    @JsonView(BackShowView.class)
    private String masterPicUrl;

    /**
     * 课程显示标签
     */
    @ApiModelProperty("课程显示标签")
    @JsonView(BackShowView.class)
    private String showTags;

    /**
     * 是否支持单独售卖
     */
    @ApiModelProperty("是否支持单独售卖")
    @JsonView(BackShowView.class)
    private Integer allowBuy;

    /**
     * 是否支持系列课售卖
     */
    @ApiModelProperty("是否支持系列课售卖")
    @JsonView(BackShowView.class)
    private Integer allowSeriesBuy;

    /**
     * 销售价格
     */
    @ApiModelProperty("销售价格")
    @JsonView(BackShowView.class)
    private BigDecimal salePrice;

    /**
     * 标注价格
     */
    @ApiModelProperty("标注价格")
    @JsonView(BackShowView.class)
    private BigDecimal markPrice;

    /**
     * 简要描述
     */
    @ApiModelProperty("简要描述")
    @JsonView(BackShowView.class)
    private String descript;

    /**
     * 内容介绍
     */
    @ApiModelProperty("内容介绍")
    @JsonView(BackShowView.class)
    private String content;

    /**
     * 上架状态(0: 未上架; 1: 已上架)
     */
    @ApiModelProperty("上架状态(0: 未上架; 1: 已上架)")
    @JsonView(BackShowView.class)
    private Integer shelfStatus;


    /**
     * 年龄集合
     */
    @ApiModelProperty("类型集合")
    @JsonView(BackShowView.class)
    private List<CourseTypeDO> types;



    /**
     * 关联报名用户集合
     */
    @ApiModelProperty("关联报名用户集合")
    @JsonView(BackShowView.class)
    private List<MemberOpenDO> enrolls;

    /**
     * 关联系列课集合
     */
    @ApiModelProperty("关联系列课集合")
    @JsonView(BackShowView.class)
    private List<CourseSeriesDO> courseSeriesList;

    /**
     * 数据修改时间
     */
    @JsonView(BackShowView.class)
    private Date gmtModifyTime;

    /**
     * 是否删除 1= 删除
     */
    @JsonView(BackShowView.class)
    private Integer deleted;

    /**
     * 删除时间
     */
    @JsonView(BackShowView.class)
    private Date deletedTime;

}