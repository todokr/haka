import Vue from 'vue'
import Router from 'vue-router'
import ProductBacklog from './views/ProductBacklog'
import Sprint from './views/Sprint.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'product_backlog',
      component: ProductBacklog
    },
    {
      path: '/sprint',
      name: 'sprint',
      component: Sprint
    }
  ]
})
