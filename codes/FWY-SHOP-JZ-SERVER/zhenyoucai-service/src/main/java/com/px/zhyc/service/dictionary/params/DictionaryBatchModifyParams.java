package com.px.zhyc.service.dictionary.params;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DictionaryBatchModifyParams {

    /**
     * 修改实体集合
     */
    @ApiModelProperty("修改实体集合")
    private List<DictionaryBatchModifyInnerParams> dictionaries;

}
