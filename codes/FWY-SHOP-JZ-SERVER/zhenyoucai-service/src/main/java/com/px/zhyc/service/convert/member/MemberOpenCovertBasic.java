package com.px.zhyc.service.convert.member;

import com.px.zhyc.common.entity.member.vo.MemberInfoVO;
import com.px.zhyc.dao.memberinfo.dataobject.MemberInfoDO;
import com.px.zhyc.dao.memberopen.dataobject.MemberOpenDO;
import com.px.zhyc.service.memberopen.params.MemberAddParams;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface MemberOpenCovertBasic {

    MemberOpenCovertBasic INSTANCE = Mappers.getMapper(MemberOpenCovertBasic.class);

    /**
     * 字段数量类型数量相同，利用工具BeanUtils也可以实现类似效果
     * @param source
     * @return
     */
    MemberInfoVO convertToVO(MemberOpenDO source);

    MemberInfoDO convertAddParamsToInfoVO(MemberAddParams source);

    MemberOpenDO convertAddParamsToVO(MemberAddParams source);

}
