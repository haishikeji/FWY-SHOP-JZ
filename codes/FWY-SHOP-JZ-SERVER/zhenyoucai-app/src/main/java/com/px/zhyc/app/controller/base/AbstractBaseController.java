package com.px.zhyc.app.controller.base;

import com.px.zhyc.app.annotation.Permission;
import com.px.zhyc.common.entity.AbstractDO;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.common.utils.dbpage.OrderBy;
import com.google.common.collect.Lists;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * 描述: 通用Controller基类
 *
 * @author 品讯科技
 * @create 2018-10-23 9:13
 */
public abstract class AbstractBaseController<T extends AbstractDO> {

    public final static Logger logger = LoggerFactory.getLogger(AbstractBaseController.class);

    /**
     * 抽象数据操作接口
     * @return
     */
    protected abstract AbstractJpaPageBaseService<T> getJpaService();

    /**
     * 对保存进行预处理
     * @return
     */
    protected T savePreprocessing(HttpServletRequest request, T originObj) {
        return originObj;
    }

    /**
     * 对修改进行预处理
     * @return
     */
    protected T modifyPreprocessing(HttpServletRequest request, T originObj) {
        return originObj;
    }

    @RequestMapping(value = "", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "gmtCreateTime", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
    @Permission
    public ResultData findPage(
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

        /**
         * 查询方法第一个参数为对象, 可设置属性值, 自动匹配相关搜索条件
         */
        PageInfo<T> dbPageList = getJpaService().findPage(Cnd.where().orderBy(orderField, OrderBy.valueOf(orderBy)), new PageInfo(pageNum, pageSize, sorts));
        if (dbPageList != null) {
            rd = ResultData.SUCCESS("获取分页数据成功.");
            rd.put("list", dbPageList.getList());
            rd.put("pageInfoParam", dbPageList.getPageInfoParam());
        }
        return rd;
    }

    @RequestMapping(value = "detail/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取详情信息", notes = "获取详情信息")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "path", name = "id", value = "编号", required = true),
    })
    @Permission
    public ResultData detail(@PathVariable(value = "id") Long id) {

        ResultData rd = ResultData.FAIL("获取详情数据失败.");
        T obj = getJpaService().get(id);
        if (obj != null) {
            rd = ResultData.SUCCESS("获取详情数据成功.");
            rd.put("vo", obj);
        }
        return rd;
    }

    @RequestMapping(value = "", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "保存信息", notes = "保存信息")
    @Permission
    public ResultData save(HttpServletRequest request, @RequestBody T t) {

        ResultData rd = ResultData.FAIL("保存失败.");
        if (t == null || t.getId() != null) {
            return ResultData.PARAMS_ERROR();
        }
        t = savePreprocessing(request, t);
        if (getJpaService().saveOrUpdate(t) != null) {
            rd = ResultData.SUCCESS("保存成功.");
            rd.put("id",t.getId());
        }
        return rd;
    }

    @RequestMapping(value = "", method = RequestMethod.PUT, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "修改数据信息", notes = "修改数据信息")
    @Permission
    public ResultData update(HttpServletRequest request, @RequestBody T t) {
        ResultData rd = ResultData.FAIL("修改失败.");
        if (t == null || t.getId() == null) {
            return ResultData.PARAMS_ERROR();
        }
        t = modifyPreprocessing(request, t);
        if (getJpaService().saveOrUpdate(t) != null) {
            rd = ResultData.SUCCESS("修改成功.");
        }
        return rd;
    }

    @RequestMapping(value = "logic/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "逻辑删除数据", notes = "逻辑删除数据")
    @Permission
    public ResultData logicDelete(@PathVariable("id") Long id) {

        ResultData rd = ResultData.FAIL("删除失败.");
        if (id == null) {
            return ResultData.PARAMS_ERROR();
        }
        if (getJpaService().logicDelete(id)) {
            rd = ResultData.SUCCESS("删除成功.");
        }
        return rd;
    }

    @RequestMapping(value = "physics/{id}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "物理删除数据", notes = "物理删除数据")
    @Permission
    public ResultData physicsDelete(@PathVariable("id") Long id) {

        ResultData rd = ResultData.FAIL("删除数据失败.");
        if (id == null) {
            return ResultData.PARAMS_ERROR();
        }
        if (getJpaService().physicsDelete(id)) {
            rd = ResultData.SUCCESS("删除数据成功.");
        }
        return rd;
    }

    @RequestMapping(value = "physicsBatch/{ids}", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "物理删除数据", notes = "物理删除数据")
    @Permission
    public ResultData physicsBatchDelete(@PathVariable("ids") String ids) {

        ResultData rd = ResultData.FAIL("删除数据失败.");
        if (StringUtils.isBlank(ids)) {
            return ResultData.PARAMS_ERROR();
        }
        String[] splits = ids.split(",");
        if (splits.length > 0) {
            for (String split : splits) {
                getJpaService().physicsDelete(NumberUtils.toLong(split));
            }
        }
        return ResultData.SUCCESS("删除数据成功.");
    }

}
