package com.px.zhyc.service.knack.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConfigAddParams {

    /**
     * 系列编号
     */
    @ApiModelProperty("系列编号")
    private Long refKnackSeriesPk;

    /**
     * 课程编号
     */
    @ApiModelProperty("窍门编号")
    private List<Long> refKnackPks;

}
