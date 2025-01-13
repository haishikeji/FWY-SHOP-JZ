package com.px.zhyc.dao.place.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
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
 * 场地(Place)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-10 22:33:35
 */
@Entity
@Table(name = "place")
@Getter
@Setter
@ToString
public class PlaceDO extends AbstractDO {

    /**
     * 场地名称
     */
    @ApiModelProperty("场地名称")
    private String name;

    /**
     * 场地列表图
     */
    @ApiModelProperty("场地列表图")
    private String coverPicUrl;

    /**
     * 场地介绍主图
     */
    @ApiModelProperty("场地介绍主图")
    private String masterPicUrl;

    /**
     * 场地地址
     */
    @ApiModelProperty("场地地址")
    private String address;

    /**
     * 最大报名人数
     */
    @ApiModelProperty("最大报名人数")
    private Integer maxNum;

    /**
     * 场地地址描述
     */
    @ApiModelProperty("场地地址描述")
    private String addressDescript;

    /**
     * 关联地点表场地类型(PLACE_TYPE)
     */
    @ApiModelProperty("关联地点表场地类型(PLACE_TYPE)")
    private String refDdCode;

    /**
     * 内容
     */
    @ApiModelProperty("内容")
    private String content;

    /**
     * 工作日价格
     */
    @ApiModelProperty("工作日价格")
    private Double weekdaysPrice;

    /**
     * 周末价格
     */
    @ApiModelProperty("周末价格")
    private Double weekendPrice;

    /**
     * 开始营业时间
     */
    @ApiModelProperty("开始营业时间")
    private String startTime;

    /**
     * 结束营业时间
     */
    @ApiModelProperty("结束营业时间")
    private String endTime;

    /**
     * 数据修改时间
     */
    @Column(name = "gmt_modify_time")
    @ApiModelProperty(value = "修改时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    private Date gmtModifyTime;

}