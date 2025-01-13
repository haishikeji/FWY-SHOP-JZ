package com.px.zhyc.dao.course;

import com.px.zhyc.common.dao.MyRepository;
import com.px.zhyc.dao.course.dataobject.CourseDO;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Map;

/**
 * 线上课程管理(Course)表数据库访问层
 *
 * @author 品讯科技
 * @since 2020-09-22 22:51:45
 */
public interface CourseDAO extends MyRepository<CourseDO, Long> {

    @Query(value = "select count(1) from ref_course_member where ref_course_pk = :refCoursePk and member_id = :memberId", nativeQuery = true)
    int existRef(Long refCoursePk, Long memberId);

    @Query(value = "insert into ref_course_member(ref_course_pk, member_id, version, gmt_create_time) values(:refCoursePk, :memberId, 0, now())", nativeQuery = true)
    @Modifying
    int saveMemberRef(Long refCoursePk, Long memberId);

    @Query(value = "select * from course " +
            "left join ref_course_series_course on ref_course_series_course.ref_course_pk = course.pk " +
            "where ref_course_series_course.ref_course_series_pk = :refCourseSeriesPk", nativeQuery = true)
    List<CourseDO> findConfigs(Long refCourseSeriesPk);

    @Query(value = "select count(1) from ref_course_series_course where ref_course_series_pk = :refCourseSeriesPk and ref_course_pk = :refCoursePk", nativeQuery = true)
    int existConfig(Long refCourseSeriesPk, Long refCoursePk);

    @Query(value = "insert into ref_course_series_course(ref_course_series_pk, ref_course_pk) values(:refCourseSeriesPk, :refCoursePk)", nativeQuery = true)
    @Modifying
    int saveSeriesConfigRef(Long refCourseSeriesPk, Long refCoursePk);

    @Query(value = "delete from ref_course_series_course where ref_course_series_pk = :refCourseSeriesPk and ref_course_pk = :refCoursePk", nativeQuery = true)
    @Modifying
    int deleteConfigRef(Long refCourseSeriesPk, Long refCoursePk);

    @Query(value = "select member_info.nickname, member_info.phone, member_info.gmt_modify_time as lastLoginTime, ref_course_member.gmt_create_time as joinTime from member_open " +
            "left join ref_course_member on ref_course_member.member_id = member_open.pk " +
            "left join member_info on member_info.pk = member_open.member_id " +
            "where ref_course_member.ref_course_pk = :coursePk " +
            "and if(:nickname != '', member_info.nickname like concat('%', :nickname, '%'), 1=1) " +
            "and if(:phone != '', member_info.phone like concat('%', :phone, '%'), 1=1) ", nativeQuery = true)
    List<Map<String, Object>> getEnrollMember(Long coursePk, String nickname, String phone);

}