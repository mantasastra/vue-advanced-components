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

Object.keys(data).forEach((key) => {
  let internalValue = data[key];

  const dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      console.log(`Getting ${key.toUpperCase()}`, internalValue);
      dep.depend();
      return internalValue;
    },
    set(newVal) {
      console.log(`Setting ${key.toUpperCase()} to`, newVal);
      internalValue = newVal;
      dep.notify();
    },
  });
});

function watcher(myFunc) {
  console.log("Running WATCHER");
  target = myFunc;
  target();
  target = null;
  console.log("Stopping WATCHER");
}

watcher(() => {
  data.total = data.price * data.quantity;
});

console.log("1.", data.total);
data.price = 20;
console.log("2.", data.total);
data.quantity = 5;
console.log("3.", data.total);
