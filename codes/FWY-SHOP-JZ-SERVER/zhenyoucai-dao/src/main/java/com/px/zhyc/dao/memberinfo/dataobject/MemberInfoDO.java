package com.px.zhyc.dao.memberinfo.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.enums.DataEnableEnum;
import com.px.zhyc.common.enums.baby.GenderEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.Date;

/**
 * (MemberInfo)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-04 17:33:39
 */
@Entity
@Table(name = "member_info")
@Getter
@Setter
@ToString
public class MemberInfoDO extends AbstractDO {

    private String name;

    private String nickname;

    private String phone;

    private String password;

    private String profile;

    @ApiModelProperty(value = "标签")
    private String tag;


    @ApiModelProperty(value = "性别")
    @Enumerated(EnumType.STRING)
    private GenderEnum gender;

    private Integer isReadVip;

    private Date readVipExpired;

    private Integer isCourseVip;

    private Date courseVipExpired;

    private Integer deposited;

    private String shareCode;

    @Enumerated(EnumType.STRING)
    private DataEnableEnum status;

    /**
     * 数据修改时间
     */
    @Column(name = "gmt_modify_time")
    @ApiModelProperty(value = "修改时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    private Date gmtModifyTime;

    private Integer profession;

}