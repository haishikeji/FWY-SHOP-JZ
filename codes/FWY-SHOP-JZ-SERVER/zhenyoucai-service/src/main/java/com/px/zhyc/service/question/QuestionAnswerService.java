package com.px.zhyc.service.question;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.dao.question.QuestionAnswerDAO;
import com.px.zhyc.dao.question.dataobject.QuestionAnswerDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * 问题表表服务接口
 *
 * @author 品讯科技
 * @since 2020-10-19 22:28:25
 */
@Service
public class QuestionAnswerService extends AbstractJpaPageBaseService<QuestionAnswerDO> {

    @Autowired
    private QuestionAnswerDAO questionAnswerDAO;

    @Override
    protected MyRepository<QuestionAnswerDO, Long> getPageableRepository() {
        return this.questionAnswerDAO;
    }


}