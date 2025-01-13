package com.px.zhyc.dao.question.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.dao.memberopen.dataobject.MemberOpenDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.Formula;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.Date;

/**
 * 标准(Standard)表实体类
 *
 * @author 品讯科技
 * @since 2020-10-19 22:28:01
 */
@Entity
@Table(name = "question")
@Getter
@Setter
@ToString
public class QuestionDO extends AbstractDO {

    /**
     * 问题标题
     */
    @ApiModelProperty("问题标题")
    private String name;

    /**
     * 问题图列表
     */
    @ApiModelProperty("问题图列表")
    private String masterPicUrl;

    /**
     * 内容介绍
     */
    @ApiModelProperty("内容介绍")
    private String content;

    @ApiModelProperty("提问者")
    @ManyToOne(cascade={CascadeType.MERGE,CascadeType.REFRESH},optional=false)//可选属性optional=false
    @JoinColumn(name="publisher")//设置在article表中的关联字段(外键)
    private MemberOpenDO publisher;


    @ApiModelProperty("提问时间")
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    private Date publishTime;


    @ManyToOne(cascade={CascadeType.MERGE,CascadeType.REFRESH},optional=false)//可选属性optional=false,表示author不能为空。删除文章，不影响用户
    @JoinColumn(name="ref_type_id")//设置在article表中的关联字段(外键)
    private QuestionTypeDO quesType;

    /**
     * 上架状态(0: 未上架; 1: 已上架)
     */
    @ApiModelProperty("上架状态(0: 未上架; 1: 已上架)")
    private Integer shelfStatus;


    /**
     * 数据修改时间
     */
    @Column(name = "gmt_modify_time")
    @ApiModelProperty(value = "修改时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    private Date gmtModifyTime;

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

    @Formula("(select count(1) from question_answer as d where d.question_id = pk)")
    private Long answerNum;

}