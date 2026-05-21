import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { MOCK_COURSES, type Course } from '../lib/mockData'
import './pages.css'

interface PurchaseRecord {
  courseId: string
  expiresAt: Date
}

const V2_KEY = (uid: string) => `lv120_purchases_v2_${uid}`
const V1_KEY = (uid: string) => `lv120_purchases_${uid}`

const getLocalPurchases = (userId: string): PurchaseRecord[] => {
  try {
    const raw = localStorage.getItem(V2_KEY(userId))
    if (raw) {
      return (JSON.parse(raw) as { courseId: string; expiresAt: string }[])
        .map(p => ({ courseId: p.courseId, expiresAt: new Date(p.expiresAt) }))
    }
    // v1 마이그레이션 (구 버전 구매 기록 → 오늘부터 6개월)
    const v1Raw = localStorage.getItem(V1_KEY(userId))
    if (v1Raw) {
      const ids = JSON.parse(v1Raw) as string[]
      const exp = sixMonthsFromNow()
      const migrated = ids.map(courseId => ({ courseId, expiresAt: exp.toISOString() }))
      localStorage.setItem(V2_KEY(userId), JSON.stringify(migrated))
      return migrated.map(p => ({ courseId: p.courseId, expiresAt: new Date(p.expiresAt) }))
    }
    return []
  } catch { return [] }
}

const addLocalPurchase = (userId: string, courseId: string, expiresAt: Date) => {
  const prev = getLocalPurchases(userId)
  const filtered = prev.filter(p => p.courseId !== courseId)
  const updated = [...filtered, { courseId, expiresAt: expiresAt.toISOString() }]
  localStorage.setItem(V2_KEY(userId), JSON.stringify(updated))
}

const sixMonthsFromNow = (): Date => {
  const d = new Date()
  d.setMonth(d.getMonth() + 6)
  return d
}

const calcDDay = (expiresAt: Date): number =>
  Math.ceil((expiresAt.getTime() - Date.now()) / 86400000)

const formatDDay = (dDay: number): string => {
  if (dDay > 0) return `D-${dDay}`
  if (dDay === 0) return 'D-DAY'
  return '만료'
}

const formatExpireDate = (d: Date): string =>
  d.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })

// 마일리지 1 M = ₩10,000 · 강의 ₩300,000 = 30 M
const MILEAGE_COST = 30

