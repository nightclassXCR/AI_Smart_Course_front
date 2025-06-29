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
    // 处理token和user信息
    const { token, user } = response.data || response;
    if (token && user) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    }
    // 添加调试信息
    console.log('API响应成功:', response.config.url, response.data);
    return response.data;
  },
  error => {
    // 添加调试信息
    console.error('API响应错误:', error.config?.url, error.response?.status, error.response?.data);
    return Promise.reject(error);
  }
);

export default request; 