import { Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import './pages.css'

export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || '회원'

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="page-header">
          <span className="page-eyebrow">DASHBOARD</span>
          <p className="dashboard-greeting">안녕하세요, {name}님 👋</p>
          <p className="dashboard-sub">오늘도 수학과 한 걸음 가까워지세요.</p>
        </div>

        <div className="dashboard-cards">
          <Link to="/store" className="dash-card">
            <span className="dash-card-icon">∮</span>
            <span className="dash-card-title">강의 구매 상점</span>
            <span className="dash-card-desc">
              레벨별 강의 상품을 확인하고 원하는 커리큘럼을 구매하세요.
            </span>
            <span className="dash-card-arrow">→</span>
          </Link>

          <Link to="/my-courses" className="dash-card">
            <span className="dash-card-icon">∑</span>
            <span className="dash-card-title">내 강의 목록</span>
            <span className="dash-card-desc">
              구매한 강의를 확인하고 수강 진도를 이어가세요.
            </span>
            <span className="dash-card-arrow">→</span>
          </Link>

          <div className="dash-card" style={{ cursor: 'default', opacity: 0.6 }}>
            <span className="dash-card-icon">⊞</span>
            <span className="dash-card-title">학교 인증</span>
            <span className="dash-card-desc">
              재학 중인 학교를 인증하면 추가 혜택을 받을 수 있습니다.<br />
              <em style={{ fontSize: 11, letterSpacing: 1 }}>— 준비 중 —</em>
            </span>
            <span className="dash-card-arrow" style={{ color: '#3a5240' }}>→</span>
          </div>
        </div>
      </div>
    </div>
  )
}
