export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'faculty' | 'student';
  photo?: string;
  phone?: string;
  address?: string;
  department?: string;
  semester?: number;
  batch?: string;
  enrollmentNo?: string;
  designation?: string;
  qualification?: string;
  experience?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Course {
  _id: string;
  name: string;
  code: string;
  description?: string;
  department: string;
  semester: number;
  credits: number;
  faculty?: User | null;
  students?: User[];
  isActive?: boolean;
  createdAt?: string;
}

export interface AttendanceRecord {
  _id: string;
  student: User;
  course: Course;
  faculty: User;
  date: string;
  status: 'Present' | 'Absent';
}

export interface AttendanceStat {
  course: Course;
  total: number;
  present: number;
  percentage: string;
  records: AttendanceRecord[];
}

export interface Notice {
  _id: string;
  title: string;
  description: string;
  postedBy: User;
  role: 'admin' | 'faculty';
  image?: string;
  createdAt: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  image: string;
  publicId: string;
  uploadedBy?: User;
  createdAt: string;
}

export interface Stats {
  students: number;
  faculty: number;
  courses: number;
  notices: number;
  attendance: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
