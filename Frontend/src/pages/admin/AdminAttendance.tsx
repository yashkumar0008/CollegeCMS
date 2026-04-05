import { useEffect, useState } from 'react';
import { getAllAttendanceAPI, getStudentsAPI, getCoursesAPI } from '../../services/api';
import { AttendanceRecord, User, Course } from '../../types';
import { LoadingSpinner, EmptyState, Pagination } from '../../components/common';
import { MdFilterList } from 'react-icons/md';

export default function AdminAttendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    Promise.all([getStudentsAPI({ limit: 200 }), getCoursesAPI()])
      .then(([sRes, cRes]) => { setStudents(sRes.data.students); setCourses(cRes.data.courses); });
  }, []);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const res = await getAllAttendanceAPI({ studentId: studentId || undefined, courseId: courseId || undefined, page, limit: 20 });
      setAttendance(res.data.attendance); setPages(res.data.pages); setTotal(res.data.total);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAttendance(); }, [studentId, courseId, page]);

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">Attendance Reports</h2><p className="text-gray-500 text-sm">View and analyze attendance records</p></div>

      <div className="card">
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="flex items-center gap-2 text-gray-500 text-sm"><MdFilterList />Filter by:</div>
          <select className="input max-w-xs" value={studentId} onChange={e => { setStudentId(e.target.value); setPage(1); }}>
            <option value="">All Students</option>
            {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.enrollmentNo})</option>)}
          </select>
          <select className="input max-w-xs" value={courseId} onChange={e => { setCourseId(e.target.value); setPage(1); }}>
            <option value="">All Courses</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
          </select>
          {(studentId || courseId) && <button onClick={() => { setStudentId(''); setCourseId(''); setPage(1); }} className="text-sm text-red-500 hover:underline font-medium">Clear Filters</button>}
        </div>

        <div className="mb-3 text-sm text-gray-500">Total Records: <span className="font-bold text-gray-700">{total}</span></div>

        {loading ? <LoadingSpinner /> : attendance.length === 0 ? <EmptyState title="No attendance records found" /> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{['Student', 'Course', 'Faculty', 'Date', 'Status'].map(h => <th key={h} className="table-th">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {attendance.map((a) => (
                  <tr key={a._id} className="hover:bg-gray-50">
                    <td className="table-td"><div><p className="font-medium">{(a.student as User).name}</p><p className="text-xs text-gray-400">{(a.student as User).enrollmentNo}</p></div></td>
                    <td className="table-td"><div><p className="font-medium">{(a.course as Course).name}</p><p className="text-xs text-gray-400">{(a.course as Course).code}</p></div></td>
                    <td className="table-td">{(a.faculty as User).name}</td>
                    <td className="table-td">{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                    <td className="table-td"><span className={a.status === 'Present' ? 'badge-present' : 'badge-absent'}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination page={page} pages={pages} onPageChange={setPage} />
      </div>
    </div>
  );
}
