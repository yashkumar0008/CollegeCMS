import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEnrolledCoursesAPI, getMyAttendanceAPI, getNoticesAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/common';
import { MdMenuBook, MdCheckCircle, MdAnnouncement, MdPerson, MdArrowForward } from 'react-icons/md';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getEnrolledCoursesAPI(), getMyAttendanceAPI(), getNoticesAPI()])
      .then(([cRes, aRes, nRes]) => {
        setCourses(cRes.data.courses);
        setStats(aRes.data.stats);
        setNotices(nRes.data.notices.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  const avgAttendance = stats.length > 0
    ? (stats.reduce((acc, s) => acc + parseFloat(s.percentage), 0) / stats.length).toFixed(1)
    : '0.0';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-violet-600 to-violet-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          {user?.photo
            ? <img src={user.photo} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30" alt="" />
            : <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><MdPerson className="text-white text-3xl" /></div>}
          <div>
            <h2 className="text-2xl font-extrabold">Hello, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-violet-200 text-sm mt-0.5">{user?.enrollmentNo || 'Student'} • {user?.department} • Sem {user?.semester}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Enrolled Courses', value: courses.length, icon: MdMenuBook, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, icon: MdCheckCircle, color: parseFloat(avgAttendance) >= 75 ? 'text-green-600' : 'text-red-500', bg: parseFloat(avgAttendance) >= 75 ? 'bg-green-50' : 'bg-red-50' },
          { label: 'Notices', value: notices.length, icon: MdAnnouncement, color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}><Icon className={`text-2xl ${color}`} /></div>
            <div><p className="text-2xl font-bold text-gray-800">{value}</p><p className="text-sm text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Attendance Per Course */}
        {stats.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Attendance Summary</h3>
              <Link to="/student/attendance" className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1">View All <MdArrowForward /></Link>
            </div>
            <div className="space-y-3">
              {stats.map((s) => {
                const pct = parseFloat(s.percentage);
                const color = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
                return (
                  <div key={s.course._id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 truncate">{s.course.name}</span>
                      <span className={`font-bold ${pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>{s.percentage}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${s.percentage}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{s.present}/{s.total} classes</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Latest Notices */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">Latest Notices</h3>
            <Link to="/student/notices" className="text-sm text-primary-600 hover:underline font-medium flex items-center gap-1">View All <MdArrowForward /></Link>
          </div>
          {notices.length === 0
            ? <p className="text-gray-400 text-sm text-center py-8">No notices yet</p>
            : <div className="space-y-3">
              {notices.map((n) => (
                <div key={n._id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0"><MdAnnouncement className="text-orange-600 text-sm" /></div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">{n.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
}
