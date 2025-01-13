package com.px.zhyc.service.caseinfo.params;

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
    @ApiModelProperty("案例编号")
    private Long refCasePk;

    /**
     * 课程编号
     */
    @ApiModelProperty("产品编号")
    private List<Long> refProductPks;

}
