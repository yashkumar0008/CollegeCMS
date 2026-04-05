import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MdDashboard, MdMenuBook, MdCheckCircle, MdHistory, MdAnnouncement, MdLogout, MdMenu, MdPerson, MdSchool } from 'react-icons/md';

const navItems = [
  { to: '/faculty', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/faculty/courses', label: 'My Courses', icon: MdMenuBook },
  { to: '/faculty/mark-attendance', label: 'Mark Attendance', icon: MdCheckCircle },
  { to: '/faculty/attendance-history', label: 'Attendance History', icon: MdHistory },
  { to: '/faculty/notices', label: 'Notices', icon: MdAnnouncement },
];

export default function FacultyLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleLogout = () => { logout(); navigate('/login'); };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="px-6 py-5 border-b border-emerald-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center"><MdSchool className="text-white text-xl" /></div>
          <div><p className="text-white font-bold text-sm">College CMS</p><p className="text-emerald-200 text-xs">Faculty Panel</p></div>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-white/20 text-white' : 'text-emerald-100 hover:bg-white/10 hover:text-white'}`}>
            <Icon className="text-lg" />{label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-emerald-700/50">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          {user?.photo ? <img src={user.photo} className="w-8 h-8 rounded-full object-cover" alt="" /> : <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"><MdPerson className="text-white" /></div>}
          <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{user?.name}</p><p className="text-emerald-200 text-xs">Faculty</p></div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-emerald-100 hover:bg-red-500/20 hover:text-red-200 transition-all text-sm font-medium">
          <MdLogout className="text-lg" />Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <aside className="hidden lg:flex flex-col w-64 bg-gradient-to-b from-emerald-700 to-emerald-900 flex-shrink-0"><Sidebar /></aside>
      {open && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} /><aside className="absolute left-0 top-0 h-full w-64 bg-gradient-to-b from-emerald-700 to-emerald-900 flex flex-col z-10"><Sidebar /></aside></div>}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center gap-4">
          <button onClick={() => setOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100"><MdMenu className="text-xl text-gray-600" /></button>
          <h1 className="text-lg font-bold text-gray-800">Faculty Dashboard</h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 lg:p-6"><Outlet /></main>
      </div>
    </div>
  );
}
