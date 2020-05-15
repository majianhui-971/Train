import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: "/",
      name: 'Home',
      component: () => import('@/views/Home'),
    },
    {
      path: "/hello",
      name: 'Hello',
      component: () => import('@/views/Hello'),
    },
    {
      path: "/login",
      name: 'Login',
      component: () => import('@/views/Login'),
    },
    {
      path: "/admin",
      name: 'AdminHome',
      component: () => import('@/views/admin/Home'),
    },
    {
      path: "/admin/login",
      name: 'AdminLogin',
      component: () => import('@/views/admin/Login'),
    },
  ]
})

const routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
};
