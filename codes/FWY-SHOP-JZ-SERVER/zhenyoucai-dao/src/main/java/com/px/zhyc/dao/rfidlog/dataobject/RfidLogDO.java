package com.px.zhyc.dao.rfidlog.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * rfid记录表(RfidLog)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-25 20:58:38
 */
@Entity
@Table(name = "rfid_log")
@Getter
@Setter
@ToString
public class RfidLogDO extends AbstractDO {

    /**
     * 关联书本编号
     */
    @ApiModelProperty("关联书本编号")
    private Long refOrderPk;

//    /**
//     * rfid编码
//     */
//    @ApiModelProperty("rfid编码")
//    private String refRfid;

    /**
     * 绘本/书 名称
     */
    @ApiModelProperty("绘本/书 名称")
    private String name;

    /**
     * 绘本/书 rfid编码
     */
    @ApiModelProperty("绘本/书 rfid编码")
    private String rfid;

    /**
     * 绘本/书 作者
     */
    @ApiModelProperty("绘本/书 作者")
    private String author;

    /**
     * 绘本/书 分类
     */
    @ApiModelProperty("绘本/书 分类")
    private String type;

    /**
     * 绘本/书 数量
     */
    @ApiModelProperty("绘本/书 数量")
    private Integer num;

    /**
     * 状态(0: 入库; 1: 出借; 2: 出售)
     */
    @ApiModelProperty("状态(0: 入库; 1: 出借; 2: 出售)")
    private Integer status;

}