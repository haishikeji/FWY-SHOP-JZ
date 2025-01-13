package com.px.zhyc.app.controller.zhuanjiaquestion;

import com.px.zhyc.app.annotation.Permission;
import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.dao.zhuanjiaquestion.dataobject.ZhuanjiaQuestionAnswerDO;
import com.px.zhyc.service.zhuanjiaquestion.ZhuanjiaQuestionAnswerService;
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
import java.util.List;

/**
 * 专家问题(ZhuanjiaQuestion)表控制层
 *
 * @author 品讯科技
 * @since 2021-02-26 20:06:20
 */
@RestController
@Api(value = "ZhuanjiaQuestionController", description = "模板通用操作接口")
@RequestMapping(value = "/zhuanjiaQuestion-answer")
public class ZhuanjiaQuestionAnswerController extends AbstractBaseController<ZhuanjiaQuestionAnswerDO> {


    @Autowired
    private ZhuanjiaQuestionAnswerService zhuanjiaQuestionAnswerService;

    @Override
    protected AbstractJpaPageBaseService<ZhuanjiaQuestionAnswerDO> getJpaService() {
        return this.zhuanjiaQuestionAnswerService;
    }

    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取回答分页数据", notes = "获取回答分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "questionId", value = "问题ID"),

            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "answerDate", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
    @Permission
    public ResultData findPageForAnswer(
            HttpServletRequest request,
            @RequestParam(value = "questionId", required = true) String questionId,
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "15") int pageSize,
            @RequestParam(value = "orderField", defaultValue = "answerDate") String orderField,
            @RequestParam(value = "orderBy", defaultValue = "desc") String orderBy) {

        ResultData rd = ResultData.FAIL("获取分页数据失败.");

        List<SortField> sorts = Lists.newArrayList();
        if (StringUtils.isNotBlank(orderField)) {
            SortField sortField = new SortField();
            sortField.setField(orderField);
            sortField.setSortOrder(Constants.PageOrder.valueOf(orderBy));
            sorts.add(sortField);
        }

        PageInfo<ZhuanjiaQuestionAnswerDO> userPageList =this.getJpaService().findPageBySpecification(new Specification<ZhuanjiaQuestionAnswerDO>() {
            @Override
            public Predicate toPredicate(Root<ZhuanjiaQuestionAnswerDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                paramList.add(cb.equal(root.get("questionId"), questionId));
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