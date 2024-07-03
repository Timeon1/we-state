'use strict';

class Store {
  constructor(globalState) {
    this.globalState = globalState || {};
    this.watchCallBack = {};
    this.watchingKeys = [];
  }
  getState(key) {
    if (key) {
      return this.globalState[key] || "";
    } else {
      return this.globalState;
    }
  }
  setState(data) {
    this.globalState = {
      ...this.globalState,
      ...data,
    };
  }

  $watch(key, cb) {
    let watchCallBack = this.watchCallBack;
    let watchingKeys = this.watchingKeys;
    let globalState = this.globalState;
    watchCallBack = Object.assign({}, watchCallBack, {
      [key]: watchCallBack[key] || [],
    });
    if (!watchCallBack[key]) watchCallBack[key] = [];
    watchCallBack[key].push(cb);
    if (!watchingKeys.find((x) => x === key)) {
      watchingKeys.push(key);
      let val = globalState[key];

      Object.defineProperty(globalState, key, {
        configurable: true,
        enumerable: true,
        set(value) {
          const old = globalState[key];
          val = value;
          watchCallBack[key].map((func) => func(value, old));
        },
        get() {
          return val;
        },
      });
    }
  }
  $off(key, handle) {
    let watchCallBack = this.watchCallBack;
    if (watchCallBack[key]) {
      for (var i = 0; i < watchCallBack[key].length; i++) {
        if (watchCallBack[key][i] == handle) {
          watchCallBack[key].splice(i, 1);
        }
      }
    }
  }
}

var main = new Store();

module.exports = main;
