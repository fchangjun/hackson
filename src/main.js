// src/main.js
import { createApp } from 'vue';
import VueCameraLib from 'vue-camera-lib';

import App from './App.vue';
import router from './route/router.js';
import 'lib-flexible/flexible.js';
import './assets/css/global.css';
import 'vant/lib/index.css';
const app = createApp(App);
app.use(router);
app.use(VueCameraLib);
app.mount('#app');