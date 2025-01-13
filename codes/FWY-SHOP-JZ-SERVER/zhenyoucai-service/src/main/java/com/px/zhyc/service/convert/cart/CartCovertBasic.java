package com.px.zhyc.service.convert.cart;

import com.px.zhyc.dao.cart.dataobject.CartDO;
import com.px.zhyc.service.cart.vo.ApiCartVO;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartCovertBasic {

    CartCovertBasic INSTANCE = Mappers.getMapper(CartCovertBasic.class);

    ApiCartVO convertToVO(CartDO source);

    List<ApiCartVO> convertToVOs(List<CartDO> sources);

}
