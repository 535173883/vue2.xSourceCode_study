let Vue;

class VueRouter {
  constructor(options) {
    this.$options = options;
    Vue.util.defineReactive(
      this,
      "current",
      window.location.hash.slice(1) || "/"
    );
    this.current = "/";
    window.addEventListener("hashchange", () => {
      this.current = window.location.hash.slice(1);
    });
  }
}
VueRouter.install = function (_vue) {
  Vue = _vue;
  // 任务一   挂载$router
  Vue.mixin({
    // vue根实例会有router
    beforeCreate() {
      if (this.$options.router) {
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  Vue.component("router-link", {
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      return h(
        "a",
        {
          attrs: {
            href: "#" + this.to,
          },
        },
        this.$slots.default
      );
    },
  });
  Vue.component("router-view", {
    render(h) {
      let component = null;
      console.log(this.$router);
      const route = this.$router.$options.routes.find((route) => {
        return route.path === this.$router.current;
      });
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  });
};
export default VueRouter;
