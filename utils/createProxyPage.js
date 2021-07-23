function createProxyPage(objProps) {
  Reflect.set(objProps, 'update', function () {
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    if (this === page) {
      const app = getApp();
      const globalData = app.globalDataPublisher.getGlobalData();
      this.globalData = globalData;
      this.setData({
        ...globalData,
      });
    }
  });
  const proxyPage = new Proxy(objProps, {
    get(target, prop) {
      if (prop === 'onShow') {
        Reflect.set(
          target,
          prop,
          new Proxy(target[prop], {
            apply(target, thisArgument, argumentsList) {
              const app = getApp();
              thisArgument.globalData = app.globalDataPublisher.getGlobalData();
              thisArgument.setData({
                ...thisArgument.globalData,
              });
              return Reflect.apply(target, thisArgument, argumentsList);
            },
          })
        );
      }
      if (prop === 'onLoad') {
        Reflect.set(
          target,
          prop,
          new Proxy(target[prop], {
            apply(target, thisArgument, argumentsList) {
              const app = getApp();
              app.globalDataPublisher.add(thisArgument);
              thisArgument.globalDataPublisher = app.globalDataPublisher;
              thisArgument.globalData = app.globalDataPublisher.getGlobalData();
              thisArgument.setData({
                ...thisArgument.globalData,
              });
              return Reflect.apply(target, thisArgument, argumentsList);
            },
          })
        );
      }
      return Reflect.get(target, prop);
    },
  });
  return proxyPage;
}
module.exports.createProxyPage = createProxyPage;