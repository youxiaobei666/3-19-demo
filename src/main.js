import { createApp } from 'vue'
import App from './App.vue'
// 导入 element-plus
import ElementPlus from 'element-plus'
// 导入 element-plus 样式
import 'element-plus/dist/index.css'
// 导入 element-plus 图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(ElementPlus).mount('#app')
