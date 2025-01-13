package com.px.zhyc.service.convert.user;

import com.px.zhyc.dao.sysuser.dataobject.SysUserDO;
import com.px.zhyc.service.sysuser.vo.UserLogindConvertVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface SysUserCovertBasic {

    SysUserCovertBasic INSTANCE = Mappers.getMapper(SysUserCovertBasic.class);

    UserLogindConvertVO convertDOToLoginVO(SysUserDO source);

}
