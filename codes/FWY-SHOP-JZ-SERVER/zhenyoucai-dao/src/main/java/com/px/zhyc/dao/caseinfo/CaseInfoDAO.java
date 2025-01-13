package com.px.zhyc.dao.caseinfo;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.dao.caseinfo.dataobject.CaseInfoDO;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


/**
 * 案例(Case)表数据库访问层
 *
 * @author 品讯科技
 * @since 2020-11-16 10:17:46
 */
public interface CaseInfoDAO extends MyRepository<CaseInfoDO, Long> {

    @Query(value = "select distinct case_info.* from case_info " +
            "left join ref_case_product on ref_case_product.ref_case_pk = case_info.pk " +
            "where case_info.deleted = 0  and ref_case_product.ref_product_pk = :productId ", nativeQuery = true)
    List<CaseInfoDO> findCaseByProduct(Long productId);
}