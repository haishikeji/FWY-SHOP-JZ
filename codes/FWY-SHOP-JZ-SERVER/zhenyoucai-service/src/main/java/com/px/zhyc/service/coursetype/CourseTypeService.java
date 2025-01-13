package com.px.zhyc.service.coursetype;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.dao.coursetype.CourseTypeDAO;
import com.px.zhyc.dao.coursetype.dataobject.CourseTypeDO;
import com.google.common.collect.Lists;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.*;
import java.util.List;

/**
 * 线上课程分类(CourseType)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-11 18:19:49
 */
@Service
public class CourseTypeService extends AbstractJpaPageBaseService<CourseTypeDO> {

    @Autowired
    private CourseTypeDAO courseTypeDAO;

    @Override
    protected MyRepository<CourseTypeDO, Long> getPageableRepository() {
        return this.courseTypeDAO;
    }

    /**
     * 获取可展示分类列表
     * @param group
     * @return
     */
    public List<CourseTypeDO> findTypeByGroup(boolean existHome, int group) {

        List<CourseTypeDO> typePageList = findAllBySpecification(new Specification<CourseTypeDO>() {
            @Override
            public Predicate toPredicate(Root<CourseTypeDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();

                paramList.add(cb.equal(root.get("level"), 1));
                paramList.add(cb.notEqual(root.get("deleted"), 1));
                if (group == 0) {
                    paramList.add(cb.equal(root.get("fitChildren"), 1));
                } else if (group == 1) {
                    paramList.add(cb.equal(root.get("fitAdult"), 1));
                }
                if (existHome) {
                    paramList.add(cb.equal(root.get("showHome"), 1));
                }
                List<Order> convertOrders = Lists.newArrayList();
                convertOrders.add(cb.asc(root.get("priority").as(String.class)));
                convertOrders.add(cb.asc(root.get("id").as(String.class)));
                criteria.orderBy(convertOrders);
                return cb.and(paramList.toArray(new Predicate[paramList.size()]));
            }
        });

        return typePageList;
    }

}