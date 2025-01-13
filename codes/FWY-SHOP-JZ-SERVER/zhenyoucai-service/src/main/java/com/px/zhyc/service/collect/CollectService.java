package com.px.zhyc.service.collect;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.enums.order.OrderTypeEnum;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.dao.collect.CollectDAO;
import com.px.zhyc.dao.collect.dataobject.CollectDO;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 收藏(Collect)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-28 22:56:06
 */
@Service
public class CollectService extends AbstractJpaPageBaseService<CollectDO> {

    @Autowired
    private CollectDAO collectDAO;

    @Override
    protected MyRepository<CollectDO, Long> getPageableRepository() {
        return this.collectDAO;
    }

    public Boolean existRef(OrderTypeEnum type, Long refPk, Long memberId) {
        if (type == null || refPk == null || memberId == null) {
            return null;
        }
        List<CollectDO> dbList = findAll(Cnd.where().andEQ("type", type).andEQ("refPk", refPk).andEQ("memberId", memberId));
        return CollectionUtils.isNotEmpty(dbList) ? true : false;
    }
}