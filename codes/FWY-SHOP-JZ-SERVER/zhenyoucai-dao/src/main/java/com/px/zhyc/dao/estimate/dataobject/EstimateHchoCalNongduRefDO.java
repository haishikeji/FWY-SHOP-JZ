package com.px.zhyc.dao.estimate.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 计算值与浓度值对照表(EstimateHchoCalNongduRef)表实体类
 *
 * @author 品讯科技
 * @since 2021-03-18 15:54:18
 */
@Entity
@Table(name = "estimate_hcho_cal_nongdu_ref")
@Getter
@Setter
@ToString
public class EstimateHchoCalNongduRefDO extends AbstractDO {

    /**
     * 甲醛释放量计算值
     */
    @ApiModelProperty("甲醛释放量计算值")
    private Double calValue;

    /**
     * 甲醛浓度值
     */
    @ApiModelProperty("甲醛浓度值")
    private Double nongduValue;

}