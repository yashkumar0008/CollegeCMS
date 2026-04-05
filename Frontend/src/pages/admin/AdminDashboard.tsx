import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStatsAPI } from '../../services/api';
import { Stats } from '../../types';
import { StatCard, LoadingSpinner } from '../../components/common';
import { MdPeople, MdSchool, MdMenuBook, MdAnnouncement, MdCheckCircle, MdArrowForward } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStatsAPI().then(r => setStats(r.data.stats)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const quickLinks = [
    { to: '/admin/students', label: 'Manage Students', icon: MdPeople, color: 'bg-blue-50 text-blue-600 hover:bg-blue-100' },
    { to: '/admin/faculty', label: 'Manage Faculty', icon: MdSchool, color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' },
    { to: '/admin/courses', label: 'Manage Courses', icon: MdMenuBook, color: 'bg-violet-50 text-violet-600 hover:bg-violet-100' },
    { to: '/admin/notices', label: 'Post Notice', icon: MdAnnouncement, color: 'bg-orange-50 text-orange-600 hover:bg-orange-100' },
    { to: '/admin/attendance', label: 'View Attendance', icon: MdCheckCircle, color: 'bg-pink-50 text-pink-600 hover:bg-pink-100' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
        <h2 className="text-2xl font-extrabold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
        <p className="text-primary-200 text-sm">Here's what's happening on your campus today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard label="Total Students" value={stats?.students || 0} icon={MdPeople} color="text-blue-600" bg="bg-blue-50" />
        <StatCard label="Total Faculty" value={stats?.faculty || 0} icon={MdSchool} color="text-emerald-600" bg="bg-emerald-50" />
        <StatCard label="Courses" value={stats?.courses || 0} icon={MdMenuBook} color="text-violet-600" bg="bg-violet-50" />
        <StatCard label="Notices" value={stats?.notices || 0} icon={MdAnnouncement} color="text-orange-600" bg="bg-orange-50" />
        <StatCard label="Attendance Records" value={stats?.attendance || 0} icon={MdCheckCircle} color="text-pink-600" bg="bg-pink-50" />
      </div>

      {/* Quick Links */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickLinks.map(({ to, label, icon: Icon, color }) => (
            <Link key={to} to={to} className={`flex flex-col items-center gap-2 p-4 rounded-xl ${color} transition-all group`}>
              <Icon className="text-2xl" />
              <span className="text-xs font-semibold text-center leading-tight">{label}</span>
              <MdArrowForward className="text-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
