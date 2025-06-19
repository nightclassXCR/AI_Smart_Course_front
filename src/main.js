// main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router.js'

// === 核心改动：先引入您的全局样式，再引入 Element Plus 样式 ===
import './style.css' // 您的全局样式
import 'element-plus/dist/index.css' // Element Plus 的核心样式
// ==========================================================

import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue' // 导入所有 Element Plus 图标

const app = createApp(App)

// 全局注册所有 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)

// === 可选但推荐：确保 el-dialog__wrapper 的 z-index 绝对最高 ===
// 这种方式能确保样式最后加载，拥有最高优先级，避免其他库或样式冲突
const style = document.createElement('style');
style.innerHTML = `
  /* 确保弹窗和遮罩层在所有内容之上 */
  .el-dialog__wrapper {
    z-index: 9999 !important; /* 使用一个极高的值 */
  }
`;
document.head.appendChild(style);
// ===========================================================

app.mount('#app')