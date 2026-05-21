import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/authContext'
import './pages.css'

// 마일리지 1 M = ₩10,000 · 교재 ₩10,000 = 1 M
const EBOOK_MILEAGE_COST = 1

const PURCHASE_URL = 'https://naver.me/GuCDrqoW'

interface Ebook {
  id: string
  title: string
  subtitle: string
  desc: string
  initial: string
  color: string
  price: number
}

const EBOOKS: Ebook[] = [
  {
    id: 'eb1',
    title: '레벨 1 ~ 10',
    subtitle: '수와 연산 · 기초 개념',
    desc: '자연수, 정수, 유리수부터 기초 사칙연산까지 원리 중심으로 완벽 정리한 교재입니다. 수학을 처음 시작하는 분께 최적화되어 있습니다.',
    initial: 'Ⅰ',
    color: '#2c5282',
    price: 10000,
  },
  {
    id: 'eb2',
    title: '레벨 11 ~ 18',
    subtitle: '도형 특화',
    desc: '기초 평면도형과 입체도형의 성질을 체계적으로 정리합니다. 도형 영역을 집중 공략하고 싶은 분께 추천합니다.',
    initial: '圖',
    color: '#2c7a4b',
    price: 10000,
  },
  {
    id: 'eb3',
    title: '레벨 19 ~ 30',
    subtitle: '방정식 · 함수 기초',
    desc: '일차방정식부터 이차함수까지, 핵심 개념과 풀이 원리를 단계별로 정리한 교재입니다.',
    initial: 'Ⅲ',
    color: '#7b3a8e',
    price: 10000,
  },
  {
    id: 'eb4',
    title: '레벨 31 ~ 40',
    subtitle: '중등 심화 · 확률 기초',
    desc: '중학교 수학의 심화 내용과 확률·통계 기초를 포함합니다. 중등 전체를 마무리하는 정리 교재입니다.',
    initial: 'Ⅳ',
    color: '#8b3a00',
    price: 10000,
  },
  {
    id: 'eb5',
    title: '레벨 41 ~ 60',
    subtitle: '고등 수학 입문',
    desc: '고등학교 수학의 핵심 개념을 처음 배우는 분을 위한 교재입니다. 다항식, 인수분해, 이차방정식, 집합과 명제를 원리 중심으로 정리합니다.',
    initial: 'Ⅴ',
    color: '#c0392b',
    price: 10000,
  },
]

const EBOOK_KEY = (uid: string) => `lv120_ebook_${uid}`

const getLocalPurchases = (userId: string): string[] => {
  try { return JSON.parse(localStorage.getItem(EBOOK_KEY(userId)) || '[]') }
  catch { return [] }
}

export const addLocalEbookPurchase = (userId: string, ebookId: string) => {
  const prev = getLocalPurchases(userId)
  if (!prev.includes(ebookId)) {
    localStorage.setItem(EBOOK_KEY(userId), JSON.stringify([...prev, ebookId]))
  }
}

