package com.px.zhyc.dao.order.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.enums.order.OrderDistributionModeEnum;
import com.px.zhyc.common.enums.order.OrderPayPlatformEnum;
import com.px.zhyc.common.enums.order.OrderTypeEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.math.BigDecimal;
import java.util.Date;

/**
 * (Order)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-13 11:19:37
 */
@Entity
@Table(name = "tb_order")
@Getter
@Setter
@ToString
public class OrderDO extends AbstractDO {

    /**
     * 订单编号
     */
    @ApiModelProperty("订单编号")
    private String orderSn;

    /**
     * 订单类型
     */
    @ApiModelProperty("订单类型")
    @Enumerated(EnumType.STRING)
    private OrderTypeEnum orderType;

    /**
     * 运费
     */
    @ApiModelProperty("运费")
    private BigDecimal freight;

    /**
     * 支付金额
     */
    @ApiModelProperty("合计金额")
    private BigDecimal totalPrice;

    /**
     * 使用余额数
     */
    @ApiModelProperty("使用余额数")
    private BigDecimal useBalance;

    /**
     * 剩余待支付金额
     */
    @ApiModelProperty("剩余待支付金额")
    private BigDecimal surplusPrice;

    /**
     * 配送方式
     */
    @ApiModelProperty("配送方式")
    @Enumerated(EnumType.STRING)
    private OrderDistributionModeEnum distributionMode;

    /**
     * 商品列表字符串(JSON)
     */
    @ApiModelProperty("商品列表字符串(JSON)")
    private String goods;

    /**
     * 描述字符串(JSON)
     */
    @ApiModelProperty("描述字符串(JSON)")
    private String otherDesc;



    /**
     * 支付金额
     */
    @ApiModelProperty("支付金额")
    private BigDecimal payPrice;

    /**
     * 支付平台
     */
    @ApiModelProperty("支付平台")
    @Enumerated(EnumType.STRING)
    private OrderPayPlatformEnum payPlatform;

    /**
     * 支付时间
     */
    @ApiModelProperty("支付时间")
    private Date payTime;

    /**
     * 收件人名称
     */
    @ApiModelProperty("收件人名称")
    private String receivedName;

    /**
     * 收件人电话
     */
    @ApiModelProperty("收件人电话")
    private String receivedPhone;

    /**
     * 收件人地址
     */
    @ApiModelProperty("收件人地址")
    private String receivedAddress;

    /**
     * 物流单号
     */
    @ApiModelProperty("物流单号")
    private String logisticsSn;

    /**
     * 快递公司
     */
    @ApiModelProperty("快递公司")
    private String logisticsCompany;

    /**
     * 订单状态(0: 待付款; 1: 进行中; 2: 已完成; 3: 已取消)
     */
    @ApiModelProperty("订单状态(0: 待付款; 1: 进行中; 2: 已完成; 3: 已取消)")
    private Integer status;

    /**
     * 订单子状态(0: 未发货; 1: 已发货;)
     */
    @ApiModelProperty("订单子状态(0: 未发货; 1: 已发货;)")
    private Integer childStatus;

    /**
     * 取消原因
     */
    @ApiModelProperty("取消原因")
    private String cancelReason;

    /**
     * 会员编号
     */
    @ApiModelProperty("会员编号")
    private Long memberId;

}