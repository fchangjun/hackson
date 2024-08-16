// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './route/router.js';
import 'lib-flexible/flexible.js';
import './assets/css/global.css';
const app = createApp(App);
app.use(router);
app.mount('#app');