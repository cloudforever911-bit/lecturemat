import { useEffect, useState } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { AuthContext } from '../lib/authContext'
import AuthModal from './AuthModal'
import MyPage from './MyPage'
import ResetPasswordModal from './ResetPasswordModal'

export default function Layout() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [showMyPage, setShowMyPage] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const isMain = location.pathname === '/'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ?? null))
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (event === 'PASSWORD_RECOVERY') setShowResetPassword(true)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  return (
    <AuthContext.Provider value={{ user, openAuth: () => setShowAuth(true), openMyPage: () => setShowMyPage(true) }}>
      <div className="aot-wrapper">

        <nav className={`aot-nav${isMain ? '' : ' nav-solid'}`}>
          <Link to="/" className="nav-logo-link" onClick={() => setMenuOpen(false)}>
            <span className="nav-logo">Lv120</span>
          </Link>

          {/* 데스크탑 링크 */}
          <div className="nav-links">
            <Link to="/courses" className="nav-link">강의 구매&amp;시청</Link>
            <Link to="/ebook" className="nav-link">교재 구매</Link>
            {user && <Link to="/dashboard" className="nav-link">대시보드</Link>}
          </div>

          <div className="nav-actions">
            {user ? (
              <>
                <button className="btn-nav-ghost" onClick={() => setShowMyPage(true)}>
                  {user.email}
                </button>
                <button className="btn-nav-outline" onClick={() => setShowMyPage(true)}>
                  마이페이지
                </button>
                <button className="btn-nav-outline" onClick={handleLogout}>로그아웃</button>
              </>
            ) : (
              <>
                <button className="btn-nav-outline" onClick={() => setShowAuth(true)}>로그인</button>
                <button className="btn-nav-fill" onClick={() => setShowAuth(true)}>회원가입</button>
              </>
            )}
            {/* 햄버거 버튼 (모바일) */}
            <button
              className="btn-hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="메뉴"
            >
              <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
              <span className={`hamburger-bar${menuOpen ? ' open' : ''}`} />
            </button>
          </div>
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
            <Link to="/courses" className="mobile-menu-link">강의 구매&amp;시청</Link>
            <Link to="/ebook" className="mobile-menu-link">교재 구매</Link>
            {user && <Link to="/dashboard" className="mobile-menu-link">대시보드</Link>}
            <div className="mobile-menu-divider" />
            {user ? (
              <>
                <button className="mobile-menu-link" onClick={() => { setShowMyPage(true); setMenuOpen(false) }}>마이페이지</button>
                <button className="mobile-menu-link" onClick={() => { handleLogout(); setMenuOpen(false) }}>로그아웃</button>
              </>
            ) : (
              <>
                <button className="mobile-menu-link" onClick={() => { setShowAuth(true); setMenuOpen(false) }}>로그인</button>
                <button className="mobile-menu-link" onClick={() => { setShowAuth(true); setMenuOpen(false) }}>회원가입</button>
              </>
            )}
          </div>
        )}

        <Outlet />

        {showAuth && (
          <AuthModal onClose={() => setShowAuth(false)} onSuccess={() => setShowAuth(false)} />
        )}
        {showMyPage && user && (
          <MyPage user={user} onClose={() => setShowMyPage(false)} onDeleted={() => { setUser(null); navigate('/') }} />
        )}
        {showResetPassword && (
          <ResetPasswordModal onClose={() => setShowResetPassword(false)} />
        )}
      </div>
    </AuthContext.Provider>
  )
}
