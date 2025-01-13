package com.px.zhyc.dao.refbookmember.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.dao.book.dataobject.BookDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;
import java.util.Date;

/**
 * 借书表(RefBookMember)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-21 08:06:20
 */
@Entity
@Table(name = "ref_book_member")
@Getter
@Setter
@ToString
public class RefBookMemberDO extends AbstractDO {

//    /**
//     * 类型
//     */
//    @ApiModelProperty("类型")
//    @Enumerated(EnumType.STRING)
//    private BorrowTypeEnum type;

    /**
     * 绘本编号
     */
    @ApiModelProperty("绘本编号")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ref_book_pk")
    @NotFound(action= NotFoundAction.IGNORE)
    private BookDO book;

    /**
     * 借书日期
     */
    @ApiModelProperty("归还日期")
    private Date revertTime;

    /**
     * 状态(0: 待还, 1: 已还)
     */
    @ApiModelProperty("状态(0: 待还, 1: 已还)")
    private Integer status;

    /**
     * 会员编号
     */
    @ApiModelProperty("会员编号")
    private Long memberId;

}