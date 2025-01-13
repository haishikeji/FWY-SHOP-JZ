package com.px.zhyc.service.memberaddr;

import cn.hutool.core.lang.Tuple;
import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.dao.memberaddr.MemberAddrDAO;
import com.px.zhyc.dao.memberaddr.dataobject.MemberAddrDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * (MemberAddr)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-13 10:13:47
 */
@Service
public class MemberAddrService extends AbstractJpaPageBaseService<MemberAddrDO> {

    @Autowired
    private MemberAddrDAO memberAddrDAO;

    @Override
    protected MyRepository<MemberAddrDO, Long> getPageableRepository() {
        return this.memberAddrDAO;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveAddr(MemberAddrDO memberAddrDO) {
        if (memberAddrDO.getId()!= null || memberAddrDO.getMemberId() == null) {
            return false;
        }
        if (memberAddrDO.getIsDefault() == 1) {
            memberAddrDAO.update(new Tuple("is_default", 0), Cnd.where().andEQ("member_id", memberAddrDO.getMemberId()));
        }
        return saveOrUpdate(memberAddrDO) != null;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean updateAddr(MemberAddrDO memberAddrDO) {
        if (memberAddrDO.getId() == null || memberAddrDO.getMemberId() == null) {
            return false;
        }
        memberAddrDAO.update(new Tuple("is_default", 0), Cnd.where().andEQ("member_id", memberAddrDO.getMemberId()));
        return saveOrUpdate(memberAddrDO) != null;
    }

}