// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Scenic from '@/views/Scenic.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/scenic', name: 'Scenic', component: Scenic },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;