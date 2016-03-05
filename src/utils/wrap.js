// Do not use this helper module unless the wrap functions are synchronous.
// The original functions can be async.

export let copyProperties = (ori, aft) => {
  for (let propName in ori) aft[propName] = ori[propName];
};

export let wrapBefore = (original, before, scope) => {
  let retval = function () {
    let args = Array.prototype.slice.call(arguments);
    before(...args);
    if (scope) original = original.bind(scope);
    return original(...args);
  };
  if (scope) retval = retval.bind(scope);
  copyProperties(original, retval);
  return retval;
};

export let wrapAfter = (original, after, scope) => {
  let retval = function () {
    let args = Array.prototype.slice.call(arguments);
    if (scope) original = original.bind(scope);
    return after(...args, original(...args));
  };
  if (scope) retval = retval.bind(scope);
  copyProperties(original, retval);
  return retval;
};

export let intercept = (original, interc, scope) => {
  let retval = function () {
    let args = Array.prototype.slice.call(arguments);

    let result;
    let shouldContinue = true;
    let resolve = () => shouldContinue = true;
    let reject = (val) => {
      shouldContinue = false;
      if (val) result = val;
    };

    interc(resolve, reject, ...args);
    if (shouldContinue) result = original(...args);

    return result;
  };
  if (scope) retval = retval.bind(scope);
  copyProperties(original, retval);
  return retval;
};
