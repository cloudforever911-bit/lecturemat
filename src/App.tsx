import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import AuthModal from './components/AuthModal'
import './App.css'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
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
        <span className="nav-logo">AOT</span>
        <div className="nav-actions">
          {user ? (
            <>
              <span className="nav-user">{user.email}</span>
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
          <p className="subtitle-top">2013 · 2023  진격의 거인</p>
          <h1 className="title-jp">進撃の巨人</h1>
          <h2 className="title-kr">ATTACK ON TITAN</h2>
          <p className="tagline">"그 날, 인류는 그들의 공포를 떠올렸다"</p>
          {user ? (
            <p className="welcome-msg">환영합니다, {user.email?.split('@')[0]}님!</p>
          ) : (
            <button className="btn-watch" onClick={() => setShowAuth(true)}>지금 시청하기</button>
          )}
        </div>
        <div className="scroll-hint">▼</div>
      </header>

      {/* Story Section */}
      <section className="story-section">
        <div className="section-inner">
          <span className="section-label">STORY</span>
          <h3>거인에게 빼앗긴 세계,<br />그리고 인류의 반격</h3>
          <p>
            100년 전, 인류는 거대한 벽을 쌓아 거인의 위협으로부터 스스로를 지켜왔다.
            그러나 어느 날 초대형 거인의 출현으로 벽이 무너지고, 에렌은 눈앞에서
            어머니를 잃는다. 복수와 자유를 위해 조사병단에 입단한 에렌과 동료들의
            처절한 싸움이 시작된다.
          </p>
        </div>
      </section>

      {/* Characters Section */}
      <section className="chars-section">
        <span className="section-label">CHARACTERS</span>
        <div className="chars-grid">
          {[
            { name: '에렌 예거', role: 'Eren Yeager', color: '#c0392b', initial: 'E' },
            { name: '미카사 아커만', role: 'Mikasa Ackerman', color: '#2c3e50', initial: 'M' },
            { name: '아르민 알레르트', role: 'Armin Arlert', color: '#d4ac0d', initial: 'A' },
            { name: '리바이 아커만', role: 'Levi Ackerman', color: '#1a252f', initial: 'L' },
          ].map((c) => (
            <div className="char-card" key={c.role} style={{ '--accent-color': c.color } as React.CSSProperties}>
              <div className="char-avatar">{c.initial}</div>
              <div className="char-name">{c.name}</div>
              <div className="char-role">{c.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { num: '87', label: '에피소드' },
            { num: '4', label: '시즌' },
            { num: '9.0', label: 'IMDb 평점' },
            { num: '140M+', label: '만화 판매부수' },
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
          "나는 태어날 때부터 이 세계에 있었다.<br />
          그렇다면, 이 세계도 나의 것이다."
        </blockquote>
        <cite>— 에렌 예거</cite>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2013–2023 Hajime Isayama / Kodansha · WIT Studio · MAPPA</p>
        <p className="footer-sub">본 페이지는 팬 제작 홍보물입니다.</p>
      </footer>

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      )}
    </div>
  )
}

export default App
