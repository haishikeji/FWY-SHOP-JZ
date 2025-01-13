package com.px.zhyc.app.controller.standard;

import com.px.zhyc.app.annotation.Permission;
import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.*;
import com.px.zhyc.dao.standard.dataobject.StandardDO;
import com.px.zhyc.service.standard.StandardService;
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
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.List;

/**
 * (Book)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-06 23:20:50
 */
@RestController
@Api(value = "StandardController", description = "模板通用操作接口")
@RequestMapping(value = "/standard")
public class StandardController extends AbstractBaseController<StandardDO> {

    @Autowired
    private StandardService standardService;

    @Override
    protected AbstractJpaPageBaseService<StandardDO> getJpaService() {
        return this.standardService;
    }

    @Override
    protected StandardDO savePreprocessing(HttpServletRequest request, StandardDO originObj) {
        originObj.setDeleted(0);
        return super.savePreprocessing(request, originObj);
    }

    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "standardName", value = "标准名称"),
            @ApiImplicitParam(paramType = "query", name = "author", value = "作者"),
            @ApiImplicitParam(paramType = "query", name = "shelfStatus", value = "上架状态(0: 未上架; 1: 已上架)"),

            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "gmtCreateTime", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
    @Permission
//    @JsonView(UserDO.ListView.class)
    public ResultData findPage(
            HttpServletRequest request,
            @RequestParam(value = "standardName", required = false) String standardName,
            @RequestParam(value = "author", required = false) String author,
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

        PageInfo<StandardDO> userPageList = getJpaService().findPageBySpecification(new Specification<StandardDO>() {
            @Override
            public Predicate toPredicate(Root<StandardDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                if (StringUtils.isNotBlank(standardName)) {
                    paramList.add(cb.like(root.get("name"), "%" + standardName + "%"));
                }
                if (StringUtils.isNotBlank(author)) {
                    paramList.add(cb.like(root.get("author"), "%" + author + "%"));
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

    @PostMapping(value = "/up")
    public ResultData uploadFile(HttpServletRequest request, @RequestParam("file") MultipartFile uploadFile, @RequestParam(value = "dir", required = false) String dir) {

//        UserLogindConvertDTO currentLoginedUser = WebPageUtils.getCurrentLoginedUser(request);

        ResultData<Object> rd = ResultData.FAIL();

        if (uploadFile.isEmpty()) {
            return ResultData.FAIL("请选择一个文件");
        }
        List<String> errMsgs = Lists.newArrayList();
        try {
            String originFileName = uploadFile.getOriginalFilename();
            String suffixName = originFileName.substring(originFileName.lastIndexOf("."));

            ResultData upRd = FileDbUtils.upload(dir, uploadFile.getInputStream(), originFileName, suffixName);
            if (upRd.getCode() == 0) {
                rd = ResultData.SUCCESS("上传成功");
                rd.setData(upRd.getData());
            } else {
                rd = ResultData.SUCCESS("上传失败");
            }
        } catch (IOException ex) {
            logger.error("上传文件出错, ", ex);
        }
        return rd;
    }
    @RequestMapping(value = "setShift/{id}/{shiftStatus}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "设置上下架状态")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "path", name = "id", value = "编号", required = true),
            @ApiImplicitParam(paramType = "path", name = "shiftStatus", value = "编号", required = true),
    })
//    @Permission
    public ResultData setShift(@PathVariable(value = "id") Long id,@PathVariable(value = "shiftStatus") Integer shiftStatus) {

        ResultData rd = ResultData.FAIL("设置已完成失败.");
        if (this.standardService.updateShiftStatus(shiftStatus,id)) {
            rd = ResultData.SUCCESS("设置已完成成功.");
            rd.put("flag", true);
        }
        return rd;
    }
}