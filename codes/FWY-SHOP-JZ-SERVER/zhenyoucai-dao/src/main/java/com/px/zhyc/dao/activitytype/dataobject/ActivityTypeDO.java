package com.px.zhyc.dao.activitytype.dataobject;


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
 * (ActivityType)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-09 21:54:04
 */
@Entity
@Table(name = "activity_type")
@Getter
@Setter
@ToString
public class ActivityTypeDO extends AbstractDO {

    /**
     * 分类名称
     */
    @ApiModelProperty("分类名称")
    private String name;

    /**
     * 适合儿童
     */
    @ApiModelProperty("适合儿童")
    private Integer fitChildren;

    /**
     * 适合成人
     */
    @ApiModelProperty("适合成人")
    private Integer fitAdult;

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

}