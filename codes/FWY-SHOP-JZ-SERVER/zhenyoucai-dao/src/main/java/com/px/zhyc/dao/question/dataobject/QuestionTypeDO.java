package com.px.zhyc.dao.question.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.entity.GeneralViews;
import com.px.zhyc.dao.booktype.dataobject.BookTypeDO;
import com.fasterxml.jackson.annotation.JsonView;
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
 * 标准分类(StandardType)表实体类
 *
 * @author 品讯科技
 * @since 2020-10-19 22:07:12
 */
@Entity
@Table(name = "question_type")
@Getter
@Setter
@ToString
public class QuestionTypeDO extends AbstractDO {

    public interface ShowHomeApiView extends GeneralViews.NormalView {};

    /**
     * 分类名称
     */
    @ApiModelProperty("分类名称")
    @JsonView(BookTypeDO.ShowHomeApiView.class)
    private String name;

    /**
     * 父节点
     */
    @ApiModelProperty("父节点")
    private Long refParentPk;

    /**
     * 优先级
     */
    @ApiModelProperty("优先级")
    private String priority;

    /**
     * 分类等级
     */
    @ApiModelProperty("分类等级")
    private Integer level;

    /**
     * 是否显示在首页
     */
    @ApiModelProperty("是否显示在首页")
    private Integer showHome;

    /**
     * 用户编号
     */
    @ApiModelProperty("用户编号")
    private Long memberId;

    /**
     * 是否删除 1= 删除
     */
    @Column(name = "deleted")
    @ApiModelProperty(value = "删除标记, (0: 未删除; 1: 已删除)", hidden = true)
    private Integer deleted;

    /**
     * 删除时间
     */
    @Column(name = "deleted_time")
    @ApiModelProperty(value = "删除时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    private Date deletedTime;

}