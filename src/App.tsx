import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import AuthModal from './components/AuthModal'
import MyPage from './components/MyPage'
import ResetPasswordModal from './components/ResetPasswordModal'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showMyPage, setShowMyPage] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') {
        setShowResetPassword(true)
      }
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  return (
    <div className="aot-wrapper">

      {/* Navigation */}
      <nav className="aot-nav">
        <span className="nav-logo">Lv120</span>
        <div className="nav-actions">
          {user ? (
            <>
              <button className="btn-nav-ghost" onClick={() => setShowMyPage(true)}>{user.email}</button>
              <button className="btn-nav-outline" onClick={() => setShowMyPage(true)}>마이페이지</button>
              <button className="btn-nav-outline" onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <button className="btn-nav-outline" onClick={() => setShowAuth(true)}>로그인</button>
              <button className="btn-nav-fill" onClick={() => setShowAuth(true)}>회원가입</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="subtitle-top">수학 전문 온라인 강의</p>
          <h1 className="title-jp">Lv120</h1>
          <h2 className="title-kr">수학</h2>
          <p className="tagline">레벨1 노베이스부터 레벨120 미적분 정복까지 한큐에 해결해드립니다.</p>
          {user ? (
            <p className="welcome-msg">환영합니다, {user.email?.split('@')[0]}님!</p>
          ) : (
            <button className="btn-watch" onClick={() => setShowAuth(true)}>강의 둘러보기</button>
          )}
        </div>
        <div className="scroll-hint">▼</div>
      </header>

      {/* About Section */}
      <section className="story-section">
        <div className="section-inner">
          <span className="section-label">ABOUT</span>
          <h3>수포자도, 최상위도,<br />모두를 위한 수학</h3>
          <p>
            수학이 두렵다고 느끼는 순간부터, 미적분을 완벽히 정복하는 그날까지.
            Lv120 수학은 개념의 빈틈 없이 레벨별로 설계된 커리큘럼으로
            여러분을 이끌어 드립니다. 중학교 기초부터 고2 수학까지,
            단 하나의 강의 플랫폼에서 완성하세요.
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section className="chars-section">
        <span className="section-label">COURSES</span>
        <div className="chars-grid">
          {[
            {
              initial: '中',
              name: '중학교 전범위 수학강의',
              role: '도형 제외 · Lv.1 ~ 60',
              color: '#8b0000',
            },
            {
              initial: '圖',
              name: '중학 도형 특강',
              role: '도형 집중 완성 · Lv.30 ~ 70',
              color: '#2c3e50',
            },
            {
              initial: '高',
              name: '고1 전범위 수학강의',
              role: '고등 수학 Ⅰ · Lv.60 ~ 90',
              color: '#c0392b',
            },
            {
              initial: 'Σ',
              name: '고2 수학 전범위 강의',
              role: '미적분 · 확통 · Lv.90 ~ 120',
              color: '#5b2d8e',
            },
          ].map((c) => (
            <div className="char-card" key={c.name} style={{ '--accent-color': c.color } as React.CSSProperties}>
              <div className="char-avatar">{c.initial}</div>
              <div className="char-name">{c.name}</div>
              <div className="char-role">{c.role}</div>
              <div className="course-price">₩ 400,000</div>
              <button
                className="course-btn"
                onClick={() => !user && setShowAuth(true)}
              >
                {user ? '수강 신청' : '로그인 후 신청'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { num: '4', label: '커리큘럼' },
            { num: '120', label: '최고 레벨' },
            { num: '40만', label: '균일 수강료' },
            { num: '1:1', label: 'Q&A 지원' },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Quote Section */}
      <section className="quote-section">
        <blockquote>
          "수학은 재능이 아니라 방법의 문제입니다.<br />
          올바른 길을 걸으면, 누구든 정상에 오릅니다."
        </blockquote>
        <cite>— Lv120 수학</cite>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 Lv120 수학 · All rights reserved</p>
        <p className="footer-sub">본 사이트의 모든 강의 콘텐츠는 저작권법의 보호를 받습니다.</p>
      </footer>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}

      {showMyPage && user && (
        <MyPage
          user={user}
          onClose={() => setShowMyPage(false)}
          onDeleted={() => setUser(null)}
        />
      )}

      {showResetPassword && (
        <ResetPasswordModal onClose={() => setShowResetPassword(false)} />
      )}
    </div>
  )
}

export default App
