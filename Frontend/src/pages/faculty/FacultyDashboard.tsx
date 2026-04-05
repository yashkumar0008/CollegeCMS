import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFacultyProfileAPI } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { LoadingSpinner } from '../../components/common';
import { MdMenuBook, MdPeople, MdCheckCircle, MdAnnouncement, MdArrowForward, MdPerson } from 'react-icons/md';

export default function FacultyDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFacultyProfileAPI()
      .then(r => setCourses(r.data.courses))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = courses.reduce((acc, c) => acc + (c.students?.length || 0), 0);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          {user?.photo
            ? <img src={user.photo} className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30" alt="" />
            : <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center"><MdPerson className="text-white text-3xl" /></div>}
          <div>
            <h2 className="text-2xl font-extrabold">Welcome, {user?.name?.split(' ')[0]}! 👋</h2>
            <p className="text-emerald-200 text-sm mt-0.5">{user?.designation || 'Faculty'} • {user?.department || 'Department'}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Assigned Courses', value: courses.length, icon: MdMenuBook, color: 'text-violet-600', bg: 'bg-violet-50' },
          { label: 'Total Students', value: totalStudents, icon: MdPeople, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Departments', value: [...new Set(courses.map(c => c.department))].length, icon: MdCheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card flex items-center gap-4">
            <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center`}><Icon className={`text-2xl ${color}`} /></div>
            <div><p className="text-2xl font-bold text-gray-800">{value}</p><p className="text-sm text-gray-500">{label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { to: '/faculty/courses', label: 'My Courses', icon: MdMenuBook, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
            { to: '/faculty/mark-attendance', label: 'Mark Attendance', icon: MdCheckCircle, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
            { to: '/faculty/attendance-history', label: 'View History', icon: MdPeople, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
            { to: '/faculty/notices', label: 'Post Notice', icon: MdAnnouncement, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
          ].map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} transition-all group`}>
              <Icon className="text-2xl" />
              <span className="text-xs font-semibold text-center">{label}</span>
              <MdArrowForward className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>

      {loading ? <LoadingSpinner /> : courses.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4">My Courses</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {courses.map((c: any) => (
              <div key={c._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0"><MdMenuBook className="text-violet-600" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.code} • {c.students?.length || 0} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
