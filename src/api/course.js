import request from './request';

export function getCourseList(params) {
  return request.get('/courses', { params });
}

export function getCourseDetail(id) {
  return request.get(`/courses/${id}`);
}

export function addCourse(data) {
  return request.post('/courses', data);
}

export function updateCourse(id, data) {
  return request.put(`/courses/${id}`, data);
}

export function deleteCourse(id) {
  return request.delete(`/courses/${id}`);
} 