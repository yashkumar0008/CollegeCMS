import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import ContactPage from './pages/public/ContactPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStudents from './pages/admin/AdminStudents';
import AdminFaculty from './pages/admin/AdminFaculty';
import AdminCourses from './pages/admin/AdminCourses';
import AdminNotices from './pages/admin/AdminNotices';
import AdminGallery from './pages/admin/AdminGallery';
import AdminAttendance from './pages/admin/AdminAttendance';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import FacultyCourses from './pages/faculty/FacultyCourses';
import MarkAttendance from './pages/faculty/MarkAttendance';
import AttendanceHistory from './pages/faculty/AttendanceHistory';
import FacultyNotices from './pages/faculty/FacultyNotices';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentCourses from './pages/student/StudentCourses';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentNotices from './pages/student/StudentNotices';

// Layout
import AdminLayout from './layout/AdminLayout';
import FacultyLayout from './layout/FacultyLayout';
import StudentLayout from './layout/StudentLayout';

const ProtectedRoute = ({ children, role }: { children: JSX.Element; role: string }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== role) return <Navigate to={`/${user?.role}`} replace />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="faculty" element={<AdminFaculty />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="notices" element={<AdminNotices />} />
          <Route path="gallery" element={<AdminGallery />} />
          <Route path="attendance" element={<AdminAttendance />} />
        </Route>

        {/* Faculty */}
        <Route path="/faculty" element={<ProtectedRoute role="faculty"><FacultyLayout /></ProtectedRoute>}>
          <Route index element={<FacultyDashboard />} />
          <Route path="courses" element={<FacultyCourses />} />
          <Route path="mark-attendance" element={<MarkAttendance />} />
          <Route path="attendance-history" element={<AttendanceHistory />} />
          <Route path="notices" element={<FacultyNotices />} />
        </Route>

        {/* Student */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="courses" element={<StudentCourses />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="notices" element={<StudentNotices />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
