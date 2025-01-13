package com.px.zhyc.service.place.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.collections.CollectionUtils;

import java.util.List;

@Getter
@Setter
public class PlaceAppointmentVO {

    /**
     * 天
     */
    @ApiModelProperty("天")
    private String day;

    /**
     * 星期几
     */
    @ApiModelProperty("星期几")
    private String week;

    /**
     * 开始预订时间
     */
    @ApiModelProperty("开始预订时间")
    private String startTime;

    /**
     * 预约时间段
     */
    @ApiModelProperty("预约时间段")
    private List<PlaceAppointmentTimeVO> times;

    public boolean getIsFull() {
        boolean isFull = true;
        if (CollectionUtils.isNotEmpty(times)) {
            for (PlaceAppointmentTimeVO time : times) {
                if (time.isAppointment() == false) {
                    isFull = false;
                    break;
                }
            }
        }
        return isFull;
    }

}
