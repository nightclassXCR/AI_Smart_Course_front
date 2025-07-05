import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({

  // server: {
  //   allowedHosts: ['14eb4f91.r7.cpolar.top'],
  // },
  server: {
    host: '0.0.0.0' // 同时监听 IPv4 和 IPv6
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // 这里设置别名
    }
  }
})
