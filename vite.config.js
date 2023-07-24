import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import legacy from '@vitejs/plugin-legacy'
import prismjs from 'vite-plugin-prismjs';  //引入markdown高亮代码扩展插件
import optimizer from 'vite-plugin-optimizer'



if (process.env.NODE_ENV === 'stage') {
  require('dotenv').config({path:'.env.stage'})
}else{
  require('dotenv').config({path:'.env.development'})
}
console.log('api请求环境');
console.log(process.env.VITE_APP_API_URL);
console.log('ws请求环境');
console.log(process.env.VITE_APP_WSAPI_URL);

export default defineConfig({
  build:{
    target:'es2015'
  },
  plugins: [
    prismjs({
      languages: ['json','javascript'],
    }),
    vue(),
    optimizer({
      child_process: () => ({
        find: /^(node:)?child_process$/,
        code: `const child_process = import.meta.glob('child_process'); export { child_process as default }`
      })
    }),
    legacy({
      targets: ['chrome 52'],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.array.filter',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.for-each',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]

    })
    
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  //配置代理,解决跨域问题
  server: {
    proxy: {
      "/api": {
        target: process.env.NODE_ENV == 'development' ? 'http://127.0.0.1:9000' : 'http://47.97.189.72:9000',
        changeOrigin: true,
        secure: false
        //rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
