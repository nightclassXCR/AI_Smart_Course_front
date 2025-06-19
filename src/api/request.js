import axios from 'axios';

const request = axios.create({
  baseURL: '/api', // 可根据实际情况修改
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可在此处统一添加token等
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    // 可统一处理错误
    return Promise.reject(error);
  }
);

export default request; 