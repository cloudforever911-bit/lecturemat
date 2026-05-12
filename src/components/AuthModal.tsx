import { useState } from 'react'
import { supabase } from '../lib/supabase'
import './AuthModal.css'

interface Props {
  onClose: () => void
  onSuccess: () => void
}

export default function AuthModal({ onClose, onSuccess }: Props) {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const reset = (next: 'login' | 'signup' | 'forgot') => {
    setMode(next)
    setError('')
    setMessage('')
  }

  const handleGoogleLogin = async () => {
    setError('')
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        onSuccess()
        onClose()
      }
    } else if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setError(error.message)
      } else {
        setMessage('가입 확인 이메일을 발송했어요. 이메일을 확인해주세요!')
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      })
      if (error) {
        setError(error.message)
      } else {
        setMessage('비밀번호 재설정 이메일을 발송했어요. 이메일을 확인해주세요!')
      }
    }

    setLoading(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        {/* 비밀번호 찾기 화면 */}
        {mode === 'forgot' ? (
          <>
            <button className="back-btn" onClick={() => reset('login')}>← 로그인으로</button>
            <h2 className="forgot-title">비밀번호 찾기</h2>
            <p className="forgot-desc">가입한 이메일을 입력하면 재설정 링크를 보내드립니다.</p>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-success">{message}</p>}
              <button type="submit" className="auth-submit" disabled={loading || !!message}>
                {loading ? '전송 중...' : '재설정 링크 보내기'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="modal-tabs">
              <button
                className={mode === 'login' ? 'active' : ''}
                onClick={() => reset('login')}
              >
                로그인
              </button>
              <button
                className={mode === 'signup' ? 'active' : ''}
                onClick={() => reset('signup')}
              >
                회원가입
              </button>
            </div>

            <button
              className="google-btn"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              type="button"
            >
              <svg className="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {googleLoading ? '연결 중...' : 'Google로 계속하기'}
            </button>

            <div className="auth-divider">
              <span>또는</span>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>이메일</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label>비밀번호</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="6자 이상"
                  required
                  minLength={6}
                />
                {mode === 'login' && (
                  <button
                    type="button"
                    className="forgot-link"
                    onClick={() => reset('forgot')}
                  >
                    비밀번호를 잊으셨나요?
                  </button>
                )}
              </div>

              {error && <p className="auth-error">{error}</p>}
              {message && <p className="auth-success">{message}</p>}

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
