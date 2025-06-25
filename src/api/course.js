import request from './request'



// 获取课程列表
export function getCourseList(params) {
  return request({
    url: '/courses',
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
    url: '/courses/update',
    method: 'post',
    data
  });
}

// 删除课程
export function deleteCourse(courseId) {
  return request({
    url: `/courses/delete/${courseId}`,
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

// 题目示例数据
export function getQuestionExamples() {
  return [
    {
      id: 1,
      type: 'single',
      content: '下列哪个属于牛顿第一定律的内容？',
      options: ['物体受力才运动', '物体不受力也能保持匀速直线运动', '力越大加速度越大'],
      answer: 1
    },
    {
      id: 2,
      type: 'multiple',
      content: '下列哪些属于力的三要素？',
      options: ['力的大小', '力的方向', '力的作用点', '力的种类'],
      answer: [0, 1, 2]
    },
    {
      id: 3,
      type: 'blank',
      content: '速度的单位是______。',
      answer: 'm/s'
    },
    {
      id: 4,
      type: 'short',
      content: '简述牛顿第三定律的内容。',
      answer: '作用力与反作用力总是成对出现，大小相等，方向相反。'
    },
    {
      id: 5,
      type: 'single',
      content: '地球的重力加速度约为多少？',
      options: ['9.8m/s²', '10m/s²', '8.9m/s²'],
      answer: 0
    }
  ];
}

// 获取我的课程
export function getMyCourses() {
  return request({
    url: '/api/courses/my-courses',
    method: 'get'
  });
}

// 退课
export function quitCourse(courseId) {
  return request({
    url: `/api/courses/${courseId}/quit`,
    method: 'post'
  });
} 