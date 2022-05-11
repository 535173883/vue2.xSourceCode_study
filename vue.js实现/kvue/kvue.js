function defineReactive(obj, key, val) {
  // 递归
  observe(val);
  //属性拦截
  Object.defineProperty(obj, key, {
    get() {
      // console.log("get", key);
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        // console.log("set", key);
        observe(newVal);
        val = newVal;
      }
    },
  });
}
//遍历传入obj的所有属性，执行响应式处理
function observe(obj) {
  //首先判断obj是对象
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  Object.keys(obj).forEach((key) => defineReactive(obj, key, obj[key]));
}

function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(val) {
        vm.$data[key] = val;
      },
    });
  });
}

class KVue {
  constructor(options) {
    //0.保存选项
    this.$options = options;
    this.$data = options.data;
    // 1.响应式：递归遍历data中对象，做响应式处理
    observe(this.$data);
    // 1.5代理
    proxy(this);
    //2.编译模板
    new Compile(options.el, this);
  }
}

class Compile {
  constructor(el, vm) {
    //保存实例
    this.$vm = vm;
    //获取宿主元素dom
    const dom = document.querySelector(el);
    //编译它
    this.compile(dom);
  }
  compile(el) {
    //遍历el
    const childNodes = el.childNodes;
    childNodes.forEach((node) => {
      if (this.isElement(node)) {
        //元素:解析动态的指令，属性绑定，事件
        const attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
          //判断是否是一个动态属性
          // 1.指令k-xx
          const arrtName = attr.name;
          const exp = attr.value;
          if (this.idDir(arrtName)) {
            const dir = arrtName.substring(2);
            this[dir] && this[dir](node, exp);
          }
        });
        // console.log("编译元素", node.nodeName);
        //递归

        if (node.childNodes.length > 0) {
          this.compile(node);
        }
      } else if (this.isInter(node)) {
        //差值绑定表达式
        // console.log("插值", node.textContent);
        this.compileText(node);
      }
    });
  }

  //k-html
  html(node, exp) {
    node.innerHTML = this.$vm[exp];
  }
  //k-text
  text(node, exp) {
    node.textContent = this.$vm[exp];
  }
  //解析{{}}
  compileText(node) {
    // 1.获取表达式的值
    node.textContent = this.$vm[RegExp.$1];
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  idDir(arrtName) {
    return arrtName.startsWith("k-");
  }
}
