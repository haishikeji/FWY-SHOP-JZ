package com.px.zhyc.dao.activity;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.dao.activity.dataobject.ActivityDO;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

/**
 * (Activity)表数据库访问层
 *
 * @author 品讯科技
 * @since 2020-09-10 21:07:07
 */
public interface ActivityDAO extends MyRepository<ActivityDO, Long> {

    @Query(value = "select distinct activity.* from activity " +
            "left join ref_activity_series_activity ref on ref.ref_activity_pk = activity.pk " +
            "where ref.ref_activity_series_pk = :id and activity.deleted = 0", nativeQuery = true)
    List<ActivityDO> findActivityBySeries(Long id);

}