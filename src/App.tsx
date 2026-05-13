import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import MainPage from './pages/MainPage'
import Dashboard from './pages/Dashboard'
import Store from './pages/Store'
import MyCourses from './pages/MyCourses'
import LectureViewer from './pages/LectureViewer'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/store" element={<Store />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/my-courses/:courseId" element={<LectureViewer />} />
        </Route>
      </Route>
    </Routes>
  )
}