export default function EbookPage() {
  const { user, openAuth } = useAuth()
  const [purchasedIds, setPurchasedIds] = useState<Set<string>>(new Set())
  const [loadingMileageId, setLoadingMileageId] = useState<string | null>(null)
  const [mileage, setMileage] = useState<number>(0)

  useEffect(() => {
    if (user) {
      const local = getLocalPurchases(user.id)
      setPurchasedIds(new Set(local))
      setMileage((user.user_metadata?.mileage as number) ?? 0)
    } else {
      setPurchasedIds(new Set())
      setMileage(0)
    }
  }, [user])

  const handlePurchase = (ebook: Ebook) => {
    if (!user) { openAuth(); return }
    if (purchasedIds.has(ebook.id)) return
    window.open(PURCHASE_URL, '_blank')
  }

  const handleMileagePurchase = async (ebook: Ebook) => {
    if (!user) { openAuth(); return }
    if (purchasedIds.has(ebook.id)) return

    if (mileage < EBOOK_MILEAGE_COST) {
      alert(`마일리지가 부족합니다.\n보유: ${mileage} M  /  필요: ${EBOOK_MILEAGE_COST} M\n\n마일리지 충전은 관리자에게 문의해주세요.`)
      return
    }

    setLoadingMileageId(ebook.id)
    const newMileage = mileage - EBOOK_MILEAGE_COST
    setMileage(newMileage)
    await supabase.auth.updateUser({ data: { mileage: newMileage } })

    // ebook_purchases 테이블에 기록 (관리자가 Supabase에서 확인 가능)
    await supabase.from('ebook_purchases').insert({
      user_id: user.id,
      user_email: user.email,
      ebook_id: ebook.id,
      ebook_title: ebook.title,
      amount_paid: 0,
      order_id: `mileage_${ebook.id}_${Date.now()}`,
      payment_key: 'mileage',
    })
    addLocalEbookPurchase(user.id, ebook.id)

    setPurchasedIds(prev => new Set([...prev, ebook.id]))
    setLoadingMileageId(null)
  }

  return (
    <div className="page-wrapper">
      <div className="page-inner">

        <div className="page-header">
          <span className="page-eyebrow">E-BOOK</span>
          <h1 className="page-title">교재 구매</h1>
          <p className="page-subtitle">
            레벨별 핵심 개념을 정리한 PDF 교재입니다. 구매 후 복습과 자습에 활용하세요.
          </p>
        </div>

        {/* 안내 배너 */}
        <div className="ebook-notice">
          <div className="ebook-notice-icon">✉</div>
          <div className="ebook-notice-text">
            <p className="ebook-notice-title">이메일 발송 안내</p>
            <p className="ebook-notice-desc">
              결제 완료 후 <strong>2 ~ 3일 이내</strong>에 가입하신 이메일 주소로 PDF 교재를 발송해드립니다.
              이메일 수신 여부를 꼭 확인해 주시고, 스팸함도 확인 부탁드립니다.
              발송이 지연되는 경우 문의하기를 통해 연락해 주세요.
            </p>
            {user && (
              <p className="ebook-notice-email">
                발송 이메일: <strong>{user.email}</strong>
              </p>
            )}
          </div>
        </div>

        {/* 상품 그리드 */}
        <div className="ebook-grid">
          {EBOOKS.map((ebook) => {
            const bought = purchasedIds.has(ebook.id)
            const isLoadingMileage = loadingMileageId === ebook.id

            return (
              <div
                className={`ebook-card${bought ? ' ebook-card--bought' : ''}`}
                key={ebook.id}
                style={{ '--ebook-color': ebook.color } as React.CSSProperties}
              >
                {bought && <div className="ebook-bought-badge">구매 완료</div>}

                <div className="ebook-card-avatar" style={{ background: ebook.color }}>
                  {ebook.initial}
                </div>

                <div className="ebook-card-title">{ebook.title}</div>
                <div className="ebook-card-subtitle">{ebook.subtitle}</div>
                <div className="ebook-card-desc">{ebook.desc}</div>

                <div className="ebook-card-footer">
                  <span className="ebook-price">₩ {ebook.price.toLocaleString()}</span>
                  <div className="btn-purchase-group">
                    <button
                      className="btn-ebook-purchase"
                      onClick={() => handlePurchase(ebook)}
                      disabled={isLoadingMileage}
                    >
                      구매하기
                    </button>
                    {!bought && user && (
                      <button
                        className={`btn-mileage-purchase${mileage < EBOOK_MILEAGE_COST ? ' btn-mileage-purchase--low' : ''}`}
                        onClick={() => handleMileagePurchase(ebook)}
                        disabled={isLoadingMileage}
                        title={`마일리지 사용 (보유: ${mileage} M / 필요: ${EBOOK_MILEAGE_COST} M)`}
                      >
                        {isLoadingMileage ? '처리 중...' : '◈ 마일리지 구매'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* 하단 안내 */}
        <div className="ebook-bottom-notice">
          <p>· PDF 교재는 개인 학습 목적으로만 사용 가능합니다.</p>
          <p>· 디지털 콘텐츠 특성상 구매 후 환불이 불가합니다. 구매 전 상품 설명을 꼼꼼히 확인해 주세요.</p>
          <p>· 결제 및 배송 관련 문의는 대시보드 &gt; 문의하기를 이용해 주세요.</p>
        </div>

      </div>
    </div>
  )
}
