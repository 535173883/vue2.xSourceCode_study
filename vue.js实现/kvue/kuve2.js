function defineReactive(obj, key, val) {
  observe(obj);
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        observe(obj);
        val = newVal;
      }
    },
  });
}

function observe(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  Object.keys(obj).forEach((item) => {
    defineReactive(obj, item, obj[item]);
  });
}

function proxy(vm) {
  Object.keys(vm.$data).keys((item) => {
    Object.defineProperty(vm, item, {
      get() {
        return vm.$data[item];
      },
      set(newval) {
        vm.$data[key] = newval;
      },
    });
  });
}

class Kvue {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    observe(this.$data);
    proxy(this);
  }
}
