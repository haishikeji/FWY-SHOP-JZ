package com.px.zhyc.service.cart.params;

import com.px.zhyc.common.enums.order.OrderTypeEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Getter
@Setter
public class AddCartParams {

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
    private Long id;

    /**
     * 加入购物车数量
     */
    @ApiModelProperty("加入购物车数量")
    private Integer num;

    private Long memberId;

}
