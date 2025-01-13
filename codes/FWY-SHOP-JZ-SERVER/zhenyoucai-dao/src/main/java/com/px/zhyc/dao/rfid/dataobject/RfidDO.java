package com.px.zhyc.dao.rfid.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.dao.book.dataobject.BookDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import javax.persistence.*;

/**
 * rfid记录表(Rfid)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-25 19:36:31
 */
@Entity
@Table(name = "rfid")
@Getter
@Setter
@ToString
public class RfidDO extends AbstractDO {

    /**
     * 关联书本编号
     */
    @ApiModelProperty("关联书本编号")
    @JoinColumn(name = "ref_book_pk")
    @OneToOne(fetch = FetchType.LAZY)
    @NotFound(action= NotFoundAction.IGNORE)
    private BookDO book;

    /**
     * rfid编码
     */
    @ApiModelProperty("rfid编码")
    private String rfid;

    /**
     * 状态(0: 入库; 1: 出借; 2: 出售)
     */
    @ApiModelProperty("状态(0: 入库; 1: 出借; 2: 出售)")
    private Integer status;

}