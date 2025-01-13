package com.px.zhyc.service.product;

import cn.hutool.core.lang.Tuple;
import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.dao.product.ProductDAO;
import com.px.zhyc.dao.product.dataobject.ProductDO;
import com.google.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 线上课程管理(Course)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-22 22:51:51
 */
@Service
public class ProductService extends AbstractJpaPageBaseService<ProductDO> {

    @Autowired
    private ProductDAO productDAO;

    @Override
    protected MyRepository<ProductDO, Long> getPageableRepository() {
        return this.productDAO;
    }

    public List<ProductDO> findConfigs(Long refCasePk) {
        return productDAO.findConfigs(refCasePk);
    }

    public boolean existConfig(Long refCasePk, Long refProductPk) {
        return productDAO.existConfig(refCasePk, refProductPk) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean deleteConfigRef(Long refCasePk, Long refProductPk) {
        return productDAO.deleteConfigRef(refCasePk, refProductPk) > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean saveCaseConfigRef(Long refCasePk, List<Long> refProductPks) {
        int successCount = 0;
        for (Long refProductPk : refProductPks) {
            if (existConfig(refCasePk, refProductPk)) {
                successCount += 1;
            } else {
                successCount += productDAO.saveCaseConfigRef(refCasePk, refProductPk);
            }
        }
        if (successCount != refProductPks.size()) {
            throw new RuntimeException("保存失败");
        }
        return successCount > 0;
    }
    @Transactional(rollbackFor = Exception.class)
    public boolean updateShiftStatus(Integer targetStatus, Long pk) {
        if (targetStatus == null || pk == null) {
            return false;
        }
        List<Tuple> tuples = Lists.newArrayList();
        tuples.add(new Tuple("shelfStatus", targetStatus));
        int effect = productDAO.update(tuples, Cnd.where().andEQ("id", pk));
        return effect > 0;
    }

}