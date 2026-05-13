import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { MOCK_COURSES, type Course } from '../lib/mockData'
import './pages.css'

export default function Store() {
  const { user, openAuth } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set())
  const [loadingPurchase, setLoadingPurchase] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [])

  useEffect(() => {
    if (user) loadPurchases()
    else setPurchasedIds(new Set())
  }, [user])

  const loadCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: true })

    // Supabase 테이블이 없거나 비어있으면 mock 데이터 사용
    if (error || !data || data.length === 0) {
      setCourses(MOCK_COURSES)
    } else {
      setCourses(data)
    }
  }

  const loadPurchases = async () => {
    const { data } = await supabase
      .from('purchases')
      .select('course_id')
      .eq('status', 'paid')
    if (data) setPurchasedIds(new Set(data.map((p) => p.course_id)))
  }

  const handlePurchase = async (course: Course) => {
    if (!user) { openAuth(); return }
    if (purchasedIds.has(course.id)) return

    setLoadingPurchase(course.id)
    // TODO: 실제 결제는 토스페이먼츠 → supabase.functions.invoke('confirm-payment') 로 처리
    // 아래는 개발/테스트용 mock 구매 처리 (RLS로 직접 INSERT가 막히면 Edge Function 연동 필요)
    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      course_id: course.id,
      amount_paid: course.price,
      status: 'paid',
    })

    if (!error) {
      setPurchasedIds((prev) => new Set([...prev, course.id]))
    } else {
      alert('구매 처리 중 오류가 발생했습니다.\n(결제 Edge Function 연동 필요)')
    }
    setLoadingPurchase(null)
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="page-header">
          <span className="page-eyebrow">COURSES</span>
          <h1 className="page-title">강의 구매 상점</h1>
          <p className="page-subtitle">원하는 커리큘럼을 선택하고 수강을 시작하세요.</p>
        </div>

        <div className="store-grid">
          {courses.map((course) => {
            const bought = purchasedIds.has(course.id)
            return (
              <div
                className="store-card"
                key={course.id}
                style={{ '--accent-color': (course as Course & { color?: string }).color } as React.CSSProperties}
              >
                <div
                  className="store-card-avatar"
                  style={{ background: (course as Course & { color?: string }).color || 'var(--accent)' }}
                >
                  {(course as Course & { initial?: string }).initial || course.title[0]}
                </div>
                <div className="store-card-title">{course.title}</div>
                <div className="store-card-level">
                  {(course as Course & { level?: string }).level || (course as Course & { category?: string }).category}
                </div>
                <div className="store-card-desc">{course.description}</div>
                <div className="store-card-footer">
                  <span className="store-price">
                    {course.price === 0 ? '무료' : `₩ ${course.price.toLocaleString()}`}
                  </span>
                  {bought ? (
                    <Link to={`/my-courses/${course.id}`} className="btn-go-course">
                      수강하기 →
                    </Link>
                  ) : (
                    <button
                      className="btn-purchase"
                      onClick={() => handlePurchase(course)}
                      disabled={loadingPurchase === course.id}
                    >
                      {loadingPurchase === course.id ? '처리 중...' : '구매하기'}
                    </button>
                  )}
                </div>
                {bought && <span className="purchase-badge">✓ 구매 완료</span>}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
