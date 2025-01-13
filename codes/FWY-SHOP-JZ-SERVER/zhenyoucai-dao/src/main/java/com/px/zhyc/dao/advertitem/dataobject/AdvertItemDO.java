package com.px.zhyc.dao.advertitem.dataobject;


import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.enums.DataEnableEnum;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Table;
import java.util.Date;

/**
 * 广告素材(AdvertItem)表实体类
 *
 * @author 品讯科技
 * @since 2020-09-07 22:45:48
 */
@Entity
@Table(name = "advert_item")
@Getter
@Setter
@ToString
public class AdvertItemDO extends AbstractDO {

    /**
     * 关联广告位
     */
    @ApiModelProperty("关联广告位")
    private Long refAdvertPk;

    /**
     * 广告位图片
     */
    @ApiModelProperty("广告位图片")
    private String adCoverUrl;

    /**
     * 图片描述
     */
    @ApiModelProperty("图片描述")
    private String descript;

    /**
     * 图片链接
     */
    @ApiModelProperty("图片链接")
    private String url;

    /**
     * 优先级, 数字越小越靠前
     */
    @ApiModelProperty("优先级, 数字越小越靠前")
    private Integer priority;

    /**
     * 生效开始时间
     */
    @ApiModelProperty("生效开始时间")
    private Date startTime;

    /**
     * 结束时间
     */
    @ApiModelProperty("结束时间")
    private Date endTime;

    /**
     * 状态(ENABLE: 启用, DISABLE: 停用)
     */
    @ApiModelProperty("状态(ENABLE: 启用, DISABLE: 停用)")
    @Enumerated(EnumType.STRING)
    private DataEnableEnum status;

}