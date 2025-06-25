import request from './request'



// 获取教师所教的课程列表
export function getCourseList(teacherId) {
  return request({
    url: `/courses/byTeacher/${teacherId}`,
    method: 'get'
  });
}

// 新建课程
export function createCourse(data) {
  return request({
    url: '/courses',
    method: 'post',
    data
  });
}

// 编辑课程
export function updateCourse(data) {
  return request({
    url: '/courses',
    method: 'post',
    data
  });
}

// 删除课程
export function deleteCourse(courseId) {
  return request({
    url: `/courses/${courseId}`,
    method: 'delete'
  });
}

// 获取课程详情
export function getCourseDetail(courseId) {
  return request({
    url: `/courses/detail/${courseId}`,
    method: 'get'
  });
}

// 获取全部课程列表
export function getAllCourses() {
  return request({
    url: '/api/courses',
    method: 'get'
  });
}

// 学生选课
export function enrollCourse(courseId) {
  return request({
    url: `/api/courses/${courseId}/enroll`,
    method: 'post'
  });
}

// 获取课程详情（介绍页）
export function getCourseIntro(courseId) {
  return request({
    url: `/api/courses/${courseId}/intro`,
    method: 'get'
  });
}


// 获取学生我的的课程
export function getMyCourses() {
  return request({
    url: '/courses/my-courses',
    method: 'get'
  });
}

// 退课
export function quitCourse(courseId) {
  return request({
    url: `/courses/${courseId}/quit`,
    method: 'post'
  });
} 
// 在学生端以关键字形式搜索我的课程
export function searchMyCourses(keyword) {
  return request({
    url: `/courses/search`,
    method: 'get',
    params: {
      keyword
    }
  });
}
