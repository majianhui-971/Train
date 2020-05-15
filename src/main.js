// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import './icons'
import './styles/main.css'

// 初始化
import 'normalize.css/normalize.css'

//兼容IE
import 'babel-polyfill'

// 动画效果
import animated from 'animate.css'

// ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';

// 进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import store from './store'

Vue.use(animated);

Vue.use(ElementUI);

// 配置进度条
NProgress.inc(0.2);
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });

router.beforeEach((to, from, next) => {
  NProgress.start();

  if (to.path !== '/admin/login' && to.path.includes('admin') && !window.sessionStorage.admin) {
    next('/admin/login')
  }

  next()
});

router.afterEach(() => {
  NProgress.done()
});

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
