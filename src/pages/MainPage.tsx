import { useState } from 'react'
import { useAuth } from '../lib/authContext'
import '../App.css'
import './pages.css'

const CONTACT_EMAIL = 'cloudforever911@gmail.com'

export default function MainPage() {
  const { user, openAuth } = useAuth()
  const [campModal, setCampModal] = useState<'summer' | 'winter' | null>(null)

  return (
    <>
      {/* ── SECTION 1: HERO ── */}
      <header className="hero-section">
        <div className="hero-chalk-overlay" />
        <div className="hero-math-bg">∑ ∫ π √ ∞ ∂ Δ</div>
        <div className="hero-content">
          <p className="hero-eyebrow">국내 유일 레벨 기반 수학 커리큘럼</p>
          <h1 className="hero-brand">Lv90</h1>
          <p className="hero-sub-brand">수 &nbsp; 학</p>
          <p className="hero-hook">
            "수포자도, 최상위도<br />
            단 하나의 플랫폼으로 정복한다"
          </p>
          <p className="hero-tagline">레벨 1 노베이스부터 레벨 90 미적분까지 — 빈틈 없이</p>
          {user ? (
            <p className="welcome-msg">환영합니다, {user.email?.split('@')[0]}님!</p>
          ) : (
            <button className="btn-watch" onClick={openAuth}>지금 시작하기 →</button>
          )}
        </div>
        <div className="scroll-hint">▼</div>
      </header>

      {/* ── SECTION 2: COURSES ── */}
      <section className="courses-section">
        <div className="section-header">
          <span className="section-label">COURSES</span>
          <h2 className="section-title">커리큘럼</h2>
          <p className="section-desc">내 레벨에서 시작해 끝까지. 어디서든 시작할 수 있습니다.</p>
          <div className="section-cta">
            <a
              className="btn-outline-accent"
              href="https://linktr.ee/newbasemath"
              target="_blank"
              rel="noopener noreferrer"
            >
              커리 소개
            </a>
            <a
              className="btn-outline-accent"
              href="https://linktr.ee/newbasemath"
              target="_blank"
              rel="noopener noreferrer"
            >
              선생님 소개
            </a>
          </div>
        </div>
        <div className="chars-grid">
          {[
            { initial: '中', name: '중학교 전범위 수학강의', role: '도형 제외 · Lv.1 ~ 60', color: '#8b0000' },
            { initial: '圖', name: '중학 도형 특강', role: '도형 집중 완성 · Lv.30 ~ 70', color: '#2c5282' },
            { initial: '高', name: '고1 전범위 수학강의', role: '고등 수학 Ⅰ · Lv.60 ~ 90', color: '#c0392b' },
            { initial: 'Σ', name: '고2 수학 전범위 강의', role: '미적분 · 확통 · Lv.70 ~ 90', color: '#5b2d8e' },
          ].map((c) => (
            <div className="char-card" key={c.name} style={{ '--accent-color': c.color } as React.CSSProperties}>
              <div className="char-avatar">{c.initial}</div>
              <div className="char-name">{c.name}</div>
              <div className="char-role">{c.role}</div>
              <div className="course-price">
                <span className="price-original">₩ 500,000</span>
                ₩ 300,000
              </div>
              <p className="price-note">(실제로 이 사이트의 주인장은 인당 중3기준 한달에 65만원씩 받고 과외하는 양반임)</p>
              <button className="course-btn" onClick={() => {
                if (!user) { openAuth(); return }
                window.open('https://naver.me/GuCDrqoW', '_blank')
              }}>
                {user ? '수강 신청' : '로그인 후 신청'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3: PHILOSOPHY ── */}
      <section className="philosophy-section">
        <div className="section-header">
          <span className="section-label">PHILOSOPHY</span>
          <h2 className="section-title">나의 교육 철학</h2>
        </div>
        <div className="philosophy-quote-wrap">
          <blockquote>
            "수학은 재능이 아니라 방법의 문제입니다.<br />
            올바른 길을 걸으면, 누구든 정상에 오릅니다."
          </blockquote>
          <cite>— Lv90 수학</cite>
        </div>
        <div className="pillars-grid">
          {[
            { icon: '∴', title: '원리 중심', desc: '공식 암기가 아닌, 왜 그렇게 되는지 근본부터 이해시킵니다.' },
            { icon: '∞', title: '레벨 기반', desc: '빈틈을 허용하지 않는 단계별 커리큘럼으로 설계했습니다.' },
            { icon: '⊕', title: '완전 정복', desc: '노베이스부터 미적분까지, 포기 없이 끝냅니다.' },
          ].map((p) => (
            <div className="pillar-card" key={p.title}>
              <span className="pillar-icon">{p.icon}</span>
              <h4 className="pillar-title">{p.title}</h4>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="stats-row">
          {[
            { num: '4', label: '커리큘럼' },
            { num: '90', label: '최고 레벨' },
            { num: '30만', label: '균일 수강료' },
            { num: '1:1', label: 'Q&A 지원' },
          ].map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
        {/* chalk flowers */}
        <div className="chalk-deco" style={{ bottom: 48, right: 64 }}>
          <svg width="88" height="118" viewBox="0 0 88 118"
            stroke="rgba(255,255,255,0.75)" fill="none"
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" opacity={0.42}>
            <path d="M44 36 C40 24 40 11 44 9 C48 11 48 24 44 36Z" />
            <path d="M44 36 C40 24 40 11 44 9 C48 11 48 24 44 36Z" transform="rotate(60,44,44)" />
            <path d="M44 36 C40 24 40 11 44 9 C48 11 48 24 44 36Z" transform="rotate(120,44,44)" />
            <path d="M44 36 C40 24 40 11 44 9 C48 11 48 24 44 36Z" transform="rotate(180,44,44)" />
            <path d="M44 36 C40 24 40 11 44 9 C48 11 48 24 44 36Z" transform="rotate(240,44,44)" />
            <path d="M44 36 C40 24 40 11 44 9 C48 11 48 24 44 36Z" transform="rotate(300,44,44)" />
            <circle cx="44" cy="44" r="7" />
            <circle cx="42" cy="42" r="1.5" fill="rgba(255,255,255,0.5)" stroke="none" />
            <circle cx="46" cy="43" r="1"   fill="rgba(255,255,255,0.5)" stroke="none" />
            <circle cx="43" cy="46" r="1.2" fill="rgba(255,255,255,0.5)" stroke="none" />
            <path d="M44 51 Q42 66 40 84" />
            <path d="M42 70 Q31 62 28 69 Q37 76 42 70Z" />
          </svg>
        </div>
        <div className="chalk-deco" style={{ bottom: 30, right: 160 }}>
          <svg width="62" height="88" viewBox="0 0 62 88"
            stroke="rgba(255,255,255,0.75)" fill="none"
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.4" opacity={0.32}>
            <path d="M31 25 C28 17 28 8 31 6 C34 8 34 17 31 25Z" />
            <path d="M31 25 C28 17 28 8 31 6 C34 8 34 17 31 25Z" transform="rotate(72,31,31)" />
            <path d="M31 25 C28 17 28 8 31 6 C34 8 34 17 31 25Z" transform="rotate(144,31,31)" />
            <path d="M31 25 C28 17 28 8 31 6 C34 8 34 17 31 25Z" transform="rotate(216,31,31)" />
            <path d="M31 25 C28 17 28 8 31 6 C34 8 34 17 31 25Z" transform="rotate(288,31,31)" />
            <circle cx="31" cy="31" r="5" />
            <path d="M31 36 Q29 49 28 62" />
            <path d="M29 51 Q21 46 19 51 Q25 57 29 51Z" />
          </svg>
        </div>
      </section>

      {/* ── SECTION 4: CONTRAST / GUARANTEE ── */}
      <section className="contrast-section">
        <div className="section-header">
          <span className="section-label">BEFORE / AFTER</span>
          <h2 className="section-title">당신은 지금 어디에 있습니까?</h2>
          <p className="section-desc">Lv90을 만나기 전과 후 — 단 하나의 선택이 모든 것을 바꿉니다.</p>
        </div>
        <div className="contrast-split">
          <div className="contrast-side contrast-before">
            <div className="contrast-img-wrap before-frame">
              <img src="/beforeimage.png" alt="강의 전" className="contrast-img" />
            </div>
            <div className="contrast-label-box">
              <span className="contrast-tag tag-before">BEFORE</span>
              <h3>강의를 알기 전</h3>
              <p className="contrast-subtitle">사교육의 노예인 나</p>
              <ul className="contrast-list">
                <li>학원비에 짓눌린 생활</li>
                <li>외워도 외워도 까먹는 공식</li>
                <li>"나는 수학 머리가 없나봐..."</li>
              </ul>
            </div>
          </div>
          <div className="contrast-vs">VS</div>
          <div className="contrast-side contrast-after">
            <div className="contrast-img-wrap after-frame">
              <img src="/afterimage.png" alt="강의 후" className="contrast-img" />
            </div>
            <div className="contrast-label-box">
              <span className="contrast-tag tag-after">AFTER</span>
              <h3>강의를 듣고나서</h3>
              <p className="contrast-subtitle">수학을 깨달아버린 나</p>
              <ul className="contrast-list">
                <li>원리가 보이니 문제가 풀린다</li>
                <li>공식을 외우지 않아도 유도 가능</li>
                <li>"이게 이렇게 쉬웠어?"</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="guarantee-box">
          <h3 className="guarantee-title">확실하게 보장합니다</h3>
          <p className="guarantee-text">
            저는 여러분이 수학의 원리를 이해하는 순간까지 함께합니다.<br />
            단순 암기가 아닌, 수학이 왜 그렇게 작동하는지 뿌리부터 심어드립니다.<br />
            레벨 1에서 레벨 90까지, 단 하나의 빈틈도 없이.
          </p>
          <button className="btn-guarantee" onClick={() => !user && openAuth()}>
            지금 바로 시작하기 →
          </button>
        </div>
      </section>

      {/* ── SECTION 5: PREVIEW ── */}
      <section className="preview-section">
        <div className="section-header">
          <span className="section-label">PREVIEW</span>
          <h2 className="section-title">OT 맛보기</h2>
          <p className="section-desc">수강생 후기와 무료 예시 강의로 먼저 확인하세요.</p>
        </div>
        <div className="reviews-grid">
          {[
            { name: '김○○', grade: '고2', text: '중3 때부터 수포자였는데 레벨 1부터 차근차근 하니까 진짜 이해가 됐어요. 지금은 수학이 제일 자신있는 과목입니다.' },
            { name: '이○○', grade: '고1', text: '학원 다닐 때는 공식만 외웠는데 여기서는 왜 그게 되는지를 알려줘서 시험장에서도 까먹지 않아요.' },
            { name: '박○○', grade: '중3', text: '30만원이 처음엔 비싸보였는데 학원 한달치도 안 되는 가격에 전범위를 다 배울 수 있다니 진짜 가성비 최고입니다.' },
          ].map((r) => (
            <div className="review-card" key={r.name}>
              <p className="review-stars">★★★★★</p>
              <p className="review-text">"{r.text}"</p>
              <div className="review-author">
                <span className="review-name">{r.name}</span>
                <span className="review-grade">{r.grade}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="video-area">
          <div className="video-embed-wrap">
            <iframe
              src="https://www.youtube.com/embed/KEJwzmW2w0c"
              title="OT 맛보기"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        {/* chalk fish */}
        <div className="chalk-deco" style={{ bottom: 36, right: 48 }}>
          <svg width="168" height="112" viewBox="0 0 168 112"
            stroke="rgba(255,255,255,0.75)" fill="none"
            strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" opacity={0.4}>
            <path d="M38 56 C37 40 52 28 72 27 C96 26 114 38 114 56 C114 74 96 86 72 85 C52 84 37 72 38 56Z" />
            <path d="M114 52 C124 41 142 34 146 44 C141 50 132 52 114 52Z" />
            <path d="M114 60 C132 60 141 62 146 68 C142 78 124 71 114 60Z" />
            <path d="M114 52 C116 55 116 57 114 60" />
            <path d="M65 27 C68 15 81 11 88 19 C84 24 75 26 65 27Z" />
            <path d="M60 62 C54 70 56 78 63 76 C64 69 63 64 60 62Z" />
            <circle cx="47" cy="50" r="6" />
            <circle cx="45" cy="48" r="2.5" fill="rgba(255,255,255,0.55)" stroke="none" />
            <path d="M28 58 Q32 62 36 59" />
            <path d="M62 37 Q72 30 82 37" />
            <path d="M66 51 Q76 44 86 51" />
            <circle cx="22" cy="49" r="3" />
            <circle cx="15" cy="38" r="2.2" />
            <circle cx="10" cy="28" r="1.5" />
          </svg>
        </div>
      </section>

      {/* ── SECTION 6: OFFLINE CAMP ── */}
      <section className="camp-section">
        <div className="section-header">
          <span className="section-label">OFFLINE CAMP</span>
          <h2 className="section-title">오프라인 신청</h2>
          <p className="section-desc">수학만점 인간개조 캠프 — 하숙집 24시간 완전 몰입 훈련소</p>
        </div>

        <div className="camp-intro">
          <p className="camp-intro-text">
            군 입대를 해서 <strong>정신개조를 당한다</strong>고 생각하시면 됩니다.<br />
            저의 하숙집에서 24시간 오직 수학만을 위해 케어하고 훈련시켜드립니다.
          </p>
          <p className="camp-intro-sub">
            * 공부 외 시간에는 운동 (뜀걸음 / 근력), 살 빠지는 식단, 집중력 강화 생체리듬, 자습만을 위해 케어 해드림 *
          </p>
        </div>

        <div className="camp-cards">
          {/* 여름방학 */}
          <div className="camp-card camp-card--summer">
            <div className="camp-card-season">☀ 여름방학 시즌</div>
            <div className="camp-price-wrap">
              <span className="camp-price">₩ 1,800,000</span>
              <span className="camp-price-unit">/ 1인</span>
            </div>
            <ul className="camp-features">
              <li>24시간 전담 밀착 케어</li>
              <li>개인 맞춤 수학 훈련 커리큘럼</li>
              <li>운동 + 식단 + 생체리듬 관리</li>
              <li>자습 집중 환경 제공</li>
            </ul>
            <button className="btn-camp-apply" onClick={() => setCampModal('summer')}>
              신청 문의하기 →
            </button>
          </div>

          {/* 겨울방학 */}
          <div className="camp-card camp-card--winter">
            <div className="camp-card-season">❄ 겨울방학 시즌</div>
            <div className="camp-price-wrap">
              <span className="camp-price">₩ 1,600,000</span>
              <span className="camp-price-unit">/ 1인</span>
            </div>
            <ul className="camp-features">
              <li>24시간 전담 밀착 케어</li>
              <li>개인 맞춤 수학 훈련 커리큘럼</li>
              <li>운동 + 식단 + 생체리듬 관리</li>
              <li>자습 집중 환경 제공</li>
            </ul>
            <button className="btn-camp-apply" onClick={() => setCampModal('winter')}>
              신청 문의하기 →
            </button>
          </div>
        </div>

        {/* 준비물 */}
        <div className="camp-supplies">
          <p className="camp-supplies-label">[ 준비물 ]</p>
          <div className="camp-supplies-list">
            {['필기구', '베개', '여벌 양말 & 속옷', '강인한 정신력', '수건'].map((item) => (
              <span className="camp-supply-item" key={item}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── 캠프 신청 문의 모달 ── */}
      {campModal && (
        <div className="camp-modal-backdrop" onClick={() => setCampModal(null)}>
          <div className="camp-modal" onClick={(e) => e.stopPropagation()}>
            <button className="contact-close" onClick={() => setCampModal(null)}>✕</button>

            <div className="camp-modal-header">
              <span className="camp-modal-icon">{campModal === 'summer' ? '☀' : '❄'}</span>
              <h2 className="camp-modal-title">
                {campModal === 'summer' ? '여름방학' : '겨울방학'} 시즌 훈련소 신청
              </h2>
            </div>

            <p className="camp-modal-intro">
              문의는 아래 이메일로 연락 부탁드립니다.<br />
              내용을 읽고 참가 여부를 개별 안내해드리겠습니다.
            </p>

            <a href={`mailto:${CONTACT_EMAIL}`} className="contact-email-link">
              {CONTACT_EMAIL}
            </a>

            <div className="contact-template">
              <p className="contact-template-label">[ 문의 양식 ]</p>
              <div className="contact-template-body">
                <p>📌 제목 : <em>[오프라인 {campModal === 'summer' ? '여름' : '겨울'}방학시즌 훈련소 문의드립니다]</em></p>
                <div className="contact-template-line" />
                <p>🎯 참가 동기 및 이유를 자유롭게 작성해 주세요.</p>
                <div className="contact-template-line" />
              </div>
              <p className="contact-template-footer">
                내용을 검토 후 참가 가능 여부를 이메일로 회신드리겠습니다 😊
              </p>
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}?subject=[오프라인 ${campModal === 'summer' ? '여름' : '겨울'}방학시즌 훈련소 문의드립니다]&body=안녕하세요.%0D%0A%0D%0A참가 동기 및 이유 :%0D%0A%0D%0A`}
              className="btn-contact-send"
            >
              이메일 앱으로 바로 작성하기 →
            </a>
          </div>
        </div>
      )}

      <footer className="footer">
        <p>© 2025 Lv90 수학 · All rights reserved</p>
        <p className="footer-sub">본 사이트의 모든 강의 콘텐츠는 저작권법의 보호를 받습니다.</p>
      </footer>
    </>
  )
}
