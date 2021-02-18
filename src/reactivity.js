let data = { price: 5, quantity: 2 };
let target = null;

class Dep {
  constructor() {
    this.subscribers = [];
  }

  depend() {
    if (target && !this.subscribers.includes(target)) {
      console.log("Running DEPEND");
      this.subscribers.push(target);
      console.log("Stopping DEPEND");
    }
  }

  notify() {
    console.log("Running NOTIFY");
    this.subscribers.forEach((sub) => sub());
    console.log("Stopping NOTIFY");
  }
}

let deps = new Map();
Object.keys(data).forEach((key) => {
  deps.set(key, new Dep());
});

let data_without_proxy = data;
data = new Proxy(data_without_proxy, {
  get(obj, key) {
    console.log("Running GETTER", key);

    deps.get(key).depend();

    console.log("Stopping GETTER", key);

    return obj[key];
  },
  set(obj, key, newVal) {
    console.log("Running SETTER", key, newVal);

    obj[key] = newVal;
    deps.get(key).notify();

    console.log("Stopping SETTER", key, newVal);

    return true;
  },
});

function watcher(myFunc) {
  console.log("Running WATCHER");
  target = myFunc;
  target();
  target = null;
  console.log("Stopping WATCHER");
}

deps.set("discount", new Dep());
data["discount"] = 5;
let salePrice = 0;

watcher(() => {
  salePrice = data.price - data.discount;
});

console.log("1. Sale Price: ", salePrice);
data.discount = 4.5;
console.log("2 . Sale Price: ", salePrice);
