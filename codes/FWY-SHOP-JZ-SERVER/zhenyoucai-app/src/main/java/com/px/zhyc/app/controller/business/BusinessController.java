package com.px.zhyc.app.controller.business;

import com.px.zhyc.app.annotation.Permission;
import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.dao.business.dataobject.BusinessDO;
import com.px.zhyc.service.business.BusinessService;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 商家(Business)表控制层
 *
 * @author 品讯科技
 * @since 2020-11-16 14:09:00
 */
@RestController
@Api(value = "BusinessController", description = "模板通用操作接口")
@RequestMapping(value = "/business")
public class BusinessController extends AbstractBaseController<BusinessDO> {

    @Autowired
    private BusinessService businessService;

    @Override
    protected AbstractJpaPageBaseService<BusinessDO> getJpaService() {
        return this.businessService;
    }


    @Override
    protected BusinessDO savePreprocessing(HttpServletRequest request, BusinessDO originObj) {
        originObj.setDeleted(0);
        return super.savePreprocessing(request, originObj);
    }

    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "name", value = "产品名称"),
            @ApiImplicitParam(paramType = "query", name = "shelfStatus", value = "上架状态(0: 未上架; 1: 已上架)"),

            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "gmtCreateTime", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
    @Permission
    public ResultData findPage(
            HttpServletRequest request,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "shelfStatus", required = false) Integer shelfStatus,
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

        PageInfo<BusinessDO> userPageList = getJpaService().findPageBySpecification(new Specification<BusinessDO>() {
            @Override
            public Predicate toPredicate(Root<BusinessDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                if (StringUtils.isNotBlank(name)) {
                    paramList.add(cb.like(root.get("name"), "%" + name + "%"));
                }
                if (shelfStatus != null) {
                    paramList.add(cb.equal(root.get("shelfStatus"), shelfStatus));
                }
                paramList.add(cb.equal(root.get("deleted"), 0));
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

    @RequestMapping(value = "setShift/{id}/{shiftStatus}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "设置上下架状态")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "path", name = "id", value = "编号", required = true),
            @ApiImplicitParam(paramType = "path", name = "shiftStatus", value = "编号", required = true),
    })
    @Permission
    public ResultData setShift(@PathVariable(value = "id") Long id, @PathVariable(value = "shiftStatus") Integer shiftStatus) {

        ResultData rd = ResultData.FAIL("设置已完成失败.");
        if (this.businessService.updateShiftStatus(shiftStatus,id)) {
            rd = ResultData.SUCCESS("设置已完成成功.");
            rd.put("flag", true);
        }
        return rd;
    }
}