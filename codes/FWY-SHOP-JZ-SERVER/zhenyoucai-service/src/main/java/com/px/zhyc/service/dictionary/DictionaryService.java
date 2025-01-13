package com.px.zhyc.service.dictionary;

import cn.hutool.core.lang.Tuple;
import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.common.utils.dbpage.OrderBy;
import com.px.zhyc.dao.dictionary.DictionaryDAO;
import com.px.zhyc.dao.dictionary.dataobject.DictionaryDO;
import com.px.zhyc.service.dictionary.params.DictionaryBatchModifyInnerParams;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * (Dictionary)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-10 22:33:03
 */
@Service
public class DictionaryService extends AbstractJpaPageBaseService<DictionaryDO> {

    @Autowired
    private DictionaryDAO dictionaryDAO;

    @Override
    protected MyRepository<DictionaryDO, Long> getPageableRepository() {
        return this.dictionaryDAO;
    }

    public List<DictionaryDO> getDictsByType(String type) {
        if (StringUtils.isBlank(type)) {
            return Lists.newArrayList();
        }
        Cnd cnd = Cnd.where().andEQ("type", type).orderJpaBy("type", OrderBy.asc).orderJpaBy("priority", OrderBy.asc);
        return findAll(cnd);
    }

    public DictionaryDO getMappingByTypeAndCode(String type, String code) {
        if (StringUtils.isBlank(type)) {
            return null;
        }
        Cnd cnd = Cnd.where().andEQ("type", type).andEQ("code", code).orderJpaBy("type", OrderBy.asc).orderJpaBy("priority", OrderBy.asc);
        List<DictionaryDO> dbDictList = findAll(cnd);
        return CollectionUtils.isNotEmpty(dbDictList) ? dbDictList.get(0) : null;
    }

    public Map<String, DictionaryDO> getDictMappingByType(String type) {
        if (StringUtils.isBlank(type)) {
            return Maps.newLinkedHashMap();
        }
        Map<String, DictionaryDO> convertMap = Maps.newLinkedHashMap();
        List<DictionaryDO> dbList = getDictsByType(type);
        if (CollectionUtils.isNotEmpty(dbList)) {
            for (DictionaryDO dictionaryDO : dbList) {
                convertMap.put(dictionaryDO.getCode(), dictionaryDO);
            }
        }
        return convertMap;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean batchModify(List<DictionaryBatchModifyInnerParams> dictionaries) {
        if (CollectionUtils.isEmpty(dictionaries)) {
            return false;
        }
        int successTotal = 0;
        for (DictionaryBatchModifyInnerParams dictionary : dictionaries) {
            if (StringUtils.isBlank(dictionary.getType()) || StringUtils.isBlank(dictionary.getCode()) || StringUtils.isBlank(dictionary.getValue())) {
                return false;
            }
            successTotal += dictionaryDAO.update(new Tuple("value", dictionary.getValue()), Cnd.where().andEQ("type", dictionary.getType()).andEQ("code", dictionary.getCode()));
        }
        if (successTotal != dictionaries.size()) {
            throw new RuntimeException("修改失败");
        }
        return true;
    }

}