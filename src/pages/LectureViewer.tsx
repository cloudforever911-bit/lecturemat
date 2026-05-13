import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import { MOCK_COURSES, MOCK_LECTURES, type Lecture } from '../lib/mockData'
import './pages.css'

interface Progress {
  lecture_id: string
  is_completed: boolean
  review_1: boolean
  review_2: boolean
  review_3: boolean
}

export default function LectureViewer() {
  const { courseId } = useParams<{ courseId: string }>()
  const { user } = useAuth()

  const [lectures, setLectures] = useState<Lecture[]>([])
  const [progress, setProgress] = useState<Map<string, Progress>>(new Map())
  const [isPurchased, setIsPurchased] = useState<boolean | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  const course = MOCK_COURSES.find((c) => c.id === courseId) || {
    id: courseId ?? '',
    title: '강의',
    color: 'var(--accent)',
    initial: '∑',
    level: '',
    description: '',
    price: 0,
    category: '',
  }

  useEffect(() => {
    if (user && courseId) {
      checkPurchase()
    }
  }, [user, courseId])

  const checkPurchase = async () => {
    // 구매 여부 확인
    const { data: purchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('course_id', courseId)
      .eq('status', 'paid')
      .maybeSingle()

    const purchased = !!purchase
    setIsPurchased(purchased)

    if (purchased) {
      await loadLectures()
      await loadProgress()
    }
  }

  const loadLectures = async () => {
    // RLS: 구매자만 lectures 테이블 조회 가능 — youtube_url이 여기서만 공개됨
    const { data, error } = await supabase
      .from('lectures')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true })

    if (!error && data && data.length > 0) {
      setLectures(data)
    } else {
      // Supabase 테이블 미설정 시 mock 데이터 fallback
      setLectures(MOCK_LECTURES[courseId ?? ''] || [])
    }
  }

  const loadProgress = async () => {
    const lectureIds = (MOCK_LECTURES[courseId ?? ''] || []).map((l) => l.id)

    const { data } = await supabase
      .from('lecture_progress')
      .select('lecture_id, is_completed, review_1, review_2, review_3')
      .in('lecture_id', lectureIds.length > 0 ? lectureIds : ['none'])

    const map = new Map<string, Progress>()
    data?.forEach((p) => map.set(p.lecture_id, p))
    setProgress(map)
  }

  const handleCheck = async (
    lectureId: string,
    field: 'is_completed' | 'review_1' | 'review_2' | 'review_3',
    value: boolean,
  ) => {
    if (!user) return

    const prev = progress.get(lectureId) ?? {
      lecture_id: lectureId,
      is_completed: false,
      review_1: false,
      review_2: false,
      review_3: false,
    }

    // 순서 검증: review_2는 review_1이 true일 때만, review_3는 review_2가 true일 때만
    if (field === 'review_2' && value && !prev.review_1) return
    if (field === 'review_3' && value && !prev.review_2) return

    const updated = { ...prev, [field]: value }

    // 낙관적 업데이트
    setProgress((old) => new Map(old).set(lectureId, updated))
    setSaving(lectureId)

    await supabase.from('lecture_progress').upsert(
      {
        user_id: user.id,
        lecture_id: lectureId,
        is_completed: updated.is_completed,
        review_1: updated.review_1,
        review_2: updated.review_2,
        review_3: updated.review_3,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,lecture_id' },
    )

    setSaving(null)
  }

  // 진도 요약
  const completedCount = [...progress.values()].filter((p) => p.is_completed).length
  const totalCount = lectures.length
  const pct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  if (isPurchased === null) {
    return (
      <div className="page-wrapper">
        <div className="page-inner">
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>확인 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <Link to="/my-courses" className="viewer-back">← 내 강의 목록</Link>

        <div className="page-header">
          <span className="page-eyebrow">{course.level || course.category || 'LECTURE'}</span>
          <h1 className="page-title">{course.title}</h1>
        </div>

        {!isPurchased ? (
          <div className="viewer-locked">
            <div className="viewer-locked-icon">🔒</div>
            <h3>강의를 먼저 구매해주세요</h3>
            <p>이 강의는 구매한 회원만 수강할 수 있습니다.<br />강의 링크는 구매 후 공개됩니다.</p>
            <Link to="/store" className="btn-outline-accent">강의 상점 바로가기 →</Link>
          </div>
        ) : (
          <>
            {/* 진도 요약 */}
            <div className="viewer-progress-summary">
              <div>
                <div className="vps-label">수강 완료</div>
                <div className="vps-value">{completedCount} / {totalCount}</div>
              </div>
              <div>
                <div className="vps-label">전체 진도</div>
                <div className="vps-value">{pct}%</div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="progress-track" style={{ height: 6 }}>
                  <div className="progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>

            {/* 강의 목록 */}
            <div className="lecture-list">
              {lectures.map((lec) => {
                const prog = progress.get(lec.id) ?? {
                  lecture_id: lec.id,
                  is_completed: false,
                  review_1: false,
                  review_2: false,
                  review_3: false,
                }
                const isSaving = saving === lec.id

                return (
                  <div className="lecture-card" key={lec.id}>
                    <div className="lecture-card-top">
                      <span className="lecture-card-title">{lec.title}</span>
                      {/* youtube_url은 구매자에게만 DOM에 노출됨 (RLS 보장) */}
                      {lec.youtube_url ? (
                        <a
                          href={lec.youtube_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-youtube"
                        >
                          ▶ 강의 보기
                        </a>
                      ) : (
                        <span className="btn-youtube-locked">
                          ▶ 링크 준비 중
                        </span>
                      )}
                    </div>

                    <div className="checkboxes-row">
                      {([
                        { field: 'is_completed' as const, label: '수강완료', enabled: true },
                        { field: 'review_1' as const, label: '복습 1회', enabled: true },
                        { field: 'review_2' as const, label: '복습 2회', enabled: prog.review_1 },
                        { field: 'review_3' as const, label: '복습 3회', enabled: prog.review_2 },
                      ] as const).map(({ field, label, enabled }) => (
                        <label
                          key={field}
                          className={`checkbox-item${prog[field] ? ' checked' : ''}`}
                        >
                          <input
                            type="checkbox"
                            checked={prog[field]}
                            disabled={!enabled || isSaving}
                            onChange={(e) => handleCheck(lec.id, field, e.target.checked)}
                          />
                          <span className="checkbox-label">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
