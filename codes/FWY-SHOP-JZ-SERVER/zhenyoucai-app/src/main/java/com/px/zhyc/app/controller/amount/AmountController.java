package com.px.zhyc.app.controller.amount;

import com.px.zhyc.app.controller.base.AbstractBaseController;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.dao.amount.dataobject.AmountDO;
import com.px.zhyc.service.amount.AmountService;
import io.swagger.annotations.Api;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 金额表(Amount)表控制层
 *
 * @author 品讯科技
 * @since 2020-09-20 15:10:37
 */
@RestController
@Api(value = "AmountController", description = "模板通用操作接口")
@RequestMapping(value = "/amount")
public class AmountController extends AbstractBaseController<AmountDO> {

    @Autowired
    private AmountService amountService;

    @Override
    protected AbstractJpaPageBaseService<AmountDO> getJpaService() {
        return this.amountService;
    }

}