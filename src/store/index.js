import Vue from 'vue'
import Vuex from 'vuex'

import { redisData } from '@/api/common'

Vue.use(Vuex);
const userKey = 'user';
const adminKey = 'admin';
const isLogin = 'isLogin';
const store = new Vuex.Store({
  state () {
    return {
      user: null,
      admin: null,
      isLogin: '0',
      redis: []
    }
  },
  getters: {
    getUser: function (state) {
      if (!state.user) {
        state.user = JSON.parse(sessionStorage.getItem(userKey));
        state.isLogin = sessionStorage.getItem(isLogin)
      }
      return state.user
    },
    getAdmin: function (state) {
      if (!state.admin) {
        state.admin = JSON.parse(sessionStorage.getItem(adminKey));
      }
      return state.admin
    },
  },
  mutations: {
    $_setLogin (state, value) {
      state.isLogin = value;
      sessionStorage.setItem(isLogin, value)
    },

    $_setUser (state, value) {
      state.user = value;
      sessionStorage.setItem(userKey, JSON.stringify(value))
    },

    $_setAdmin (state, value){
      state.admin = value;
      sessionStorage.setItem(adminKey, JSON.stringify(value))
    },

    $_setRedis: (state, data) => {
      const {key, value} = data;
      state.redis[key] = value
    },

    $_removeUser (state) {
      state.user = null;
      sessionStorage.removeItem(userKey)
    },

    $_removeAdmin (state) {
      state.admin = null;
      sessionStorage.removeItem(adminKey)
    },
  },
  actions: {
    fetchRedis({commit, state}, key) {
      return new Promise((resolve, reject) => {
        if (state.redis[key]) {
          resolve(state.redis[key])
        } else {
          redisData(key).then(response => {
            const {data} = response;
            commit('$_setRedis', {key, value: data});
            resolve(data)
          }).catch(error => {
            reject(error)
          })
        }
      })
    },
  }
});

export default store
