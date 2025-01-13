package com.px.zhyc.service.place;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.dao.place.PlaceDAO;
import com.px.zhyc.dao.place.dataobject.PlaceDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 场地(Place)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-10 22:33:42
 */
@Service
public class PlaceService extends AbstractJpaPageBaseService<PlaceDO> {

    @Autowired
    private PlaceDAO placeDAO;

    @Override
    protected MyRepository<PlaceDO, Long> getPageableRepository() {
        return this.placeDAO;
    }

}