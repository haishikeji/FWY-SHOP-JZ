package com.px.zhyc.service.sysuser;

import com.px.zhyc.common.enums.DataEnableEnum;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.dao.sysuser.SysUserDAO;
import com.px.zhyc.dao.sysuser.dataobject.SysUserDO;
import com.px.zhyc.service.memberopen.MemberOpenService;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;

/**
 * (SysUser)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-04 18:04:01
 */
@Service
public class SysUserService extends AbstractJpaPageBaseService<SysUserDO> {

    @Autowired
    private SysUserDAO sysUserDAO;

    @Resource
    MemberOpenService memberOpenService;

    @Override
    protected MyRepository<SysUserDO, Long> getPageableRepository() {
        return this.sysUserDAO;
    }
    public SysUserDO findByPhone(String phone) {
        if (StringUtils.isBlank(phone)) {
            return null;
        }
        return sysUserDAO.findByPhoneAndStatusAndDeleted(phone, DataEnableEnum.ENABLE, 0);
    }

}