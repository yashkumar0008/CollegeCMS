import { useEffect, useState } from 'react';
import { getMyCoursesAPI } from '../../services/api';
import { Course, User } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { MdMenuBook, MdPeople, MdPerson } from 'react-icons/md';

export default function FacultyCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Course | null>(null);

  useEffect(() => {
    getMyCoursesAPI().then(r => setCourses(r.data.courses)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">My Courses</h2><p className="text-gray-500 text-sm">Courses assigned to you</p></div>

      {courses.length === 0 ? <div className="card"><EmptyState title="No courses assigned" subtitle="Contact admin to get courses assigned" /></div> : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-1 space-y-3">
            {courses.map((c) => (
              <button key={c._id} onClick={() => setSelected(c)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${selected?._id === c._id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-gray-200'}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center flex-shrink-0"><MdMenuBook className="text-violet-600" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">{c.name}</p>
                    <p className="text-xs text-gray-500">{c.code} • Sem {c.semester}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium flex items-center gap-1"><MdPeople className="text-xs" />{c.students?.length || 0}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-2">
            {selected ? (
              <div className="card">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center"><MdMenuBook className="text-violet-600 text-xl" /></div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{selected.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span className="bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full text-xs font-semibold">{selected.code}</span>
                      <span>{selected.department}</span><span>•</span><span>Semester {selected.semester}</span><span>•</span><span>{selected.credits} Credits</span>
                    </div>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2"><MdPeople />Students ({selected.students?.length || 0})</h4>
                {!selected.students?.length
                  ? <EmptyState title="No students enrolled" />
                  : <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                    {(selected.students as User[]).map((s) => (
                      <div key={s._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                        {s.photo ? <img src={s.photo} className="w-9 h-9 rounded-full object-cover" alt="" /> : <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center"><MdPerson className="text-primary-600" /></div>}
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">{s.name}</p>
                          <p className="text-xs text-gray-500">{s.enrollmentNo || s.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                }
              </div>
            ) : (
              <div className="card h-full flex items-center justify-center min-h-48">
                <div className="text-center text-gray-400">
                  <MdMenuBook className="text-5xl mx-auto mb-2 text-gray-200" />
                  <p className="font-medium">Select a course to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
