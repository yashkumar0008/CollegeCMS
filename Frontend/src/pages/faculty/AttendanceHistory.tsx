import { useEffect, useState } from 'react';
import { getMyCoursesAPI, getAttendanceByCourseAPI } from '../../services/api';
import { Course, AttendanceRecord, User } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { MdSearch } from 'react-icons/md';

export default function AttendanceHistory() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState('');
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(true);

  useEffect(() => {
    getMyCoursesAPI().then(r => {
      setCourses(r.data.courses);
      if (r.data.courses.length > 0) setSelectedCourse(r.data.courses[0]._id);
    }).finally(() => setCoursesLoading(false));
  }, []);

  const fetchRecords = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    try {
      const res = await getAttendanceByCourseAPI(selectedCourse, date || undefined);
      setRecords(res.data.attendance);
    } finally { setLoading(false); }
  };

  useEffect(() => { if (selectedCourse) fetchRecords(); }, [selectedCourse, date]);

  const presentCount = records.filter(r => r.status === 'Present').length;

  if (coursesLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">Attendance History</h2><p className="text-gray-500 text-sm">View previously marked attendance</p></div>

      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div>
            <label className="label">Course</label>
            <select className="input" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
              {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Filter by Date</label>
            <input type="date" className="input" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="flex items-end gap-2">
            {date && <button onClick={() => setDate('')} className="btn-secondary text-sm">Clear Date</button>}
            <button onClick={fetchRecords} className="btn-primary text-sm"><MdSearch />Search</button>
          </div>
        </div>

        {records.length > 0 && (
          <div className="flex items-center gap-4 text-sm mb-4 p-3 bg-gray-50 rounded-xl">
            <span className="text-gray-500">Total: <strong>{records.length}</strong></span>
            <span className="text-green-600">Present: <strong>{presentCount}</strong></span>
            <span className="text-red-500">Absent: <strong>{records.length - presentCount}</strong></span>
            <span className="text-blue-600">Rate: <strong>{records.length > 0 ? ((presentCount / records.length) * 100).toFixed(1) : 0}%</strong></span>
          </div>
        )}

        {loading ? <LoadingSpinner /> : records.length === 0 ? <EmptyState title="No attendance records found" subtitle="Try selecting a different course or date" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Student', 'Enrollment No', 'Date', 'Status'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="table-td">
                      <div className="flex items-center gap-2">
                        {(r.student as User).photo ? <img src={(r.student as User).photo} className="w-8 h-8 rounded-full object-cover" alt="" /> : <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-sm">{(r.student as User).name[0]}</div>}
                        <span className="font-medium">{(r.student as User).name}</span>
                      </div>
                    </td>
                    <td className="table-td text-gray-500">{(r.student as User).enrollmentNo || '—'}</td>
                    <td className="table-td">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="table-td"><span className={r.status === 'Present' ? 'badge-present' : 'badge-absent'}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
