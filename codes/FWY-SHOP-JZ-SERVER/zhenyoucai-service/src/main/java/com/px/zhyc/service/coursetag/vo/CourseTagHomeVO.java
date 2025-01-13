package com.px.zhyc.service.coursetag.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CourseTagHomeVO {

    @ApiModelProperty("主键")
    private Long id;

    @ApiModelProperty("标签名称")
    private String name;

    @ApiModelProperty("标签颜色")
    private String color;

    private List<CourseTagHomeInnerVO> innerCourseList;

}