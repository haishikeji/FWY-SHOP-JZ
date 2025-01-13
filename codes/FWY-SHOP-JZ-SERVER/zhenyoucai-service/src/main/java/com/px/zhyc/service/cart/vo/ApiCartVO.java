package com.px.zhyc.service.cart.vo;

import com.px.zhyc.common.enums.order.OrderTypeEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
@ToString
public class ApiCartVO {

    /**
     * 序号
     */
    @ApiModelProperty("序号")
    private Long id;

    /**
     * 购物车类型
     */
    @ApiModelProperty("购物车类型")
    @Enumerated(EnumType.STRING)
    private OrderTypeEnum type;

    /**
     * 关联ID
     */
    @ApiModelProperty("关联ID")
    private Long refId;

    /**
     * 关联VO
     */
    @ApiModelProperty("关联实体")
    private Object refVo;

    /**
     * 加入购物车价格
     */
    @ApiModelProperty("加入购物车价格")
    private Double price;

    /**
     * 加入购物车数量
     */
    @ApiModelProperty("加入购物车数量")
    private Integer num;

    private Long memberId;

}
