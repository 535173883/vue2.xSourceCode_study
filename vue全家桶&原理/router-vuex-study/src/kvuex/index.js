let Vue;
class Store {
  constructor(options = {}) {
    this._vm = new Vue({
      data: {
        $$state: options.state,
      },
    });
    this._mutations = options.mutations || {};
    this._actions = options.actions || {};
  }
  get state() {
    return this._vm._data.$$state;
  }
  set state(v) {
    console.error("please use replaceState to reset state");
  }
  commit(type, payload) {
    //获取type对应的mutations
    const entry = this._mutations[type];
    if (!entry) {
      console.error(`unknown mutation type: ${type}`);
      return;
    }
    // 指定上下文为Store实例
    // 传递state给mutation
    entry(this.state, payload);
  }
}

function install(_Vue) {
  Vue = _Vue;
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

export default { Store, install };
