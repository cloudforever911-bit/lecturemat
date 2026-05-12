import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import './AuthModal.css'
import './MyPage.css'

interface Props {
  user: User
  onClose: () => void
  onDeleted: () => void
}

export default function MyPage({ user, onClose, onDeleted }: Props) {
  const [tab, setTab] = useState<'info' | 'security'>('info')

  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState('')

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState('')

  const isGoogleUser = user.app_metadata?.provider === 'google'

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess('')
    if (newPw !== confirmPw) {
      setPwError('새 비밀번호가 일치하지 않습니다.')
      return
    }
    setPwLoading(true)
    const { error } = await supabase.auth.updateUser({ password: newPw })
    if (error) {
      setPwError(error.message)
    } else {
      setPwSuccess('비밀번호가 성공적으로 변경되었습니다.')
      setNewPw('')
      setConfirmPw('')
    }
    setPwLoading(false)
  }

  const handleDeleteAccount = async () => {
    setDeleteLoading(true)
    setDeleteError('')
    const { error } = await supabase.rpc('delete_user')
    if (error) {
      setDeleteError(error.message)
      setDeleteLoading(false)
      return
    }
    await supabase.auth.signOut()
    onDeleted()
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box mypage-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="mypage-title">마이페이지</h2>

        <div className="modal-tabs">
          <button
            className={tab === 'info' ? 'active' : ''}
            onClick={() => { setTab('info') }}
          >
            계정 정보
          </button>
          <button
            className={tab === 'security' ? 'active' : ''}
            onClick={() => { setTab('security'); setPwError(''); setPwSuccess('') }}
          >
            보안
          </button>
        </div>

        {tab === 'info' && (
          <div className="mypage-section">
            <div className="info-row">
              <span className="info-label">이메일</span>
              <span className="info-value">{user.email}</span>
            </div>
            <div className="info-row">
              <span className="info-label">가입일</span>
              <span className="info-value">
                {new Date(user.created_at).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">로그인 방식</span>
              <span className="info-value">
                {isGoogleUser ? 'Google 소셜 로그인' : '이메일'}
              </span>
            </div>
          </div>
        )}

        {tab === 'security' && (
          <div className="mypage-section">
            <h3 className="section-heading">비밀번호 변경</h3>

            {isGoogleUser ? (
              <p className="auth-error" style={{ marginTop: 0 }}>
                Google 로그인 계정은 비밀번호를 변경할 수 없습니다.
              </p>
            ) : (
              <form onSubmit={handlePasswordChange} className="auth-form">
                <div className="form-group">
                  <label>새 비밀번호</label>
                  <input
                    type="password"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="6자 이상"
                    required
                    minLength={6}
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
                {pwError && <p className="auth-error">{pwError}</p>}
                {pwSuccess && <p className="auth-success">{pwSuccess}</p>}
                <button type="submit" className="auth-submit" disabled={pwLoading}>
                  {pwLoading ? '변경 중...' : '비밀번호 변경'}
                </button>
              </form>
            )}

            <div className="danger-zone">
              <h3 className="danger-title">위험 구역</h3>
              <p className="danger-desc">
                계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
              </p>
              <button className="btn-danger" onClick={() => setShowDeleteConfirm(true)}>
                회원탈퇴
              </button>
            </div>
          </div>
        )}

        {showDeleteConfirm && (
          <div className="delete-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="delete-box" onClick={(e) => e.stopPropagation()}>
              <h3 className="delete-heading">정말 탈퇴하시겠습니까?</h3>
              <p className="delete-desc">
                계정과 모든 데이터가 영구 삭제됩니다.<br />이 작업은 되돌릴 수 없습니다.
              </p>
              {deleteError && <p className="auth-error">{deleteError}</p>}
              <div className="delete-actions">
                <button
                  className="btn-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleteLoading}
                >
                  취소
                </button>
                <button
                  className="btn-danger"
                  onClick={handleDeleteAccount}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? '처리 중...' : '탈퇴하기'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
