import './assets/material-design-iconic-font.min.css'
import './assets/style.min.css'

// preview html
// import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html'
// import '@kangc/v-md-editor/lib/style/preview-html.css'
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css'

// preview vue-markdown 
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import '@kangc/v-md-editor/lib/style/preview.css'
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// vue-markdown highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
    Hljs: hljs,
    extend(md) {
        md.set({
          html: false
        });
    },
})

import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(router)

app.use(VMdPreview)

// app.use(VMdPreviewHtml)

app.mount('#app')
