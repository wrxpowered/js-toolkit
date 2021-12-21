export default class EventBus {
  constructor() {
    this._listeners = Object.create(null);
  }

  on(eventName, listener, options = null) {
    this._on(eventName, listener, {
      external: true,
      once: options ? options.once : false,
    });
  }

  off(eventName, listener, options = null) {
    this._off(eventName, listener, {
      external: true,
      once: options ? options.once : false,
    });
  }

  dispatch(eventName) {
    const eventListeners = this._listeners[eventName];
    if (!eventListeners || eventListeners.length === 0) {
      return;
    }
    // Passing all arguments after the eventName to the listeners.
    const args = Array.prototype.slice.call(arguments, 1);
    let externalListeners;
    // Making copy of the listeners array in case if it will be modified
    // during dispatch.
    for (const { listener, external, once } of eventListeners.slice(0)) {
      if (once) {
        this._off(eventName, listener);
      }
      if (external) {
        (externalListeners || (externalListeners = [])).push(listener);
        continue;
      }
      listener.apply(null, args);
    }
    // Dispatch any "external" listeners *after* the internal ones, to give the
    // viewer components time to handle events and update their state first.
    if (externalListeners) {
      for (const listener of externalListeners) {
        listener.apply(null, args);
      }
      externalListeners = null;
    }
  }

  _on(eventName, listener, options = null) {
    const eventListeners = (this._listeners[eventName] || (this._listeners[eventName] = []));
    eventListeners.push({
      listener,
      external: options ? options.external === true : false,
      once: options ? options.once === true : false,
    });
  }

  _off(eventName, listener, options = null) {
    const eventListeners = this._listeners[eventName];
    if (!eventListeners) {
      return;
    }
    for (let i = 0, ii = eventListeners.length; i < ii; i++) {
      if (eventListeners[i].listener === listener) {
        eventListeners.splice(i, 1);
        return;
      }
    }
  }
}