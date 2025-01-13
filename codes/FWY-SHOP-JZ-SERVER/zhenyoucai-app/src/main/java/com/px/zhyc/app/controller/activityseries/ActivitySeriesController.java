package com.px.zhyc.app.controller.activityseries;

import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.dao.activityseries.dataobject.ActivitySeriesDO;
import com.px.zhyc.service.activityseries.ActivitySeriesService;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
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
 * 系列活动(ActivitySeries)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-11 16:02:15
 */
@RestController
@Api(value = "ActivitySeriesController", description = "模板通用操作接口")
@RequestMapping(value = "/activityseries")
public class ActivitySeriesController extends AbstractBaseController<ActivitySeriesDO> {

    @Autowired
    private ActivitySeriesService activitySeriesService;

    @Override
    protected AbstractJpaPageBaseService<ActivitySeriesDO> getJpaService() {
        return this.activitySeriesService;
    }

    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "seriesName", value = "系列活动名称"),
            @ApiImplicitParam(paramType = "query", name = "group", value = "适合人群"),
            @ApiImplicitParam(paramType = "query", name = "fitAge", value = "适合年龄段"),
            @ApiImplicitParam(paramType = "query", name = "shelfStatus", value = "上架状态(0: 未上架; 1: 已上架)"),

            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "gmtCreateTime", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
//    @Permission
//    @JsonView(UserDO.ListView.class)
    public ResultData findPage(
            HttpServletRequest request,
            @RequestParam(value = "seriesName", required = false) String seriesName,
            @RequestParam(value = "fitGroup", required = false) Integer fitGroup,
            @RequestParam(value = "fitAge", required = false) Integer fitAge,
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

        PageInfo<ActivitySeriesDO> userPageList = getJpaService().findPageBySpecification(new Specification<ActivitySeriesDO>() {
            @Override
            public Predicate toPredicate(Root<ActivitySeriesDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                if (StringUtils.isNotBlank(seriesName)) {
                    paramList.add(cb.like(root.get("name"), "%" + seriesName + "%"));
                }
                if (fitGroup != null) {
                    if (fitGroup == 0) {
                        paramList.add(cb.equal(root.get("fitChildren"), 1));
                    } else if (fitGroup == 1) {
                        paramList.add(cb.equal(root.get("fitAdult"), 1));
                    }
                }
                if (fitAge != null) {
                    paramList.add(cb.equal(root.join("ages").get("id"), fitAge));
                }
                if (shelfStatus != null) {
                    paramList.add(cb.equal(root.get("shelfStatus"), shelfStatus));
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

    @RequestMapping(value = "batchRefs", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "保存系列活动和活动之前的关联关系")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "body", name = "seriesId", value = "系列编号"),
            @ApiImplicitParam(paramType = "body", name = "refIds", value = "活动编号(拼接字符串, 以逗号分隔)")
    })
//    @Permission
//    @JsonView(UserDO.ListView.class)
    public ResultData batchRefs(
            HttpServletRequest request,
            @RequestBody Map<String, String> paramMap) {
        ResultData rd = ResultData.SUCCESS("批量处理完成.");

        Long seriesId = NumberUtils.toLong(paramMap.get("seriesId"));
        String refIds = paramMap.get("refIds");

        boolean batchEffect = activitySeriesService.batchRefs(seriesId, refIds);
        rd.put("status", batchEffect);
        return rd;
    }

    @RequestMapping(value = "deleteRef", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "删除系列活动和活动的关联关系")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "body", name = "seriesId", value = "系列编号"),
            @ApiImplicitParam(paramType = "body", name = "refId", value = "活动编号")
    })
    public ResultData deleteRef(
            HttpServletRequest request,
            @RequestBody Map<String, String> paramMap) {
        ResultData rd = ResultData.SUCCESS("批量处理完成.");

        Long seriesId = NumberUtils.toLong(paramMap.get("seriesId"));
        Long refId = NumberUtils.toLong(paramMap.get("refId"));

        boolean batchEffect = activitySeriesService.deleteRef(seriesId, refId);
        rd.put("status", batchEffect);
        return rd;
    }

}