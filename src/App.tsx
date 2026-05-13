import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import MainPage from './pages/MainPage'
import Dashboard from './pages/Dashboard'
import CoursesPage from './pages/CoursesPage'
import LectureViewer from './pages/LectureViewer'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/store" element={<Navigate to="/courses" replace />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/courses/:courseId" element={<LectureViewer />} />
          <Route path="/my-courses" element={<Navigate to="/courses" replace />} />
          <Route path="/my-courses/:courseId" element={<LectureViewer />} />
        </Route>
      </Route>
    </Routes>
  )
}
