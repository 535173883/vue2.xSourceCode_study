import Home from "../views/Home.vue";

let Vue;
// vue 插件编写
//实现一个install方法
class VueRouter {
  constructor(options) {
    this.$options = options;
    // 保存当前hash到current
    // current应该是响应式的
    Vue.util.defineReactive(
      this,
      "current",
      window.location.hash.slice(1) || "/"
    );
    this.current = "/";
    //监控hashchange
    window.addEventListener("hashchange", () => {
      // console.log(this.current);
      // #/about => /about
      this.current = window.location.hash.slice(1);
    });
  }
}

// 接受的形参1是Vue构造函数:目的是便于扩展
// install.call(VueRouter,Vue)
VueRouter.install = function (_Vue) {
  Vue = _Vue;
  //1.将$router注册一下
  //下面代码延迟未来某个时刻：根实例创建时
  Vue.mixin({
    beforeCreate() {
      //只需要根实例时执行一次
      if (this.$options.router) {
        // 希望将来任何组件都可以通过$router
        // 访问路由器实例
        Vue.prototype.$router = this.$options.router;
      }
    },
  });
  //2. 注册两个全局组件：router-Link，router-view
  Vue.component("router-link", {
    // 运行时版本，不携带编译器；不能使用template语法
    // 只能使用render函数
    // template: "<a></a>",
    props: {
      to: {
        type: String,
        required: true,
      },
    },
    render(h) {
      //h就是createElement()
      //作用：返回一个虚拟dom
      // <router-link to="/about">abc</router-link>;
      //获取插槽内容：this.$slots.default
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
      // 可以传入一个组件直接渲染
      // 思路：如果可以根据url的hash部分动态匹配这个要渲染的组件
      // window.location.hash
      console.log(this.$router.$options.routes);
      console.log(this.$router.current);
      let component = null;
      const route = this.$router.$options.routes.find((route) => {
        return route.path === this.$router.current;
      });
      console.log(route);
      if (route) {
        component = route.component;
      }
      return h(component);
    },
  });
};

export default VueRouter;
