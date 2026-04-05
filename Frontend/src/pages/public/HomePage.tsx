import { Link } from 'react-router-dom';
import { MdSchool, MdPeople, MdMenuBook, MdCheckCircle, MdArrowForward, MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center"><MdSchool className="text-white text-xl" /></div>
            <span className="font-bold text-gray-800 text-lg">College CMS</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="text-gray-600 hover:text-primary-600 text-sm font-medium transition-colors">Contact</Link>
            <Link to="/login" className="btn-primary text-sm">Login</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-800 via-primary-700 to-primary-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium mb-6">
            <MdSchool className="text-primary-200" /> Welcome to College ERP
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Manage Your Campus<br /><span className="text-primary-200">Seamlessly</span>
          </h1>
          <p className="text-primary-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            A unified platform for Admin, Faculty & Students. Track attendance, manage courses, post notices, and more — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="inline-flex items-center justify-center gap-2 bg-white text-primary-700 font-bold px-8 py-3.5 rounded-xl hover:bg-primary-50 transition-all text-sm">
              Get Started <MdArrowForward />
            </Link>
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-all text-sm border border-white/20">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Everything You Need</h2>
            <p className="text-gray-500 text-lg">Powerful features for every role in your institution</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: MdPeople, title: 'Student Management', desc: 'Add, manage, and track student records with photo upload support.', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: MdSchool, title: 'Faculty Management', desc: 'Manage faculty profiles, assign courses, and track workload.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: MdMenuBook, title: 'Course Management', desc: 'Create and manage courses with faculty and student assignments.', color: 'text-violet-600', bg: 'bg-violet-50' },
              { icon: MdCheckCircle, title: 'Attendance Tracking', desc: 'Mark and monitor attendance with percentage calculations.', color: 'text-orange-600', bg: 'bg-orange-50' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="card hover:shadow-md transition-all">
                <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center mb-4`}><Icon className={`text-2xl ${color}`} /></div>
                <h3 className="font-bold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Three Roles, One Platform</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { role: 'Admin', desc: 'Full control over students, faculty, courses, gallery, and reports.', color: 'from-primary-600 to-primary-800', badge: 'bg-primary-100 text-primary-700' },
              { role: 'Faculty', desc: 'Mark attendance, view assigned courses, post notices for students.', color: 'from-emerald-600 to-emerald-800', badge: 'bg-emerald-100 text-emerald-700' },
              { role: 'Student', desc: 'View profile, enrolled courses, attendance reports, and notices.', color: 'from-violet-600 to-violet-800', badge: 'bg-violet-100 text-violet-700' },
            ].map(({ role, desc, color, badge }) => (
              <div key={role} className={`bg-gradient-to-br ${color} rounded-2xl p-6 text-white`}>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badge} mb-4`}>{role}</span>
                <p className="text-white/90 text-sm leading-relaxed">{desc}</p>
                <Link to="/login" className="mt-4 inline-flex items-center gap-1 text-white/80 hover:text-white text-sm font-medium transition-colors">
                  Login as {role} <MdArrowForward />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center"><MdSchool className="text-white" /></div>
            <span className="font-bold text-white">College CMS</span>
          </div>
          <p className="text-sm text-gray-400">© 2024 College Campus Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
