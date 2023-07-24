import 'babel-polyfill'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import './assets/main.css'
import store from './store'
import { VueMasonryPlugin } from 'vue-masonry'
import Particles from 'particles.vue3'
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index';
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css';
import Prism from 'prismjs'


VueMarkdownEditor.use(vuepressTheme, {
    Prism,
});
VueMarkdownEditor.use(createEmojiPlugin())


const app = createApp(App)

app.use(VueMarkdownEditor);
app.use(VMdPreviewHtml)
app.use(VueMasonryPlugin)
app.use(router)
app.use(store)
app.use(ElementPlus)
app.use(Particles)
app.mount('#app')
