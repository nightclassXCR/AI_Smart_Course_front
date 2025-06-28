import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  // 老师端
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: () => import('../views/Dashboard.vue'),
    children: [
      {
        path: '',
        name: 'TeacherHome',
        component: () => import('../views/TeacherHome.vue')
      },
      {
        path: 'courseManagement',
        name: 'CourseManagement',
        component: () => import('../views/courseManagement.vue')
      },
      {
        path: 'courseDetail/:id',
        name: 'TeacherCourseDetail',
        component: () => import('../views/TeacherCourseDetail.vue')
      },
      {
        path: 'courseDetail/:id/students',
        component: () => import('@/views/studentManagement.vue'),
      },
      {
        path: 'homeworkManagement',
        name: 'HomeworkManagement',
        component: () => import('../views/homeworkManagement.vue')
      },
      {
        path: 'resourceCenter',
        name: 'ResourceCenter',
        component: () => import('../views/resourceCenter.vue')
      },
      {
        path: 'learningAnalysis',
        name: 'LearningAnalysis',
        component: () => import('../views/learningAnalysis.vue')
      },
      {
        path: 'profile',
        name: 'TeacherProfile',
        component: () => import('../views/TeacherProfile.vue')
      },
      {
        path: 'questionBank',
        name: 'QuestionBank',
        component: () => import('../views/QuestionBank.vue')
      },
      {
        path: 'questionSelect',
        name: 'QuestionSelect',
        component: () => import('../views/QuestionSelect.vue')
      }
    ]
  },
  // 学生端
  {
    path: '/student',
    name: 'StudentDashboard',
    component: () => import('../views/StudentDashboard.vue'),
    children: [
      {
        path: '',
        name: 'StudentHome',
        component: () => import('../views/StudentHome.vue')
      },
      {
        path: 'myCourse',
        name: 'MyCourse',
        component: () => import('../views/MyCourse.vue')
      },
      {
        path: 'assignment',
        name: 'Assignment',
        component: () => import('../views/Assignment.vue')
      },
      {
        path: 'progress',
        name: 'Progress',
        component: () => import('../views/Progress.vue')
      },
      {
        path: 'knowledgeMap',
        name: 'KnowledgeMap',
        component: () => import('../views/KnowledgeMap.vue')
      },
      {
        path: 'learningAnalysis',
        name: 'StudentLearningAnalysis',
        component: () => import('../views/learningAnalysis.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      },
      {
        path: 'course/:id',
        name: 'CourseDetail',
        component: () => import('../views/CourseDetail.vue')
      },
      {
        path: 'courseIntro/:id',
        name: 'CourseIntro',
        component: () => import('@/views/CourseIntro.vue')
      },
      {
        path: 'chapter/:id',
        name: 'ChapterDetail',
        component: () => import('@/views/ChapterDetail.vue')
      }
    ]
  },
  // 默认首页
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  let userStr = localStorage.getItem('user')
  let user = userStr ? JSON.parse(userStr) : null;
  // 公开页面
  const publicPages = ['/', '/login'];
  if (publicPages.includes(to.path)) {
    return next();
  }
  // 未登录
  if (!user) {
    return next('/login');
  }
  // 老师端页面，学生访问时跳转学生首页
  if (to.path.startsWith('/teacher') && user.role !== 'ROLE_TEACHER') {
    return next('/student');
  }
  // 学生端页面，老师访问时跳转老师首页
  if (to.path.startsWith('/student') && user.role !== 'ROLE_STUDENT') {
    return next('/teacher');
  }
  next();
});

export default router;
