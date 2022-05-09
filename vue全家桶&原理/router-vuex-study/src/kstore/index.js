import Vue from "vue";
import Vuex from "./kvuex";

Vue.use(Vuex);

export default new Vuex.Store({
  // state应该是响应式对象
  state: {
    count: 1,
  },
  mutations: {
    // state从何而来
    add(state) {
      state.count++;
    },
  },
  actions: {
    // 上下文从何而来，长什么样
    add({ commit }) {
      setTimeout(() => {
        commit("add");
      }, 1000);
    },
  },
  getters: {
    doubleCounter(state) {
      return state.count * 2;
    },
  },
  modules: {},
});
