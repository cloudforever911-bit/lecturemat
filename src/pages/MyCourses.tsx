import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { MOCK_COURSES, MOCK_LECTURES, type Course } from '../lib/mockData'
import './pages.css'

interface PurchasedCourse extends Course {
  completedCount: number
  totalCount: number
}

export default function MyCourses() {
  const { user } = useAuth()
  const [courses, setCourses] = useState<PurchasedCourse[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) loadMyCourses()
  }, [user])

  const loadMyCourses = async () => {
    setLoading(true)

    // 구매 내역 조회 (RLS가 자동으로 본인 것만 반환)
    const { data: purchases } = await supabase
      .from('purchases')
      .select('course_id')
      .eq('status', 'paid')

    if (!purchases || purchases.length === 0) {
      setCourses([])
      setLoading(false)
      return
    }

    const courseIds = purchases.map((p) => p.course_id)

    // 강의 정보 조회
    const { data: dbCourses } = await supabase
      .from('courses')
      .select('*')
      .in('id', courseIds)

    const courseList: Course[] = dbCourses && dbCourses.length > 0
      ? dbCourses
      : MOCK_COURSES.filter((c) => courseIds.includes(c.id))

    // 각 강의별 진도 계산
    const enriched: PurchasedCourse[] = await Promise.all(
      courseList.map(async (course) => {
        // 강의 영상 목록 조회 (RLS: 구매자만 접근 가능)
        const { data: lectures } = await supabase
          .from('lectures')
          .select('id')
          .eq('course_id', course.id)

        const mockLectures = MOCK_LECTURES[course.id] || []
        const lectureIds = lectures && lectures.length > 0
          ? lectures.map((l) => l.id)
          : mockLectures.map((l) => l.id)

        // 완료 수 조회
        const { data: progress } = await supabase
          .from('lecture_progress')
          .select('lecture_id')
          .in('lecture_id', lectureIds)
          .eq('is_completed', true)

        return {
          ...course,
          completedCount: progress?.length ?? 0,
          totalCount: lectureIds.length,
        }
      })
    )

    setCourses(enriched)
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="page-inner">
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="page-header">
          <span className="page-eyebrow">MY COURSES</span>
          <h1 className="page-title">내 강의 목록</h1>
          <p className="page-subtitle">구매한 강의를 선택해 수강을 이어가세요.</p>
        </div>

        {courses.length === 0 ? (
          <div className="empty-state">
            <p>아직 구매한 강의가 없습니다.</p>
            <Link to="/store" className="btn-outline-accent">강의 상점 바로가기 →</Link>
          </div>
        ) : (
          <div className="my-courses-list">
            {courses.map((course) => {
              const pct = course.totalCount > 0
                ? Math.round((course.completedCount / course.totalCount) * 100)
                : 0
              return (
                <Link
                  key={course.id}
                  to={`/my-courses/${course.id}`}
                  className="my-course-row"
                >
                  <div
                    className="my-course-avatar"
                    style={{ '--avatar-color': course.color } as React.CSSProperties}
                  >
                    {course.initial || course.title[0]}
                  </div>
                  <div className="my-course-info">
                    <div className="my-course-title">{course.title}</div>
                    <div className="my-course-meta">
                      {course.level || course.category} &nbsp;·&nbsp; 총 {course.totalCount}강
                    </div>
                  </div>
                  <div className="my-course-progress-bar">
                    <div className="progress-label">{pct}% 완료</div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="my-course-arrow">→</span>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
