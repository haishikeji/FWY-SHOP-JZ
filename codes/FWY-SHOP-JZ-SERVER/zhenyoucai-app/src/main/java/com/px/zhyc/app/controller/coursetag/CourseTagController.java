package com.px.zhyc.app.controller.coursetag;

import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.dao.coursetag.dataobject.CourseTagDO;
import com.px.zhyc.service.coursetag.CourseTagService;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

/**
 * 线上课程标签(CourseTag)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-11 18:20:16
 */
@RestController
@Api(value = "CourseTagController", description = "模板通用操作接口")
@RequestMapping(value = "/coursetag")
public class CourseTagController extends AbstractBaseController<CourseTagDO> {

    @Autowired
    private CourseTagService courseTagService;

    @Override
    protected AbstractJpaPageBaseService<CourseTagDO> getJpaService() {
        return this.courseTagService;
    }

    @Override
    protected CourseTagDO savePreprocessing(HttpServletRequest request, CourseTagDO originObj) {
        originObj.setDeleted(0);
        return super.savePreprocessing(request, originObj);
    }

    @Override
    protected CourseTagDO modifyPreprocessing(HttpServletRequest request, CourseTagDO originObj) {
        originObj.setGmtModifyTime(new Date());
        return super.modifyPreprocessing(request, originObj);
    }

    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "tagName", value = "标签名称"),

            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "gmtCreateTime", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
//    @Permission
//    @JsonView(UserDO.ListView.class)
    public ResultData findPage(
            HttpServletRequest request,
            @RequestParam(value = "tagName", required = false) String tagName,
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "15") int pageSize,
            @RequestParam(value = "orderField", defaultValue = "gmtCreateTime") String orderField,
            @RequestParam(value = "orderBy", defaultValue = "desc") String orderBy) {

        ResultData rd = ResultData.FAIL("获取分页数据失败.");

        List<SortField> sorts = Lists.newArrayList();
        if (StringUtils.isNotBlank(orderField)) {
            SortField sortField = new SortField();
            sortField.setField(orderField);
            sortField.setSortOrder(Constants.PageOrder.valueOf(orderBy));
            sorts.add(sortField);
        }

        PageInfo<CourseTagDO> userPageList = getJpaService().findPageBySpecification(new Specification<CourseTagDO>() {
            @Override
            public Predicate toPredicate(Root<CourseTagDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                if (StringUtils.isNotBlank(tagName)) {
                    paramList.add(cb.like(root.get("name"), "%" + tagName + "%"));
                }
                return cb.and(paramList.toArray(new Predicate[paramList.size()]));
            }
        }, new PageInfo(pageNum, pageSize, sorts));

        if (userPageList != null) {
            rd = ResultData.SUCCESS("获取分页数据成功.");
            rd.put("list", userPageList.getList());
            rd.put("pageInfoParam", userPageList.getPageInfoParam());
        }
        return rd;
    }

}