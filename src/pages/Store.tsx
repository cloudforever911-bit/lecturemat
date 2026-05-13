import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { MOCK_COURSES, type Course } from '../lib/mockData'
import './pages.css'

// localStorage 폴백 키 (Supabase RLS가 직접 INSERT를 막을 때 사용)
const localKey = (userId: string) => `lv120_purchases_${userId}`

const getLocalPurchases = (userId: string): string[] => {
  try { return JSON.parse(localStorage.getItem(localKey(userId)) || '[]') }
  catch { return [] }
}

const addLocalPurchase = (userId: string, courseId: string) => {
  const prev = getLocalPurchases(userId)
  if (!prev.includes(courseId)) {
    localStorage.setItem(localKey(userId), JSON.stringify([...prev, courseId]))
  }
}

export default function Store() {
  const { user, openAuth } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set())
  const [loadingId, setLoadingId] = useState<string | null>(null)

  useEffect(() => { loadCourses() }, [])
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
    setCourses(!error && data && data.length > 0 ? data : MOCK_COURSES)
  }

  const loadPurchases = async () => {
    if (!user) return
    const { data } = await supabase
      .from('purchases')
      .select('course_id')
      .eq('status', 'paid')

    const supabaseIds = data?.map((p) => p.course_id) ?? []
    const localIds = getLocalPurchases(user.id)
    setPurchasedIds(new Set([...supabaseIds, ...localIds]))
  }

  const handlePurchase = async (course: Course) => {
    if (!user) { openAuth(); return }
    if (purchasedIds.has(course.id)) return

    setLoadingId(course.id)

    if (course.price === 0) {
      // ── 무료 강의: 즉시 구매 처리 ──
      const { error } = await supabase.from('purchases').insert({
        user_id: user.id,
        course_id: course.id,
        amount_paid: 0,
        status: 'paid',
      })
      // Supabase 성공 여부와 관계없이 localStorage에도 기록 (RLS 차단 대비)
      if (error) addLocalPurchase(user.id, course.id)
      setPurchasedIds((prev) => new Set([...prev, course.id]))
    } else {
      // ── 유료 강의: 토스페이먼츠 → Edge Function 연동 필요 ──
      // TODO: supabase.functions.invoke('confirm-payment', { body: { courseId, amount } })
      const { error } = await supabase.from('purchases').insert({
        user_id: user.id,
        course_id: course.id,
        amount_paid: course.price,
        status: 'paid',
      })
      if (!error) {
        setPurchasedIds((prev) => new Set([...prev, course.id]))
      } else {
        alert('결제 시스템 연동 준비 중입니다.\n(토스페이먼츠 Edge Function 연동 필요)')
      }
    }

    setLoadingId(null)
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
            const c = course as Course & { color?: string; initial?: string; level?: string }
            const bought = purchasedIds.has(course.id)
            const isFree = course.price === 0
            const isLoading = loadingId === course.id

            return (
              <div
                className={`store-card${isFree ? ' store-card--free' : ''}`}
                key={course.id}
                style={{ '--accent-color': c.color } as React.CSSProperties}
              >
                {isFree && <div className="free-badge">FREE</div>}

                <div
                  className="store-card-avatar"
                  style={{ background: c.color ?? 'var(--accent)' }}
                >
                  {c.initial ?? course.title[0]}
                </div>

                <div className="store-card-title">{course.title}</div>
                <div className="store-card-level">{c.level ?? course.category}</div>
                <div className="store-card-desc">{course.description}</div>

                <div className="store-card-footer">
                  <span className="store-price">
                    {isFree ? '무 료' : `₩ ${course.price.toLocaleString()}`}
                  </span>
                  {bought ? (
                    <Link to={`/my-courses/${course.id}`} className="btn-go-course">
                      수강하기 →
                    </Link>
                  ) : (
                    <button
                      className={`btn-purchase${isFree ? ' btn-purchase--free' : ''}`}
                      onClick={() => handlePurchase(course)}
                      disabled={isLoading}
                    >
                      {isLoading
                        ? '처리 중...'
                        : isFree
                        ? '무료로 시작하기'
                        : '구매하기'}
                    </button>
                  )}
                </div>

                {bought && (
                  <span className="purchase-badge">✓ {isFree ? '수강 중' : '구매 완료'}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
