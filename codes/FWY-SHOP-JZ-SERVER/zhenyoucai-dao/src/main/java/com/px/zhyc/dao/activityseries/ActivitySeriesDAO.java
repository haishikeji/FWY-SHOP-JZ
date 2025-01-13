package com.px.zhyc.dao.activityseries;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.dao.activityseries.dataobject.ActivitySeriesDO;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

/**
 * 系列活动(ActivitySeries)表数据库访问层
 *
 * @author 品讯科技
 * @since 2020-09-11 16:14:07
 */
public interface ActivitySeriesDAO extends MyRepository<ActivitySeriesDO, Long> {

    @Modifying
    @Query(value = "delete from ref_activity_series_activity where ref_activity_series_pk = :seriesId", nativeQuery = true)
    public int deleteSARefs(Long seriesId);

    @Modifying
    @Query(value = "insert into ref_activity_series_activity(ref_activity_series_pk, ref_activity_pk, version) values (:seriesId, :refActivityId, 0)", nativeQuery = true)
    public int insertSARefs(Long seriesId, Long refActivityId);

    @Modifying
    @Query(value = "delete from ref_activity_series_activity where ref_activity_series_pk = :seriesId and ref_activity_pk = :refActivityId", nativeQuery = true)
    public int deleteSARef(Long seriesId, Long refActivityId);

}