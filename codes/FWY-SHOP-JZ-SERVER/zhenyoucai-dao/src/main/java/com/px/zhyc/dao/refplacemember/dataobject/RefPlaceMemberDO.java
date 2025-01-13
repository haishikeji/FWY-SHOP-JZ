package com.px.zhyc.dao.refplacemember.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 预约场馆表(RefPlaceMember)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-28 08:34:58
 */
@Entity
@Table(name = "ref_place_member")
@Getter
@Setter
@ToString
public class RefPlaceMemberDO extends AbstractDO {

    /**
     * 场馆编号
     */
    @ApiModelProperty("场馆编号")
    private Long refPlacePk;

    /**
     * 预约日期
     */
    @ApiModelProperty("预约日期")
    private String appointmentDay;

    /**
     * 预约开始时间
     */
    @ApiModelProperty("预约开始时间")
    private String startTime;

    /**
     * 预约结束时间
     */
    @ApiModelProperty("预约结束时间")
    private String endTime;

    /**
     * 会员编号
     */
    @ApiModelProperty("会员编号")
    private Long memberId;

}