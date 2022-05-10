function defineReactuive(obj, key, val) {
  //属性拦截
  Object.defineProperty(obj, key, {
    get() {
      console.log("get", key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        console.log("set", key);
        val = newVal;
      }
    },
  });
}
