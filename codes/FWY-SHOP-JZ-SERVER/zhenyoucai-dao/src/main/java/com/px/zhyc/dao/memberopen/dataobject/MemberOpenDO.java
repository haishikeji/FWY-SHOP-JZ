package com.px.zhyc.dao.memberopen.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.entity.GeneralViews;
import com.px.zhyc.common.enums.PlatformEnum;
import com.px.zhyc.dao.memberinfo.dataobject.MemberInfoDO;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;

/**
 * (MemberOpen)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-04 18:12:02
 */
@Entity
@Table(name = "member_open")
@Getter
@Setter
@ToString
public class MemberOpenDO extends AbstractDO {

    @JsonView(GeneralViews.NormalView.class)
    private String nickname;

    private String openid;

    @Column(name = "platform")
    @Enumerated(EnumType.STRING)
    private PlatformEnum platform;

    private String profile;

    @JoinColumn(name = "member_id")
    @ManyToOne
    private MemberInfoDO member;

}