export default function CoursesPage() {
  const { user, openAuth } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [loadingMileageId, setLoadingMileageId] = useState<string | null>(null)
  const [mileage, setMileage] = useState<number>(0)

  useEffect(() => { loadCourses() }, [])
  useEffect(() => {
    if (user) {
      loadPurchases()
      setMileage((user.user_metadata?.mileage as number) ?? 0)
    } else {
      setPurchases([])
      setMileage(0)
    }
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
      .select('course_id, created_at, expires_at')
      .eq('status', 'paid')

    const dbRecords: PurchaseRecord[] = (data ?? []).map(p => {
      const exp = p.expires_at
        ? new Date(p.expires_at)
        : (() => { const d = new Date(p.created_at); d.setMonth(d.getMonth() + 6); return d })()
      return { courseId: p.course_id, expiresAt: exp }
    })

    const localRecords = getLocalPurchases(user.id)

    // DB 우선, 로컬은 보완
    const merged = new Map<string, PurchaseRecord>()
    localRecords.forEach(p => merged.set(p.courseId, p))
    dbRecords.forEach(p => merged.set(p.courseId, p))

    setPurchases([...merged.values()])
  }

  const getPurchase = (courseId: string): PurchaseRecord | null =>
    purchases.find(p => p.courseId === courseId) ?? null

  const handleMileagePurchase = async (course: Course) => {
    if (!user) { openAuth(); return }

    if (mileage < MILEAGE_COST) {
      alert(`마일리지가 부족합니다.\n보유: ${mileage} M  /  필요: ${MILEAGE_COST} M\n\n마일리지 충전은 관리자에게 문의해주세요.`)
      return
    }

    setLoadingMileageId(course.id)

    // 마일리지 차감 (낙관적 업데이트)
    const newMileage = mileage - MILEAGE_COST
    setMileage(newMileage)
    await supabase.auth.updateUser({ data: { mileage: newMileage } })

    // 동일한 구매 권한 부여 (6개월)
    const expiresAt = sixMonthsFromNow()
    const { error } = await supabase.from('purchases').insert({
      user_id: user.id,
      course_id: course.id,
      amount_paid: 0,
      status: 'paid',
      expires_at: expiresAt.toISOString(),
    })
    if (error) addLocalPurchase(user.id, course.id, expiresAt)

    setPurchases(prev => [...prev.filter(p => p.courseId !== course.id), { courseId: course.id, expiresAt }])
    setLoadingMileageId(null)
  }

  const handlePurchase = async (course: Course) => {
    if (!user) { openAuth(); return }

    const existing = getPurchase(course.id)
    if (existing && calcDDay(existing.expiresAt) > 0) return

    setLoadingId(course.id)
    const expiresAt = sixMonthsFromNow()

    if (course.price === 0) {
      const { error } = await supabase.from('purchases').insert({
        user_id: user.id,
        course_id: course.id,
        amount_paid: 0,
        status: 'paid',
        expires_at: expiresAt.toISOString(),
      })
      if (error) addLocalPurchase(user.id, course.id, expiresAt)
      setPurchases(prev => [...prev.filter(p => p.courseId !== course.id), { courseId: course.id, expiresAt }])
    } else {
      const { error } = await supabase.from('purchases').insert({
        user_id: user.id,
        course_id: course.id,
        amount_paid: course.price,
        status: 'paid',
        expires_at: expiresAt.toISOString(),
      })
      if (!error) {
        setPurchases(prev => [...prev.filter(p => p.courseId !== course.id), { courseId: course.id, expiresAt }])
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
          <h1 className="page-title">강의 구매&amp;시청</h1>
          <p className="page-subtitle">
            원하는 커리큘럼을 선택하고 수강을 시작하세요.&nbsp;
            <span className="subtitle-highlight">구매 후 6개월간 무제한 수강</span> 가능합니다.
          </p>
          {user && (
            <div className="mileage-bar">
              <span className="mileage-bar-icon">◈</span>
              <span className="mileage-bar-label">보유 마일리지</span>
              <span className="mileage-bar-value">{mileage.toLocaleString()} M</span>
            </div>
          )}
        </div>

        <div className="store-grid">
          {courses.map((course) => {
            const c = course as Course & { color?: string; initial?: string; level?: string }
            const isFree = course.price === 0
            const isLoading = loadingId === course.id
            const isLoadingMileage = loadingMileageId === course.id
            const purchase = getPurchase(course.id)
            const dDay = purchase ? calcDDay(purchase.expiresAt) : null
            const isActive = dDay !== null && dDay > 0
            const isExpired = dDay !== null && dDay <= 0
            const isUrgent = isActive && dDay! <= 30

            return (
              <div
                className={`store-card${isFree ? ' store-card--free' : ''}${isActive ? ' store-card--owned' : ''}${isExpired ? ' store-card--expired' : ''}`}
                key={course.id}
                style={{ '--accent-color': c.color } as React.CSSProperties}
              >
                {/* 상태 배지 */}
                {isActive && (
                  <div className={`dday-badge${isUrgent ? ' dday-badge--urgent' : ''}`}>
                    {formatDDay(dDay!)}
                  </div>
                )}
                {isExpired && <div className="expired-badge">만료됨</div>}
                {isFree && !isActive && !isExpired && <div className="free-badge">FREE</div>}

                <div
                  className="store-card-avatar"
                  style={{ background: c.color ?? 'var(--accent)' }}
                >
                  {c.initial ?? course.title[0]}
                </div>

                <div className="store-card-title">{course.title}</div>
                <div className="store-card-level">{c.level ?? course.category}</div>
                <div className="store-card-desc">{course.description}</div>

                {isActive && (
                  <div className="course-expire-info">
                    <span className="expire-label">수강 만료일</span>
                    <span className="expire-date">{formatExpireDate(purchase!.expiresAt)}</span>
                  </div>
                )}
                {isExpired && (
                  <div className="course-expire-info course-expire-info--expired">
                    <span className="expire-label">만료일</span>
                    <span className="expire-date">{formatExpireDate(purchase!.expiresAt)}</span>
                  </div>
                )}

                <div className="store-card-footer">
                  <div className="store-price-wrap">
                    {!isFree && !isActive && (
                      <span className="price-original">₩ 500,000</span>
                    )}
                    <span className={`store-price${isActive ? ' store-price--active' : ''}`}>
                      {isActive
                        ? '수강 중'
                        : isFree
                        ? '무 료'
                        : `₩ ${course.price.toLocaleString()}`}
                    </span>
                  </div>

                  {isActive ? (
                    <Link to={`/courses/${course.id}`} className="btn-watch">
                      시청하기 →
                    </Link>
                  ) : (
                    <div className="btn-purchase-group">
                      <button
                        className={`btn-purchase${isFree ? ' btn-purchase--free' : ''}${isExpired ? ' btn-purchase--renew' : ''}`}
                        onClick={() => {
                          if (isFree) { handlePurchase(course); return }
                          if (!user) { openAuth(); return }
                          window.open('https://naver.me/GuCDrqoW', '_blank')
                        }}
                        disabled={isFree ? (isLoading || isLoadingMileage) : isLoadingMileage}
                      >
                        {isFree && isLoading
                          ? '처리 중...'
                          : isExpired
                          ? '재구매하기'
                          : isFree
                          ? '무료로 시작하기'
                          : '구매하기'}
                      </button>
                      {!isFree && user && (
                        <button
                          className={`btn-mileage-purchase${mileage < MILEAGE_COST ? ' btn-mileage-purchase--low' : ''}`}
                          onClick={() => handleMileagePurchase(course)}
                          disabled={isLoading || isLoadingMileage}
                          title={`마일리지 사용 (보유: ${mileage} M / 필요: ${MILEAGE_COST} M)`}
                        >
                          {isLoadingMileage ? '처리 중...' : `◈ 마일리지 구매`}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {!isFree && !isActive && (
                  <p className="price-note">(실제로 이 사이트의 주인장은 인당 중3기준 한달에 65만원씩 받고 과외하는 양반임)</p>
                )}
                {isActive && (
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
