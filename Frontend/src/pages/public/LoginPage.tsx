import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginAPI } from '../../services/api';
import { MdSchool, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginAPI(form);
      login(res.data.token, res.data.user);
      navigate(`/${form.role}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { value: 'admin', label: 'Admin', color: 'bg-primary-600' },
    { value: 'faculty', label: 'Faculty', color: 'bg-emerald-600' },
    { value: 'student', label: 'Student', color: 'bg-violet-600' },
  ];

  const roleColor = { admin: 'from-primary-700 to-primary-900', faculty: 'from-emerald-700 to-emerald-900', student: 'from-violet-700 to-violet-900' }[form.role];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left Panel */}
      <div className={`hidden lg:flex lg:w-1/2 bg-gradient-to-br ${roleColor} flex-col items-center justify-center p-12 transition-all duration-500`}>
        <div className="max-w-sm text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6"><MdSchool className="text-white text-4xl" /></div>
          <h1 className="text-4xl font-extrabold text-white mb-3">College CMS</h1>
          <p className="text-white/70 text-lg">Campus Management System</p>
          <div className="mt-8 space-y-3 text-left">
            {['Track attendance & performance', 'Manage courses & faculty', 'Post & view announcements', 'Access everything in one place'].map((f) => (
              <div key={f} className="flex items-center gap-3 text-white/80 text-sm">
                <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-xs">✓</span></div>{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center"><MdSchool className="text-white text-xl" /></div>
            <span className="font-bold text-gray-800 text-xl">College CMS</span>
          </div>

          <div className="card">
            <h2 className="text-2xl font-extrabold text-gray-800 mb-1">Welcome back</h2>
            <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

            {/* Role Selector */}
            <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6">
              {roles.map(({ value, label }) => (
                <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                  className={`flex-1 py-2.5 text-sm font-semibold transition-all ${form.role === value ? `${value === 'admin' ? 'bg-primary-600' : value === 'faculty' ? 'bg-emerald-600' : 'bg-violet-600'} text-white` : 'text-gray-500 hover:bg-gray-50'}`}>
                  {label}
                </button>
              ))}
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email Address</label>
                <div className="relative">
                  <MdEmail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="input pl-10" placeholder="Enter your email" required />
                </div>
              </div>
              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <MdLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input type={showPass ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="input pl-10 pr-10" placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className={`w-full justify-center py-3 text-sm font-bold rounded-xl text-white transition-all disabled:opacity-60 ${form.role === 'admin' ? 'bg-primary-600 hover:bg-primary-700' : form.role === 'faculty' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-violet-600 hover:bg-violet-700'}`}>
                {loading ? 'Signing in...' : `Sign In as ${roles.find(r => r.value === form.role)?.label}`}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">Demo: admin@college.edu / Admin@123</p>
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/" className="text-primary-600 hover:underline font-medium">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
