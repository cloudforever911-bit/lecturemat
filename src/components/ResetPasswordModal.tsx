import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './AuthModal.css'

interface Props {
  onClose: () => void
}

export default function ResetPasswordModal({ onClose }: Props) {
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    if (newPw !== confirmPw) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(onClose, 2000)
    }
    setLoading(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="forgot-title">새 비밀번호 설정</h2>
        <p className="forgot-desc">사용할 새 비밀번호를 입력해주세요.</p>

        {success ? (
          <p className="auth-success" style={{ marginTop: 24 }}>
            비밀번호가 변경되었습니다. 잠시 후 닫힙니다.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: 24 }}>
            <div className="form-group">
              <label>새 비밀번호</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="6자 이상"
                required
                minLength={6}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                placeholder="비밀번호 재입력"
                required
                minLength={6}
              />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? '변경 중...' : '비밀번호 변경'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
