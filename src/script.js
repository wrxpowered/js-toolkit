function loadScript(src, callback) {
  //load javascript with callback then append to the bottom of body tag.
  var script = document.createElement('script');
  var loaded;
  script.src = src;
  if (typeof callback === 'function') {
    script.onload = script.onreadystatechange = function () {
      if (!loaded && (!script.readyState || /loaded|complete/.test(script.readyState))) {
        script.onload = script.onreadystatechange = null;
        loaded = true;
        callback();
      }
    }
  }
  document.getElementsByTagName('body')[0].appendChild(script);
}


export {
  loadScript,
}