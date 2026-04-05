import { useEffect, useState } from 'react';
import { getEnrolledCoursesAPI } from '../../services/api';
import { Course, User } from '../../types';
import { LoadingSpinner, EmptyState } from '../../components/common';
import { MdMenuBook, MdPerson } from 'react-icons/md';

export default function StudentCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEnrolledCoursesAPI().then(r => setCourses(r.data.courses)).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-5">
      <div><h2 className="text-2xl font-extrabold text-gray-800">My Courses</h2><p className="text-gray-500 text-sm">Courses you are enrolled in</p></div>

      {courses.length === 0
        ? <div className="card"><EmptyState title="No courses enrolled" subtitle="Contact admin to enroll in courses" /></div>
        : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((c) => (
            <div key={c._id} className="card hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center flex-shrink-0"><MdMenuBook className="text-violet-600 text-xl" /></div>
                <div>
                  <h3 className="font-bold text-gray-800">{c.name}</h3>
                  <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-semibold">{c.code}</span>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-gray-50 pt-3">
                {[
                  ['Department', c.department],
                  ['Semester', `Semester ${c.semester}`],
                  ['Credits', `${c.credits} Credits`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-400">{k}</span>
                    <span className="font-medium text-gray-700">{v}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-gray-400">Faculty</span>
                  {c.faculty ? (
                    <div className="flex items-center gap-1.5">
                      {(c.faculty as User).photo ? <img src={(c.faculty as User).photo} className="w-5 h-5 rounded-full object-cover" alt="" /> : <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center"><MdPerson className="text-emerald-600 text-xs" /></div>}
                      <span className="font-medium text-gray-700 text-xs">{(c.faculty as User).name}</span>
                    </div>
                  ) : <span className="text-gray-400 text-xs">TBA</span>}
                </div>
              </div>
              {c.description && <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-50 leading-relaxed">{c.description}</p>}
            </div>
          ))}
        </div>
      }
    </div>
  );
}
