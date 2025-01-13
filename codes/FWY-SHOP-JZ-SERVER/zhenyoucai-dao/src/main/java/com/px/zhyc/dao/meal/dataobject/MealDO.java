package com.px.zhyc.dao.meal.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.dao.mealtype.dataobject.MealTypeDO;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 饭菜(Meal)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-14 22:33:43
 */
@Entity
@Table(name = "meal")
@Getter
@Setter
@ToString
public class MealDO extends AbstractDO {

    /**
     * 菜品名称
     */
    @ApiModelProperty("菜品名称")
    private String name;

    /**
     * 菜品封面
     */
    @ApiModelProperty("菜品封面")
    private String coverPicUrl;

    /**
     * 菜品介绍主图
     */
    @ApiModelProperty("菜品介绍主图")
    private String masterPicUrl;

    /**
     * 活动分类
     */
    @ApiModelProperty("菜品分类")
    @JoinColumn(name = "ref_type_pk")
    @OneToOne(fetch = FetchType.LAZY)
    @NotFound(action= NotFoundAction.IGNORE)
    private MealTypeDO mealType;

    /**
     * 显示标签
     */
    @ApiModelProperty("显示标签")
    private String showTags;

    /**
     * 销售价格
     */
    @ApiModelProperty("销售价格")
    private BigDecimal salePrice;

    /**
     * 标注价格
     */
    @ApiModelProperty("标注价格")
    private BigDecimal markPrice;

    /**
     * 内容介绍
     */
    @ApiModelProperty("内容介绍")
    private String content;

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


}