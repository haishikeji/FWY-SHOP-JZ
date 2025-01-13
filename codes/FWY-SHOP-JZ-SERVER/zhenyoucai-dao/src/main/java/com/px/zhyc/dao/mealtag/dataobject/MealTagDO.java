package com.px.zhyc.dao.mealtag.dataobject;


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
 * 备注标签(MealTag)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-14 22:34:09
 */
@Entity
@Table(name = "meal_tag")
@Getter
@Setter
@ToString
public class MealTagDO extends AbstractDO {

    /**
     * 标签名称
     */
    @ApiModelProperty("标签名称")
    private String name;

    /**
     * 标签颜色
     */
    @ApiModelProperty("标签颜色")
    private String color;

    /**
     * 优先级, 数字越小越靠前
     */
    @ApiModelProperty("优先级, 数字越小越靠前")
    private Integer priority;

    /**
     * 是否显示在首页(0: 不显示; 1: 显示)
     */
    @ApiModelProperty("是否启用(0: 停用; 1: 启用)")
    private Integer status;

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