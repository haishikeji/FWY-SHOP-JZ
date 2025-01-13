package com.px.zhyc.service.convert.collect;

import com.px.zhyc.dao.collect.dataobject.CollectDO;
import com.px.zhyc.service.collect.params.CollectAddParams;
import com.px.zhyc.service.collect.vo.CollectVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CollectCovertBasic {

    CollectCovertBasic INSTANCE = Mappers.getMapper(CollectCovertBasic.class);

    /**
     * 字段数量类型数量相同，利用工具BeanUtils也可以实现类似效果
     * @param source
     * @return
     */
    CollectVO convertToVO(CollectDO source);

    List<CollectVO> convertToVOs(List<CollectDO> sources);

    CollectDO paramsConvertToDO(CollectAddParams source);

}
