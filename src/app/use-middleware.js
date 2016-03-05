module.exports = (m) => (target, name, descriptor) => {
  let addMiddleware = (fn) => {
    if ('undefined' === typeof fn._middlewares) fn._middlewares = {};
    if (Object.prototype.toString.call(m) !== '[object Array]') fn._middlewares[m._middlewareName] = m;
    else m.forEach(middleware => fn._middlewares[middleware._middlewareName] = middleware);
  };
  if (typeof target === 'object') {
    addMiddleware(descriptor.value);
    descriptor.enumerable = true;
    return descriptor;
  }
  else if (typeof target === 'function') {
    for (let funcName in target.prototype) {
      addMiddleware(target.prototype[funcName]);
    }
    return target;
  }
};