package com.px.zhyc.service.activityseries;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.dao.activityseries.ActivitySeriesDAO;
import com.px.zhyc.dao.activityseries.dataobject.ActivitySeriesDO;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;

/**
 * 系列活动(ActivitySeries)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-11 16:51:12
 */
@Service
public class ActivitySeriesService extends AbstractJpaPageBaseService<ActivitySeriesDO> {

    @Autowired
    private ActivitySeriesDAO activitySeriesDAO;

    @Override
    protected MyRepository<ActivitySeriesDO, Long> getPageableRepository() {
        return this.activitySeriesDAO;
    }

    @Transactional(rollbackOn = Exception.class)
    public boolean batchRefs(Long seriesId, String refIds) {
        if (seriesId == null) {
            return false;
        }
        activitySeriesDAO.deleteSARefs(seriesId);
        int refSuccessCount = 0;
        if (StringUtils.isNotBlank(refIds)) {
            String[] idArrs = refIds.split(",");
            if (idArrs != null && idArrs.length > 0) {
                for (int i = 0; i < idArrs.length; i++) {
                    refSuccessCount += activitySeriesDAO.insertSARefs(seriesId, NumberUtils.toLong(idArrs[i]));
                }
            }
            if (idArrs.length != refSuccessCount) {
                throw new RuntimeException("num not match");
            }
        }
        return true;
    }

    @Transactional(rollbackOn = Exception.class)
    public boolean deleteRef(Long seriesId, Long refId) {
        if (seriesId == null || refId == null) {
            return false;
        }
        return activitySeriesDAO.deleteSARef(seriesId, refId) > 0;
    }



}