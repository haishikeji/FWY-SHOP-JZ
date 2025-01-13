package com.px.zhyc.dao.estimate.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 测量值与计算值对照表(EstimateHchoCalRef)表实体类
 *
 * @author 品讯科技
 * @since 2020-12-22 18:15:18
 */
@Entity
@Table(name = "estimate_hcho_cal_ref")
@Getter
@Setter
@ToString
public class EstimateHchoCalRefDO extends AbstractDO {

    /**
     * 分类编码
     */
    @ApiModelProperty("分类编码")
    private String typeCode;

    /**
     * 下限 >
     */
    @ApiModelProperty("下限 >")
    private Double lowerLimit;

    /**
     * 上限 <=
     */
    @ApiModelProperty("上限 <=")
    private Double upperLimit;

    /**
     * 单位
     */
    @ApiModelProperty("单位")
    private String unit;

    /**
     * 甲醛释放量计算值
     */
    @ApiModelProperty("甲醛释放量计算值")
    private Double calCalue;

}