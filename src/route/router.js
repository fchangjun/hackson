// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import Contact from '../views/Contact.vue';
import Scenic from '@/views/Scenic.vue';
import Map from '@/views/Map.vue';
import Role from '@/views/Role.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/about', name: 'About', component: About },
  { path: '/contact', name: 'Contact', component: Contact },
  { path: '/scenic', name: 'Scenic', component: Scenic },
  { path: '/map', name: 'Map', component: Map },
  { path: '/Role', name: 'Role', component: Role },
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;