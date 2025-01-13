package com.px.zhyc.app.controller.question;

import cn.hutool.json.JSONObject;
import com.px.zhyc.app.annotation.Permission;
import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.common.utils.dbpage.OrderBy;
import com.px.zhyc.dao.question.dataobject.QuestionTypeDO;
import com.px.zhyc.service.question.QuestionTypeService;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

/**
 * 问题分类(BookType)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-04 21:00:26
 */
@RestController
@Api(value = "QuestionTypeController", description = "模板通用操作接口")
@RequestMapping(value = "/questiontype")
public class QuestionTypeController extends AbstractBaseController<QuestionTypeDO> {

    @Autowired
    private QuestionTypeService questionTypeService;

    @Override
    protected AbstractJpaPageBaseService<QuestionTypeDO> getJpaService() {
        return this.questionTypeService;
    }

    @Override
    protected QuestionTypeDO savePreprocessing(HttpServletRequest request, QuestionTypeDO originObj) {
        originObj.setDeleted(0);
        return super.savePreprocessing(request, originObj);
    }

    @RequestMapping(value = "tree", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "标准分类树", notes = "标准分类树", tags = { "标准分类" })
    @ApiImplicitParams(value = {
    })
    @Permission
    public ResultData tree() {
        ResultData rd;

        List<QuestionTypeDO> bookTypeDbList = questionTypeService.findAll(
                Cnd.where().andNEQ("deleted", 1)
                .orderJpaBy("refParentPk", OrderBy.asc)
                .orderJpaBy("priority", OrderBy.asc)
                .orderJpaBy("id", OrderBy.asc));
        List<Object> convertList = Lists.newLinkedList();
        if (CollectionUtils.isNotEmpty(bookTypeDbList)) {
            for (QuestionTypeDO bookTypeDO : bookTypeDbList) {
                Long key = bookTypeDO.getRefParentPk();
                if (key == 0) {
                    JSONObject obj = new JSONObject();
                    obj.put("id", bookTypeDO.getId());
                    obj.put("title", bookTypeDO.getName());
                    obj.put("level", bookTypeDO.getLevel());
                    obj.put("pid", bookTypeDO.getRefParentPk());
                    obj.put("expand", true);

                    obj.put("children", getChildren(bookTypeDO.getId(), bookTypeDbList));
                    convertList.add(obj);
                }
            }
        }

        if (CollectionUtils.isNotEmpty(bookTypeDbList)) {
            rd = ResultData.SUCCESS("获取分页数据成功.");
            rd.put("tree", convertList);
        } else {
            rd = ResultData.SUCCESS("暂无数据.");
        }
        return rd;
    }

    /**
     * 获取叶子节点目录，递归遍历
     * */
    public List<Object> getChildren(Long Id, List<QuestionTypeDO> bookTypes){
        List<Object> list = new ArrayList<>();
        for (QuestionTypeDO b : bookTypes) {
            if(b.getRefParentPk().equals(Id)){
                JSONObject obj = new JSONObject();
                obj.put("id", b.getId());
                obj.put("title", b.getName());
                obj.put("level", b.getLevel());
                obj.put("pid", b.getRefParentPk());
                obj.put("expand", false);
                obj.put("children", getChildren(b.getId(), bookTypes));
                list.add(obj);
            }
        }
        return list;
    }

}