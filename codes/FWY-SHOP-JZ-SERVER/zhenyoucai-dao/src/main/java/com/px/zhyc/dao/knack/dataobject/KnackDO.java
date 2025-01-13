package com.px.zhyc.dao.knack.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.entity.GeneralViews;
import com.px.zhyc.dao.courseseries.dataobject.CourseSeriesDO;
import com.px.zhyc.dao.knacktype.dataobject.KnackTypeDO;
import com.fasterxml.jackson.annotation.*;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

/**
 * 窍门管理(Course)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-22 22:51:45
 */
@Entity
@Table(name = "knack")
@Getter
@Setter
public class KnackDO extends AbstractDO {

    public interface BackShowView extends GeneralViews.NormalView {};

    /**
     * 绘本名称
     */
    @ApiModelProperty("名称")
    @JsonView({BackShowView.class, CourseSeriesDO.ApiShowView.class,GeneralViews.NormalView.class})
    private String name;

    /**
     * 课程封面
     */
    @ApiModelProperty("窍门封面")
    @JsonView(BackShowView.class)
    private String coverPicUrl;

    /**
     * 课程介绍主图
     */
    @ApiModelProperty("窍门介绍主图")
    @JsonView(BackShowView.class)
    private String masterPicUrl;

    @ApiModelProperty("作者")
    @JsonView(BackShowView.class)
    private String author;

    @ApiModelProperty("发表时间")
    @JsonView(BackShowView.class)
    private String publishTime;


    @ApiModelProperty("外部链接")
    @JsonView(BackShowView.class)
    private String outLink;

    /**
     * 简要描述
     */
    @ApiModelProperty("简要描述")
    @JsonView(BackShowView.class)
    private String descript;

    /**
     * 内容介绍
     */
    @ApiModelProperty("内容介绍")
    @JsonView(BackShowView.class)
    private String content;

    /**
     * 上架状态(0: 未上架; 1: 已上架)
     */
    @ApiModelProperty("上架状态(0: 未上架; 1: 已上架)")
    @JsonView(BackShowView.class)
    private Integer shelfStatus;


    /**
     * 年龄集合
     */
    @ApiModelProperty("类型集合")
    @OneToMany
    @JoinTable(name = "ref_knack_type", joinColumns = @JoinColumn(name = "ref_knack_pk"), inverseJoinColumns = @JoinColumn(name = "ref_type_pk"))
    @JsonView(BackShowView.class)
    private List<KnackTypeDO> types;



    /**
     * 关联系列课集合
     */
//    @ApiModelProperty("关联系窍门集合")
//    @ManyToMany(mappedBy = "knacks")
//    //@JsonBackReference
//    @JsonView(BackShowView.class)
//    private List<KnackSeriesDO> knackSeriesList;

    /**
     * 数据修改时间
     */
    @Column(name = "gmt_modify_time")
    @ApiModelProperty(value = "修改时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    @JsonView(BackShowView.class)
    private Date gmtModifyTime;

    /**
     * 是否删除 1= 删除
     */
    @Column(name = "deleted")
    @ApiModelProperty(value = "删除标记, (0: 未删除; 1: 已删除)", hidden = true)
    @JsonView(BackShowView.class)
    private Integer deleted;

    /**
     * 删除时间
     */
    @Column(name = "deleted_time")
    @ApiModelProperty(value = "删除时间", hidden = true)
    @Field(type = FieldType.Date, format = DateFormat.custom, pattern = "yyyy-MM-dd HH:mm:ss || yyyy-MM-dd || epoch_millis")
    @JsonView(BackShowView.class)
    private Date deletedTime;

}