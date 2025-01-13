package com.px.zhyc.dao.memberaddr.dataobject;


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
 * (MemberAddr)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-13 10:13:42
 */
@Entity
@Table(name = "member_addr")
@Getter
@Setter
@ToString
public class MemberAddrDO extends AbstractDO {

    /**
     * 名称
     */
    @ApiModelProperty("名称")
    private String name;

    /**
     * 电话号码
     */
    @ApiModelProperty("电话号码")
    private String phone;

    /**
     * 省份
     */
    @ApiModelProperty("省份")
    private String province;

    /**
     * 市
     */
    @ApiModelProperty("市")
    private String city;

    /**
     * 区
     */
    @ApiModelProperty("区")
    private String area;

    /**
     * 详细地址
     */
    @ApiModelProperty("详细地址")
    private String addr;

    /**
     * 是否默认(0: 非默认; 1: 默认)
     */
    @ApiModelProperty("是否默认(0: 非默认; 1: 默认)")
    private Integer isDefault;

    /**
     * 会员编号
     */
    @ApiModelProperty("会员编号")
    private Long memberId;

    /**
     * 数据修改时间
     */
    @Column(name = "gmt_modify_time")
    @ApiModelProperty(value = "修改时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    private Date gmtModifyTime;

}