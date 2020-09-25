import Vue from 'vue'
import Router from 'vue-router'
import { premiumGuard, nonPremiumGuard, loginGuard, landingGuard } from 'routeGuards'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landing',
      component: () => import('pages/Landing'),
      meta: {
        guard: landingGuard
      }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('pages/Dashboard'),
      meta: {
        guard: nonPremiumGuard
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('pages/Login'),
      meta: {
        guard: loginGuard
      }
    },
    {
      path: '/browse',
      component: () => import('pages/browse/Browse'),
      children: [
        {
          path: 'categories',
          component: () => import('pages/browse/Categories'),
          meta: {
            guard: nonPremiumGuard
          }
        },
        {
          path: 'categories/:mediaType/:tag',
          component: () => import('pages/browse/Tags'),
          meta: {
            guard: nonPremiumGuard
          }
        },
        {
          path: '',
          component: () => import('pages/browse/Filter'),
          meta: {
            guard: nonPremiumGuard
          }
        }
      ]
    },
    {
      path: '/queue',
      name: 'queue',
      component: () => import('pages/Queue'),
      meta: {
        guard: nonPremiumGuard
      }
    },
    {
      path: '/media/:id',
      name: 'media',
      component: () => import('pages/Media'),
      meta: {
        guard: nonPremiumGuard
      }
    },
    {
      path: '/series/:id',
      name: 'series',
      component: () => import('pages/Series'),
      meta: {
        disableContainer: true,
        guard: nonPremiumGuard
      }
    },
    {
      path: '/premium',
      name: 'premium',
      component: () => import('pages/Premium'),
      meta: {
        guard: nonPremiumGuard
      }
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('pages/History'),
      meta: {
        guard: nonPremiumGuard
      }
    },
    {
      path: '*',
      name: 'notFound',
      component: () => import('pages/NotFound')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.meta.guard != null) {
    to.meta.guard(to, from, next)
  } else {
    next()
  }
})

export default router
