package com.px.zhyc.app.controller.dictionary;

import com.px.zhyc.app.annotation.Permission;
import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.common.utils.dbpage.OrderBy;
import com.px.zhyc.dao.dictionary.dataobject.DictionaryDO;
import com.px.zhyc.service.dictionary.DictionaryService;
import com.px.zhyc.service.dictionary.params.DictionaryBatchModifyParams;
import com.fasterxml.jackson.annotation.JsonView;
import com.google.common.collect.Lists;
import com.google.common.collect.Maps;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
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
import java.util.Map;

/**
 * (Dictionary)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-10 22:33:09
 */
@RestController
@Api(value = "DictionaryController", description = "模板通用操作接口")
@RequestMapping(value = "/dictionary")
public class DictionaryController extends AbstractBaseController<DictionaryDO> {

    @Autowired
    private DictionaryService dictionaryService;

    @Override
    protected AbstractJpaPageBaseService<DictionaryDO> getJpaService() {
        return this.dictionaryService;
    }


    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "type", value = "分类"),
            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "type", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "asc", value = "排序方式, [desc, asc]")
    })
    @Permission
//    @JsonView(UserDO.ListView.class)
    public ResultData findPage(
            HttpServletRequest request,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "pageNum", defaultValue = "1") int pageNum,
            @RequestParam(value = "pageSize", defaultValue = "15") int pageSize,
            @RequestParam(value = "orderField", defaultValue = "type") String orderField,
            @RequestParam(value = "orderBy", defaultValue = "asc") String orderBy) {

        ResultData rd = ResultData.FAIL("获取分页数据失败.");

        List<SortField> sorts = Lists.newArrayList();
        if (StringUtils.isNotBlank(orderField)) {
            SortField sortField = new SortField();
            sortField.setField(orderField);
            sortField.setSortOrder(Constants.PageOrder.valueOf(orderBy));
            sorts.add(sortField);


            SortField sortField1 = new SortField();
            sortField1.setField("priority");
            sortField1.setSortOrder(Constants.PageOrder.valueOf(orderBy));
            sorts.add(sortField1);
        }

        PageInfo<DictionaryDO> userPageList = getJpaService().findPageBySpecification(new Specification<DictionaryDO>() {
            @Override
            public Predicate toPredicate(Root<DictionaryDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                if (StringUtils.isNotBlank(type)) {
                    paramList.add(cb.like(root.get("type"), "%" + type + "%"));
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

    @RequestMapping(value = "findByType", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "type", value = "分类"),
    })
    @Permission
    @JsonView(DictionaryDO.ShowNormalView.class)
    public ResultData findByType(
            HttpServletRequest request,
            @RequestParam(value = "type", required = false) String type) {

        ResultData rd = ResultData.FAIL("获取分页数据失败.");
        if (StringUtils.isBlank(type)) {
            return ResultData.FAIL("未找到: [ type ] 参数字段");
        }
        Cnd cnd = Cnd.where().andEQ("type", type).orderJpaBy("type", OrderBy.asc).orderJpaBy("priority", OrderBy.asc);
        List<DictionaryDO> dbList = getJpaService().findAll(cnd);
        if (dbList != null) {
            rd = ResultData.SUCCESS("获取分页数据成功.");

            Map<String, String> mapping = Maps.newHashMap();
            for (DictionaryDO dictionaryDO : dbList) {
                mapping.put(dictionaryDO.getCode(), dictionaryDO.getValue());
            }
            rd.put("list", dbList);
            rd.put("mapping", mapping);
        }
        return rd;
    }

    @RequestMapping(value = "batchModify", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "修改数据信息", notes = "修改数据信息")
    @Permission
    public ResultData update(HttpServletRequest request, @RequestBody DictionaryBatchModifyParams modifyParams) {
        ResultData rd = ResultData.FAIL("修改失败.");
        if (modifyParams == null || CollectionUtils.isEmpty(modifyParams.getDictionaries())) {
            return ResultData.PARAMS_ERROR();
        }
        if (dictionaryService.batchModify(modifyParams.getDictionaries())) {
            rd = ResultData.SUCCESS("修改成功.");
        }
        return rd;
    }

}