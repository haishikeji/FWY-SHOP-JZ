package com.px.zhyc.service.zhuanjiaquestion;

import cn.hutool.core.lang.Tuple;
import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.dao.zhuanjiaquestion.ZhuanjiaQuestionDAO;
import com.px.zhyc.dao.zhuanjiaquestion.dataobject.ZhuanjiaQuestionDO;
import com.google.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 专家问题(ZhuanjiaQuestion)表服务接口
 *
 * @author 品讯科技
 * @since 2021-02-26 20:02:04
 */
@Service
public class ZhuanjiaQuestionService extends AbstractJpaPageBaseService<ZhuanjiaQuestionDO> {

    @Autowired
    private ZhuanjiaQuestionDAO zhuanjiaQuestionDAO;

    @Override
    protected MyRepository<ZhuanjiaQuestionDO, Long> getPageableRepository() {
        return this.zhuanjiaQuestionDAO;
    }
    @Transactional(rollbackFor = Exception.class)
    public boolean updateShiftStatus(Integer targetStatus, Long pk) {
        if (targetStatus == null || pk == null) {
            return false;
        }
        List<Tuple> tuples = Lists.newArrayList();
        tuples.add(new Tuple("shelfStatus", targetStatus));
        int effect = zhuanjiaQuestionDAO.update(tuples, Cnd.where().andEQ("id", pk));
        return effect > 0;
    }
}