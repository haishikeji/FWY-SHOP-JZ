package com.px.zhyc.service.amount;

import cn.hutool.core.lang.Tuple;
import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.enums.amount.AmountHistoryOper;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.utils.dbpage.Cnd;
import com.px.zhyc.dao.amount.AmountDAO;
import com.px.zhyc.dao.amount.dataobject.AmountDO;
import com.px.zhyc.dao.amounthistory.dataobject.AmountHistoryDO;
import com.px.zhyc.service.amounthistory.AmountHistoryService;
import com.px.zhyc.service.order.OrderService;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 * 金额表(Amount)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-20 15:10:27
 */
@Service
public class AmountService extends AbstractJpaPageBaseService<AmountDO> {

    @Autowired
    private AmountDAO amountDAO;

    @Autowired
    private AmountHistoryService amountHistoryService;

    @Autowired
    private OrderService orderService;

    @Override
    protected MyRepository<AmountDO, Long> getPageableRepository() {
        return this.amountDAO;
    }

    @Transactional(rollbackFor = Exception.class)
    public AmountDO findByMemberId(Long memberId) {
        if (memberId == null) {
            return null;
        }
        List<AmountDO> amountList = findAll(Cnd.where().andEQ("memberId", memberId));
        return CollectionUtils.isNotEmpty(amountList) ? amountList.get(0) : null;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean updateMoney(BigDecimal newMoney, BigDecimal oldMoney, Long memberId) {
        if (newMoney == null || oldMoney == null || memberId == null) {
            return false;
        }
        Cnd cnd = Cnd.where().andEQ("money", oldMoney).andEQ("memberId", memberId);
        if (newMoney.compareTo(oldMoney) == -1) {
            cnd.andGE("money", newMoney);
        }
        int effect = amountDAO.update(new Tuple("money", newMoney), cnd);
        return effect > 0;
    }

    @Transactional(rollbackFor = Exception.class)
    public boolean updateDeposit(BigDecimal newMoney, BigDecimal oldMoney, Long memberId) {
        if (newMoney == null || oldMoney == null || memberId == null) {
            return false;
        }
        Cnd cnd = Cnd.where().andEQ("freeze", oldMoney).andEQ("memberId", memberId);
        int effect = amountDAO.update(new Tuple("freeze", newMoney), cnd);
        return effect > 0;
    }






    @Transactional(rollbackFor = Exception.class)
    public boolean payAmountBalanceOrder(BigDecimal balance, boolean existSurplusPay, Long memberId, Long orderId) {
        if (balance == null || memberId == null || orderId == null) {
            return false;
        }
        AmountDO dbAmountDO = findByMemberId(memberId);
        if (dbAmountDO == null) {
            dbAmountDO = new AmountDO();
            dbAmountDO.setMoney(new BigDecimal(0));
            dbAmountDO.setFreeze(new BigDecimal(0));
            dbAmountDO.setMemberId(memberId);
            dbAmountDO.setGmtCreateTime(new Date());
            dbAmountDO.setVersion(0L);
            saveOrUpdate(dbAmountDO);
            if (dbAmountDO.getId() == null) {
                return false;
            }
        }

        boolean updateMoneyFlag = false;
        boolean orderStatusFlag = false;
        BigDecimal afterMoney;
        boolean isExistBalance = dbAmountDO.getMoney().compareTo(balance) >= 0;
        if (isExistBalance) {
            afterMoney = dbAmountDO.getMoney().subtract(balance);
            updateMoneyFlag = updateMoney(afterMoney, dbAmountDO.getMoney(), memberId);
            if (!existSurplusPay) {
                orderStatusFlag = orderService.updateOrderPay(1, 0, orderId);
            }
        } else {
            afterMoney = new BigDecimal(0);
            if (!orderService.updateSurplusPrice(balance.subtract(dbAmountDO.getMoney()), orderId)) {
                throw new RuntimeException("修改订单余额失败");
            }
            updateMoneyFlag = updateMoney(afterMoney, dbAmountDO.getMoney(), memberId);
        }

        AmountHistoryDO amountHistoryDO = new AmountHistoryDO();
        amountHistoryDO.setBeforeMoney(dbAmountDO.getMoney());
        amountHistoryDO.setAfterMoney(afterMoney);
        amountHistoryDO.setType(AmountHistoryOper.BALANCE_CHANGE);
        amountHistoryDO.setGmtCreateTime(new Date());
        amountHistoryDO.setMemberId(memberId);

        amountHistoryService.saveOrUpdate(amountHistoryDO);

        if (amountHistoryDO.getId() == null || updateMoneyFlag == false || (isExistBalance && !existSurplusPay && orderStatusFlag == false)) {
            throw new RuntimeException("修改金额信息失败");
        } else {
            return true;
        }
    }

}