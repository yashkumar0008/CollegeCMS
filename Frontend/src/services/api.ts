import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5173/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const loginAPI = (data: { email: string; password: string; role: string }) => api.post('/auth/login', data);
export const getMeAPI = () => api.get('/auth/me');

// Admin
export const getStatsAPI = () => api.get('/admin/stats');

// Students
export const getStudentsAPI = (params?: object) => api.get('/students', { params });
export const getStudentAPI = (id: string) => api.get(`/students/${id}`);
export const addStudentAPI = (data: FormData) => api.post('/students', data);
export const updateStudentAPI = (id: string, data: FormData) => api.put(`/students/${id}`, data);
export const deleteStudentAPI = (id: string) => api.delete(`/students/${id}`);

// Faculty
export const getFacultyAPI = (params?: object) => api.get('/faculty', { params });
export const getFacultyMemberAPI = (id: string) => api.get(`/faculty/${id}`);
export const addFacultyAPI = (data: FormData) => api.post('/faculty', data);
export const updateFacultyAPI = (id: string, data: FormData) => api.put(`/faculty/${id}`, data);
export const deleteFacultyAPI = (id: string) => api.delete(`/faculty/${id}`);
export const getFacultyProfileAPI = () => api.get('/faculty/profile');

// Courses
export const getCoursesAPI = () => api.get('/courses');
export const getCourseAPI = (id: string) => api.get(`/courses/${id}`);
export const createCourseAPI = (data: object) => api.post('/courses', data);
export const updateCourseAPI = (id: string, data: object) => api.put(`/courses/${id}`, data);
export const deleteCourseAPI = (id: string) => api.delete(`/courses/${id}`);
export const assignFacultyAPI = (id: string, facultyId: string) => api.put(`/courses/${id}/assign-faculty`, { facultyId });
export const getMyCoursesAPI = () => api.get('/courses/my-courses');
export const getEnrolledCoursesAPI = () => api.get('/courses/enrolled');

// Attendance
export const markAttendanceAPI = (data: object) => api.post('/attendance', data);
export const getAttendanceByCourseAPI = (courseId: string, date?: string) => api.get(`/attendance/course/${courseId}`, { params: { date } });
export const getMyAttendanceAPI = () => api.get('/attendance/my');
export const getAllAttendanceAPI = (params?: object) => api.get('/attendance', { params });

// Notices
export const getNoticesAPI = () => api.get('/notices');
export const getMyNoticesAPI = () => api.get('/notices/my');
export const createNoticeAPI = (data: FormData) => api.post('/notices', data);
export const deleteNoticeAPI = (id: string) => api.delete(`/notices/${id}`);

// Gallery
export const getGalleryAPI = () => api.get('/gallery');
export const uploadImageAPI = (data: FormData) => api.post('/gallery', data);
export const deleteImageAPI = (id: string) => api.delete(`/gallery/${id}`);

export default api;
