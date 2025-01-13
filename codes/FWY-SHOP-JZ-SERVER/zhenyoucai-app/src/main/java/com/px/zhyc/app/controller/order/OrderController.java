package com.px.zhyc.app.controller.order;

import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.enums.order.OrderTypeEnum;
import com.px.zhyc.common.restful.ResultData;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.Constants;
import com.px.zhyc.common.utils.PageInfo;
import com.px.zhyc.common.utils.SortField;
import com.px.zhyc.dao.order.dataobject.OrderDO;
import com.px.zhyc.service.order.OrderService;
import com.google.common.collect.Lists;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

/**
 * (Order)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-13 11:19:49
 */
@RestController
@Api(value = "OrderController", description = "模板通用操作接口")
@RequestMapping(value = "/order")
public class OrderController extends AbstractBaseController<OrderDO> {

    @Autowired
    private OrderService orderService;

    @Override
    protected AbstractJpaPageBaseService<OrderDO> getJpaService() {
        return this.orderService;
    }

    @RequestMapping(value = "findDiyPage", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "获取分页数据", notes = "获取分页数据")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "orderSn", value = "订单号"),
            @ApiImplicitParam(paramType = "query", name = "receivedPhone", value = "手机号"),
            @ApiImplicitParam(paramType = "query", name = "startTime", value = "开始时间"),
            @ApiImplicitParam(paramType = "query", name = "endTime", value = "结束时间"),
            @ApiImplicitParam(paramType = "query", name = "status", value = "订单状态(0: 待付款; 1: 进行中; 2: 已完成; 3: 已取消)"),
            @ApiImplicitParam(paramType = "query", name = "orderType", value = "订单类型"),

            @ApiImplicitParam(paramType = "query", name = "pageNum", defaultValue = "1", value = "页码"),
            @ApiImplicitParam(paramType = "query", name = "pageSize", defaultValue = "15", value = "分页条数"),
            @ApiImplicitParam(paramType = "query", name = "orderField", defaultValue = "gmtCreateTime", value = "排序字段"),
            @ApiImplicitParam(paramType = "query", name = "orderBy", defaultValue = "desc", value = "排序方式, [desc, asc]")
    })
    public ResultData findPage(
            HttpServletRequest request,
            @RequestParam(value = "orderSn", required = false) String orderSn,
            @RequestParam(value = "receivedPhone", required = false) String receivedPhone,
            @RequestParam(value = "startTime", required = false) @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date startTime,
            @RequestParam(value = "endTime", required = false) @DateTimeFormat(pattern="yyyy-MM-dd HH:mm:ss") Date endTime,
            @RequestParam(value = "status", required = false) String status,
            @RequestParam(value = "orderType", required = false) String orderType,
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

        PageInfo<OrderDO> userPageList = getJpaService().findPageBySpecification(new Specification<OrderDO>() {
            @Override
            public Predicate toPredicate(Root<OrderDO> root, CriteriaQuery<?> criteria, CriteriaBuilder cb) {
                List<Predicate> paramList = Lists.newArrayList();
                if (StringUtils.isNotBlank(orderSn)) {
                    paramList.add(cb.like(root.get("orderSn"), "%" + orderSn + "%"));
                }
                if (StringUtils.isNotBlank(receivedPhone)) {
                    paramList.add(cb.like(root.get("receivedPhone"), "%" + receivedPhone + "%"));
                }
                if (startTime != null) {
                    paramList.add(cb.greaterThanOrEqualTo(root.get("gmtCreateTime"), startTime));
                }
                if (endTime != null) {
                    paramList.add(cb.lessThanOrEqualTo(root.get("gmtCreateTime"), endTime));
                }

                if (StringUtils.isNotBlank(orderType)) {
                    String[] arrs = StringUtils.split(orderType, ",");
                    CriteriaBuilder.In<OrderTypeEnum> in = cb.in(root.get("orderType"));
                    for (String s : arrs) {
                        in.value(OrderTypeEnum.valueOf(s));
                    }
                    paramList.add(in);
                }

                if (StringUtils.isNotBlank(status)) {
                    String[] arrs = StringUtils.split(status, ",");
                    CriteriaBuilder.In<Integer> in = cb.in(root.get("status"));
                    for (String s : arrs) {
                        in.value(NumberUtils.toInt(s));
                    }
                    paramList.add(in);
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



    @RequestMapping(value = "modify/send/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "修改发货状态")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "path", name = "id", value = "编号", required = true),
    })
//    @Permission
    public ResultData send(@PathVariable(value = "id") Long id) {

        ResultData rd = ResultData.FAIL("发货失败.");
        if (orderService.modifySend(id)) {
            rd = ResultData.SUCCESS("发货成功.");
            rd.put("flag", true);
        }
        return rd;
    }

    @RequestMapping(value = "modify/refund/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "修改退款状态")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "path", name = "id", value = "编号", required = true),
    })
//    @Permission
    public ResultData refund(@PathVariable(value = "id") Long id) {

        ResultData rd = ResultData.FAIL("退款失败.");
        if (orderService.modifyRefund(id)) {
            rd = ResultData.SUCCESS("退款成功.");
            rd.put("flag", true);
        }
        return rd;
    }

    @RequestMapping(value = "modify/reject/send", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "拒绝送餐")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "id", value = "编号", required = true),
            @ApiImplicitParam(paramType = "query", name = "remark", value = "描述"),
    })
//    @Permission
    public ResultData modifyRejectSend(@RequestParam(value = "id", required = false) Long id,
                                   @RequestParam(value = "remark", required = false) String remark) {

        ResultData rd = ResultData.FAIL("拒绝送餐失败.");
        if (orderService.modifyCancelReason(2, remark, id)) {
            rd = ResultData.SUCCESS("拒绝送餐成功.");
            rd.put("flag", true);
        }
        return rd;
    }

    @RequestMapping(value = "modify/reject/refund", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "拒绝退款")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "query", name = "id", value = "编号", required = true),
            @ApiImplicitParam(paramType = "query", name = "remark", value = "描述"),
    })
//    @Permission
    public ResultData modifyRejectRefund(@RequestParam(value = "id", required = false) Long id,
                                   @RequestParam(value = "remark", required = false) String remark) {

        ResultData rd = ResultData.FAIL("拒绝退款失败.");
        if (orderService.modifyCancelReason(3, remark, id)) {
            rd = ResultData.SUCCESS("拒绝退款成功.");
            rd.put("flag", true);
        }
        return rd;
    }

    @RequestMapping(value = "completed/{id}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ApiOperation(value = "设置订单为已完成")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(paramType = "path", name = "id", value = "编号", required = true),
    })
//    @Permission
    public ResultData orderCompleted(@PathVariable(value = "id") Long id) {

        ResultData rd = ResultData.FAIL("设置已完成失败.");
        if (orderService.updateOrderStatus(2, 1, id)) {
            rd = ResultData.SUCCESS("设置已完成成功.");
            rd.put("flag", true);
        }
        return rd;
    }

}