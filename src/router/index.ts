import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/accueil'
  },
  {
    path: '/accueil',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/atmo',
    name: 'Atmo',
    component: () => import('@/views/AtmoPage.vue')
  },
  {
    path: '/previsions',
    name: 'Forecasts',
    component: () => import('@/views/ForecastsPage.vue')
  },
  {
    path: '/pollens',
    name: 'Pollens',
    component: () => import('@/views/PollensPage.vue')
  },
  {
    path: '/mesures',
    name: 'Measurements',
    component: () => import('@/views/MeasurementsPage.vue')
  },
  {
    path: '/episodes',
    name: 'Episodes',
    component: () => import('@/views/EpisodesPage.vue')
  },
  {
    path: '/exposition',
    name: 'Exposition',
    component: () => import('@/views/ExpositionPage.vue')
  },
  {
    path: '/emissions',
    name: 'Emissions',
    component: () => import('@/views/EmissionsPage.vue')
  },
  {
    path: '/cartes',
    name: 'Maps',
    component: () => import('@/views/AnnualMapsPage.vue')
  },
  {
    path: '/microcapteurs',
    name: 'Microsensors',
    component: () => import('@/views/MicrosensorsPage.vue')
  },
  {
    path: '/nuisances',
    name: 'Nuisance',
    component: () => import('@/views/NuisancePage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
