import { useAuth } from '../../hooks/useAuth';
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdSchool, MdBadge } from 'react-icons/md';

export default function StudentProfile() {
  const { user } = useAuth();

  const fields = [
    { icon: MdEmail, label: 'Email', value: user?.email },
    { icon: MdPhone, label: 'Phone', value: user?.phone || 'Not provided' },
    { icon: MdLocationOn, label: 'Address', value: user?.address || 'Not provided' },
    { icon: MdSchool, label: 'Department', value: user?.department || 'Not set' },
    { icon: MdBadge, label: 'Enrollment No', value: user?.enrollmentNo || 'Not set' },
    { icon: MdSchool, label: 'Semester', value: user?.semester ? `Semester ${user.semester}` : 'Not set' },
    { icon: MdSchool, label: 'Batch', value: user?.batch || 'Not set' },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      <div><h2 className="text-2xl font-extrabold text-gray-800">My Profile</h2><p className="text-gray-500 text-sm">Your personal information</p></div>

      <div className="card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 mb-6 border-b border-gray-100">
          {user?.photo
            ? <img src={user.photo} className="w-28 h-28 rounded-2xl object-cover shadow-md" alt="" />
            : <div className="w-28 h-28 bg-violet-100 rounded-2xl flex items-center justify-center shadow-md"><MdPerson className="text-violet-400 text-5xl" /></div>}
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-extrabold text-gray-800">{user?.name}</h3>
            <span className="inline-block mt-1 px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm font-semibold">Student</span>
            <p className="text-gray-500 text-sm mt-2">{user?.department} • Semester {user?.semester}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0"><Icon className="text-violet-600" /></div>
              <div>
                <p className="text-xs text-gray-400 font-medium">{label}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
