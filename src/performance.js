function throttle(fn, interval = 500) {
  var __self = fn, timer, firstTime = true;
  return function () {
    var args = arguments,
        __me = this;

    // if first invoke, execute immediately
    if (firstTime) {
      __self.apply(__me, args);
      return firstTime = false;
    }

    // if timer exist, previous execution is not finished.
    if (timer) {
      return false;
    }

    timer = setTimeout(function() {
      clearTimeout(timer);
      timer = null;
      __self.apply(__me, args);
    }, interval);
  }
}


export {
  throttle,
}