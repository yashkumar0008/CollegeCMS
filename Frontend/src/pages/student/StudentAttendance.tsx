import { useEffect, useState } from 'react';
import { getMyAttendanceAPI } from '../../services/api';
import { AttendanceStat, AttendanceRecord, Course } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/common';

export default function StudentAttendance() {
  const [stats, setStats] = useState<AttendanceStat[]>([]);
  const [allRecords, setAllRecords] = useState<AttendanceRecord[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyAttendanceAPI().then(r => {
      setStats(r.data.stats);
      setAllRecords(r.data.attendance);
    }).finally(() => setLoading(false));
  }, []);

  const filteredRecords = selectedCourse === 'all'
    ? allRecords
    : allRecords.filter(r => (r.course as Course)._id === selectedCourse);

  const overallPct = stats.length > 0
    ? (stats.reduce((a, s) => a + parseFloat(s.percentage), 0) / stats.length).toFixed(1)
    : '0.0';

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">My Attendance</h2><p className="text-gray-500 text-sm">Track your attendance across all courses</p></div>

      {stats.length === 0 ? <div className="card"><EmptyState title="No attendance records found" subtitle="Your attendance will appear here once faculty marks it" /></div> : (
        <>
          {/* Overall */}
          <div className={`card border-2 ${parseFloat(overallPct) >= 75 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Attendance</p>
                <p className={`text-4xl font-extrabold mt-1 ${parseFloat(overallPct) >= 75 ? 'text-green-600' : 'text-red-500'}`}>{overallPct}%</p>
                {parseFloat(overallPct) < 75 && <p className="text-red-500 text-xs mt-1 font-medium">⚠️ Below 75% minimum requirement</p>}
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={parseFloat(overallPct) >= 75 ? '#22c55e' : '#ef4444'} strokeWidth="3" strokeDasharray={`${overallPct}, 100`} />
                </svg>
              </div>
            </div>
          </div>

          {/* Per Course Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stats.map((s) => {
              const pct = parseFloat(s.percentage);
              const color = pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500';
              const bg = pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500';
              return (
                <div key={s.course._id} className="card hover:shadow-md transition-all cursor-pointer" onClick={() => setSelectedCourse(s.course._id === selectedCourse ? 'all' : s.course._id)}>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-bold text-gray-800 text-sm truncate">{s.course.name}</p>
                      <p className="text-xs text-gray-400">{s.course.code}</p>
                    </div>
                    <span className={`text-xl font-extrabold ${color}`}>{s.percentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                    <div className={`h-full ${bg} rounded-full`} style={{ width: `${s.percentage}%` }} />
                  </div>
                  <p className="text-xs text-gray-400">{s.present} Present / {s.total - s.present} Absent out of {s.total} classes</p>
                </div>
              );
            })}
          </div>

          {/* Records Table */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Attendance Records</h3>
              <select className="input max-w-xs text-sm" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                <option value="all">All Courses</option>
                {stats.map(s => <option key={s.course._id} value={s.course._id}>{s.course.name}</option>)}
              </select>
            </div>
            {filteredRecords.length === 0 ? <EmptyState title="No records" /> : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>{['Course', 'Date', 'Status'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredRecords.map((r) => (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="table-td"><p className="font-medium">{(r.course as Course).name}</p><p className="text-xs text-gray-400">{(r.course as Course).code}</p></td>
                        <td className="table-td">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                        <td className="table-td"><span className={r.status === 'Present' ? 'badge-present' : 'badge-absent'}>{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
