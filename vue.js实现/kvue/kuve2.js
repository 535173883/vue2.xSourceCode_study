function defineReactive(obj, key, val) {
  observe(val);
  Object.defineProperty(obj, key, {
    get() {
      return val;
    },
    set(newVal) {
      if (newVal !== val) {
        observe(newVal);
        val = newVal;
      }
    },
  });
}

function observe(obj) {
  if (typeof obj !== "object" || obj == null) {
    return obj;
  }
  Object.keys(obj).forEach((key) => {
    defineReactive(obj, key, obj[key]);
  });
}

function proxy(vm) {
  Object.keys(vm.$data).forEach((key) => {
    Object.defineProperty(vm, key, {
      get() {
        return vm.$data[key];
      },
      set(v) {
        vm.$data[key] = v;
      },
    });
  });
}

class compile {
  constructor(options) {
    this.$options = options;
    this.$data = options.data;
    observe(this.$data);
    proxy(this);
    new compile(options.el, this);
  }
}

class Compile {
  constructor(el, vm) {
    this.$vm = vm;
    const dom = document.querySelector(el);
    this.compile(dom);
  }
  compile(el) {
    //遍历el
    const childNodes = el.childNodes;
    childNodes.forEach((node) => {
      if (this.isElement(node)) {
        const attrs = node.attributes;
        Array.from(attrs).forEach((attr) => {
          const arrtName = attr.name;
          const exp = attr.value;
          if (this.idDir(arrtName)) {
            const dir = arrtName.substring(2);
            this[dir] && this[dir](node, exp);
          }
        });
      } else if (this.isInter(node)) {
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
  idDir(arrtName) {
    return arrtName.startsWith("k-");
  }
  isElement(node) {
    return node.nodeType === 1;
  }
  isInter(node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
  }
  compileText(node) {
    node.textContent = this.$vm[RegExp.$1];
  }
}
