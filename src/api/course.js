import request from './request'



// 获取教师所教的课程列表
export function getCourseList(teacherId) {
  return request({
    url: `/courses/byTeacher/${teacherId}`,
    method: 'get',
    params

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
    url: `/courses/${courseId}`,
    method: 'get'
  });
}

// 获取全部课程列表
export function getAllCourses() {
  return request({
    url: '/courses',
    method: 'get'
  });
}

// 学生选课
export function enrollCourse(courseId, userId) {
  return request({
    url: `/courses/enroll/${courseId}`,
    method: 'post',
    data: { userId }
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
export function unenrollCourse(courseId, userId) {
  return request({
    url: `/courses/unenroll/${courseId}`,
    method: 'post',
    data: { userId }
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

// 查询我没选的课程
export function getNotMyCourse(){
  return request({
    url:'/courses/NotMyCourses',
    method:'get'
  });
}

// 获取课程下所有章节
export function getCourseChapters(courseId) {
  return request({
    url: `/courses/chapters/${courseId}`,
    method: 'get'
  });
}

// 获取按章节分组的知识点
export function getGroupedConcepts(courseId) {
  return request({
    url: `/courses/groupedConcepts/${courseId}`,
    method: 'get'
  });
}

export function getCourseByTeacherID(){
  return request({
    url:'/courses/getCourseNameByUserId',
    method:'get'
  });
}

export function getCompleteCourse(){
  return request({
    url:'/courses/getMyCompletedCourse',
    method:'get'
  });
}
