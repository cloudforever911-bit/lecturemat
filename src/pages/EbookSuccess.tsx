import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import './pages.css'

const EBOOK_KEY = (uid: string) => `lv120_ebook_${uid}`

const addLocalPurchase = (userId: string, ebookId: string) => {
  try {
    const prev = JSON.parse(localStorage.getItem(EBOOK_KEY(userId)) || '[]') as string[]
    if (!prev.includes(ebookId)) {
      localStorage.setItem(EBOOK_KEY(userId), JSON.stringify([...prev, ebookId]))
    }
  } catch { /* noop */ }
}

const EBOOK_TITLES: Record<string, string> = {
  eb1: '레벨 1 ~ 10',
  eb2: '레벨 11 ~ 18 (도형)',
  eb3: '레벨 19 ~ 30',
  eb4: '레벨 31 ~ 40',
  eb5: '레벨 41 ~ 60',
}

export default function EbookSuccess() {
  const [params] = useSearchParams()
  const { user } = useAuth()
  const [recorded, setRecorded] = useState(false)

  const ebookId = params.get('ebookId') ?? ''
  const orderId = params.get('orderId') ?? ''
  const paymentKey = params.get('paymentKey') ?? ''
  const amount = params.get('amount') ?? ''
  const ebookTitle = EBOOK_TITLES[ebookId] ?? '교재'

  useEffect(() => {
    if (user && ebookId && !recorded) {
      recordPurchase()
      setRecorded(true)
    }
  }, [user, ebookId, recorded])

  const recordPurchase = async () => {
    if (!user) return

    // localStorage 기록
    addLocalPurchase(user.id, ebookId)

    // Supabase 기록 (관리자 확인용)
    await supabase.from('ebook_purchases').insert({
      user_id: user.id,
      user_email: user.email,
      ebook_id: ebookId,
      ebook_title: ebookTitle,
      amount_paid: Number(amount) || 28000,
      order_id: orderId,
      payment_key: paymentKey,
    })
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">
        <div className="ebook-success-wrap">

          <div className="ebook-success-icon">✓</div>
          <h1 className="ebook-success-title">결제가 완료되었습니다</h1>
          <p className="ebook-success-sub">
            교재를 구매해 주셔서 감사합니다.
          </p>

          <div className="ebook-success-box">
            <div className="success-row">
              <span className="success-label">교재명</span>
              <span className="success-value">Lv120 교재 — {ebookTitle}</span>
            </div>
            <div className="success-row">
              <span className="success-label">결제 금액</span>
              <span className="success-value">₩ {Number(amount).toLocaleString()}</span>
            </div>
            {orderId && (
              <div className="success-row">
                <span className="success-label">주문 번호</span>
                <span className="success-value success-value--mono">{orderId}</span>
              </div>
            )}
            {user?.email && (
              <div className="success-row">
                <span className="success-label">발송 이메일</span>
                <span className="success-value">{user.email}</span>
              </div>
            )}
          </div>

          <div className="ebook-success-notice">
            <p>📬 <strong>2 ~ 3일 이내</strong>에 위 이메일 주소로 PDF 교재를 발송해드립니다.</p>
            <p>스팸함도 확인해 주시고, 기간 내 미수신 시 문의하기를 통해 연락해 주세요.</p>
          </div>

          <div className="ebook-success-actions">
            <Link to="/ebook" className="btn-ebook-back">← 교재 목록으로</Link>
            <Link to="/dashboard" className="btn-ebook-dashboard">대시보드로 →</Link>
          </div>

        </div>
      </div>
    </div>
  )
}
