package com.px.zhyc.service.booktag;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.common.service.AbstractJpaPageBaseService;
import com.px.zhyc.dao.booktag.BookTagDAO;
import com.px.zhyc.dao.booktag.dataobject.BookTagDO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * (BookTag)表服务接口
 *
 * @author 品讯科技
 * @since 2020-09-06 18:32:58
 */
@Service
public class BookTagService extends AbstractJpaPageBaseService<BookTagDO> {

    @Autowired
    private BookTagDAO bookTagDAO;

    @Override
    protected MyRepository<BookTagDO, Long> getPageableRepository() {
        return this.bookTagDAO;
    }

}