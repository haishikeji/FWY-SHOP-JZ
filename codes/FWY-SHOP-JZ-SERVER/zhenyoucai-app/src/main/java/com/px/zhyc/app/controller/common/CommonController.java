package com.px.zhyc.app.controller.common;

import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.utils.*;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
@Api(value = "CommonController", description = "模板通用操作接口")
@RequestMapping(value = "/common")
public class CommonController {
    public final static Logger logger = LoggerFactory.getLogger(CommonController.class);
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
                rd = ResultData.FAIL("上传失败");
            }
        } catch (IOException ex) {
            logger.error("上传文件出错, ", ex);
        }
        return rd;
    }

}