package com.px.zhyc.dao.exhibitionhall.dataobject;



import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.dao.course.dataobject.CourseDO;
import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

/**
 * 展厅(exhibition_hall)实体类
 * @author 品讯科技
 * @creat 2021/6/28
 */
@Entity
@Table(name = "exhibition_hall")
@Getter
@Setter
@ToString
public class ExhibitionHallDO extends AbstractDO {
    /**
    /**
     * 关联商家pk
     */
    @ApiModelProperty("关联商家pk")
    private Long busiId;
    /**
     * 展厅名称
     */
    @ApiModelProperty("展厅名称")
    private String exhibitionHallName;

    /**
     * 列表图地址
     */
    @ApiModelProperty("列表图地址")
    private String chartAddress;

    /**
     * 介绍图
     */
    @ApiModelProperty("介绍图")
    private String introductionPic;

    /**
     * 视频封面图片地址
     */
    @ApiModelProperty("视频封面图片地址")
    private String videoCoverPicAddress;

    /**
     * 视频地址
     */
    @ApiModelProperty("视频地址")
    private String videoAddress;

    /**
     * 地址
     */
    @ApiModelProperty("地址")
    private String address;

    /**
     * 经度
     */
    @ApiModelProperty("经度")
    private String longitude;

    /**
     * 纬度
     */
    @ApiModelProperty("纬度")
    private String latitude;

    /**
     * 面积
     */
    @ApiModelProperty("面积")
    private String area;

    /**
     * 分类标签
     */
    @ApiModelProperty("分类标签")
    private String categoryLabel;

    /**
     * 营业开始时间
     */
    @ApiModelProperty("营业开始时间")
    @Column(name = "start_time")
    private String startTime;

    /**
     * 营业结束时间
     */
    @ApiModelProperty("营业结束时间")
    @Column(name = "end_time")
    private String endTime;

    /**
     * 联系电话
     */
    @ApiModelProperty("联系电话")
    private String contactNumber;

    /**
     * 联系人
     */
    @ApiModelProperty("联系人")
    private String contactPerson;

    /**
     * 是否可以接送
     */
    @ApiModelProperty("是否可以接送")
    private String receiveSend;

    /**
     * 接送人数要求
     */
    @ApiModelProperty("接送人数要求")
    private String numberRequirement;

    /**
     * 位置标签
     */
    @ApiModelProperty("位置标签")
    private String locationLabel;

    /**
     * 产品标签
     */
    @ApiModelProperty("产品标签")
    private String productionLabel;

    /**
     * 商家简称
     */
    @ApiModelProperty("商家简称")
    private String businessAbbreviation;

    /**
     * 展厅介绍
     */
    @ApiModelProperty("展厅介绍")
    private String exhibitionHallIntroduction;

    /**
     * 注意事项
     */
    @ApiModelProperty("注意事项")
    private String attention;

    /**
     * 拨打电话人数
     */
    @ApiModelProperty("拨打电话人数")
    private Integer numberCalls;

    /**
     * 启用/禁用(0:禁用;1:启用)
     */
    @ApiModelProperty("启用/禁用(0:禁用;1:启用)")
    private String applicationStatus;

    /**
     * 排序号
     */
    @ApiModelProperty("排序号")
    private Long sortNum;

    /**
     * 是否突出显示
     */
    @ApiModelProperty("是否突出显示(0:不突出显示;1:、突出显示)")
    private String highlight;

    /**
     * 是否置顶
     */
    @ApiModelProperty("是否置顶(0:不置顶;1:置顶)")
    @Column(name = "top")
    private Integer top;

    /**
     * 数据修改时间
     */
    @Column(name = "gmt_modify_time")
    @ApiModelProperty(value = "修改时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    @JsonView(CourseDO.BackShowView.class)
    private Date gmtModifyTime;

    /**
     * 是否删除 1= 删除
     */
    @Column(name = "deleted")
    @ApiModelProperty(value = "删除标记, (0: 未删除; 1: 已删除)", hidden = true)
    @JsonView(CourseDO.BackShowView.class)
    private Integer deleted;

    /**
     * 删除时间
     */
    @Column(name = "deleted_time")
    @ApiModelProperty(value = "删除时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    @JsonView(CourseDO.BackShowView.class)
    private Date deletedTime;
}
