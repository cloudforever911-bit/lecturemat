import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../lib/authContext'
import './pages.css'

const CONTACT_EMAIL = 'cloudforever911@gmail.com'

export default function Dashboard() {
  const { user } = useAuth()
  const name = user?.user_metadata?.name || user?.email?.split('@')[0] || '회원'
  const mileage = (user?.user_metadata?.mileage as number) ?? 0
  const [showContact, setShowContact] = useState(false)

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="page-header">
          <span className="page-eyebrow">DASHBOARD</span>
          <p className="dashboard-greeting">안녕하세요, {name}님 👋</p>
          <p className="dashboard-sub">오늘도 수학과 한 걸음 가까워지세요.</p>
        </div>

        <div className="dashboard-cards">
          <Link to="/courses" className="dash-card">
            <span className="dash-card-icon">∮</span>
            <span className="dash-card-title">강의 구매&amp;시청</span>
            <span className="dash-card-desc">
              강의를 구매하거나, 구매한 강의를 바로 시청하세요. 구매 후 6개월 수강 가능.
            </span>
            <span className="dash-card-arrow">→</span>
          </Link>

          <div className="dash-card dash-card--mileage" style={{ cursor: 'default' }}>
            <span className="dash-card-icon">◈</span>
            <span className="dash-card-title">나의 마일리지</span>
            <div className="mileage-display">
              <span className="mileage-value">{mileage.toLocaleString()}</span>
              <span className="mileage-unit">M</span>
            </div>
            <span className="dash-card-desc">
              마일리지로 강의를 바로 수강할 수 있습니다.<br />
              충전 문의는 이메일로 연락해주세요.
            </span>
          </div>

          <button className="dash-card dash-card--contact" onClick={() => setShowContact(true)}>
            <span className="dash-card-icon">✉</span>
            <span className="dash-card-title">문의하기</span>
            <span className="dash-card-desc">
              강의 관련 문의사항이 있으시면 이메일로 연락해주세요.
            </span>
            <span className="dash-card-arrow">→</span>
          </button>
        </div>
      </div>

      {/* 문의하기 모달 */}
      {showContact && (
        <div className="contact-backdrop" onClick={() => setShowContact(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <button className="contact-close" onClick={() => setShowContact(false)}>✕</button>

            <div className="contact-header">
              <span className="contact-icon">✉</span>
              <h2 className="contact-title">문의하기</h2>
            </div>

            <p className="contact-intro">
              문의는 이쪽 이메일로 연락 부탁드립니다!!
            </p>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="contact-email-link"
            >
              {CONTACT_EMAIL}
            </a>

            <div className="contact-template">
              <p className="contact-template-label">[ 문의 양식 ]</p>
              <div className="contact-template-body">
                <p>📌 문제 발생 사항 기재 :</p>
                <div className="contact-template-line" />
                <p>🎯 원하는 해결 목적 기재 :</p>
                <div className="contact-template-line" />
              </div>
              <p className="contact-template-footer">
                첨부 자료와 함께 보내주시면 도와드리겠습니다 😊
              </p>
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=[Lv90 문의]&body=문제 발생 사항 기재 :%0D%0A%0D%0A원하는 해결 목적 기재 :%0D%0A%0D%0A`}
              className="btn-contact-send"
            >
              이메일 앱으로 바로 작성하기 →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
