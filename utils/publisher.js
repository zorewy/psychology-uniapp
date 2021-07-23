class Publisher {
  constructor() {
    this.observers = [];
  }
  add(observer) {
    this.observers.push(observer);
  }
  remove(observer) {
    this.observers.forEach((item, index) => {
      if (item == observer) {
        this.observers.splice(index, 1);
        return;
      }
    });
  }
  notify() {
    this.observers.forEach(item => {
      item.update();
    });
  }
}
class GlobalDataPublisher extends Publisher {
  constructor(globalData) {
    super();
    this.globalData = globalData;
    this.observers = [];
  }
  getGlobalData() {
    return this.globalData;
  }
  setGlobalData(globalData) {
    this.globalData = globalData;
    this.notify();
  }
}
module.exports = {
  Publisher,
  GlobalDataPublisher
};
