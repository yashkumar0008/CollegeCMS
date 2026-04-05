import { useEffect, useState } from 'react';
import { getMyCoursesAPI, markAttendanceAPI } from '../../services/api';
import { Course, User } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { MdCheckCircle, MdClose, MdSave } from 'react-icons/md';

export default function MarkAttendance() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState<User[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    getMyCoursesAPI().then(r => {
      setCourses(r.data.courses);
      if (r.data.courses.length > 0) {
        const first = r.data.courses[0];
        setSelectedCourse(first._id);
        setStudents(first.students || []);
        initAttendance(first.students || []);
      }
    }).finally(() => setLoading(false));
  }, []);

  const initAttendance = (studs: User[]) => {
    const init: Record<string, 'Present' | 'Absent'> = {};
    studs.forEach(s => { init[s._id] = 'Present'; });
    setAttendance(init);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    const course = courses.find(c => c._id === courseId);
    const studs = (course?.students || []) as User[];
    setStudents(studs);
    initAttendance(studs);
    setSuccess(''); setError('');
  };

  const toggle = (id: string) => setAttendance(prev => ({ ...prev, [id]: prev[id] === 'Present' ? 'Absent' : 'Present' }));
  const markAll = (status: 'Present' | 'Absent') => {
    const updated: Record<string, 'Present' | 'Absent'> = {};
    students.forEach(s => { updated[s._id] = status; });
    setAttendance(updated);
  };

  const handleSave = async () => {
    if (!selectedCourse) return;
    setSaving(true); setError(''); setSuccess('');
    try {
      const attendanceData = students.map(s => ({ studentId: s._id, status: attendance[s._id] }));
      await markAttendanceAPI({ courseId: selectedCourse, date, attendanceData });
      setSuccess('Attendance marked successfully!');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error marking attendance');
    } finally { setSaving(false); }
  };

  const presentCount = Object.values(attendance).filter(v => v === 'Present').length;
  const absentCount = students.length - presentCount;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">Mark Attendance</h2><p className="text-gray-500 text-sm">Record student attendance for your courses</p></div>

      <div className="card space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">Select Course</label>
            <select className="input" value={selectedCourse} onChange={e => handleCourseChange(e.target.value)}>
              {courses.map(c => <option key={c._id} value={c._id}>{c.name} ({c.code})</option>)}
            </select>
          </div>
          <div>
            <label className="label">Date</label>
            <input type="date" className="input" value={date} max={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        {students.length > 0 && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-500">Total: <strong>{students.length}</strong></span>
              <span className="text-green-600">Present: <strong>{presentCount}</strong></span>
              <span className="text-red-500">Absent: <strong>{absentCount}</strong></span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => markAll('Present')} className="text-xs px-3 py-1.5 bg-green-100 text-green-700 rounded-lg font-semibold hover:bg-green-200 transition-colors">All Present</button>
              <button onClick={() => markAll('Absent')} className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded-lg font-semibold hover:bg-red-200 transition-colors">All Absent</button>
            </div>
          </div>
        )}
      </div>

      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 text-sm font-medium">{success}</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">{error}</div>}

      {students.length === 0
        ? <div className="card"><EmptyState title="No students enrolled in this course" /></div>
        : (
          <div className="card">
            <div className="space-y-2">
              {students.map((s, i) => {
                const isPresent = attendance[s._id] === 'Present';
                return (
                  <div key={s._id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${isPresent ? 'border-green-200 bg-green-50' : 'border-red-100 bg-red-50'}`} onClick={() => toggle(s._id)}>
                    <span className="text-xs text-gray-400 w-6 text-center font-medium">{i + 1}</span>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {s.photo ? <img src={s.photo} className="w-9 h-9 rounded-full object-cover flex-shrink-0" alt="" /> : <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0 text-gray-500 font-bold text-sm">{s.name[0]}</div>}
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                        <p className="text-xs text-gray-500">{s.enrollmentNo || s.email}</p>
                      </div>
                    </div>
                    <button type="button" className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${isPresent ? 'bg-green-500' : 'bg-red-400'}`}>
                      {isPresent ? <MdCheckCircle className="text-white text-lg" /> : <MdClose className="text-white text-lg" />}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="mt-5 flex justify-end">
              <button onClick={handleSave} disabled={saving} className="btn-primary">
                <MdSave />{saving ? 'Saving...' : 'Save Attendance'}
              </button>
            </div>
          </div>
        )}
    </div>
  );
}
