import request from './request';

// 获取学生列表
export function getStudentList(params) {
  return request({
    url: '/student/list',
    method: 'get',
    params
  });
}

// 新建学生
export function createStudent(data) {
  return request({
    url: '/student/create',
    method: 'post',
    data
  });
}

// 编辑学生
export function updateStudent(data) {
  return request({
    url: '/student/update',
    method: 'post',
    data
  });
}

// 删除学生
export function deleteStudent(studentId) {
  return request({
    url: `/student/delete/${studentId}`,
    method: 'delete'
  });
}

// 获取学生详情
export function getStudentDetail(studentId) {
  return request({
    url: `/student/detail/${studentId}`,
    method: 'get'
  });
} 