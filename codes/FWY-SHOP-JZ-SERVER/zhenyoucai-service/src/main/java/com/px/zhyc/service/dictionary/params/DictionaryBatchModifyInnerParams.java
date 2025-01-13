package com.px.zhyc.service.dictionary.params;

import com.px.zhyc.dao.dictionary.dataobject.DictionaryDO;
import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;

@Getter
public class DictionaryBatchModifyInnerParams {

    /**
     * 类别
     */
    @ApiModelProperty("类别")
    private String type;

    /**
     * CODE
     */
    @ApiModelProperty("CODE")
    @JsonView(DictionaryDO.ShowNormalView.class)
    private String code;

    /**
     * 值
     */
    @ApiModelProperty("值")
    @JsonView(DictionaryDO.ShowNormalView.class)
    private String value;

}
