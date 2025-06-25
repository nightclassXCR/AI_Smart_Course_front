import axios from 'axios';

const request = axios.create({
  baseURL: 'http://localhost:8080', // 统一加上localhost，去掉/api
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可在此处统一添加token等
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token; // JWT标准写法
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 只做数据处理，不做页面跳转
    const { token, user } = response.data || response;
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    return response.data;
  },
  error => {
    // 可统一处理错误
    return Promise.reject(error);
  }
);

export default request; 