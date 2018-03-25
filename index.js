(function (window) {

  // use the opspark namespace //
  const opspark = window.opspark = window.opspark || {};
    
  // create the factory namespace //
  const factory = opspark.factory = opspark.factory || {};

  factory.dispatcher = function() {
    let map = {};
    return {
      on: function(type, callback) {
        if(typeof callback !== 'function') throw new TypeError('The callback param must be a Function!');
        const callbacks = map[type];
        if(callbacks && callbacks.indexOf(callback) === -1) {
          callbacks.push(callback);
        } else {
          map[type] = [callback];
        }
        return this;
      },
      off: function(type, callback) {
        const callbacks = map[type];
        if(callbacks) {
          const index = callbacks.indexOf(callback);
          if(index > -1) callbacks.splice(index, 1);
        }
        return this;
      },
      has: function(type, handler = undefined) {
        const callbacks = map[type];
        if(typeof handler === 'function') {
          return callbacks && callbacks.indexOf(handler) > -1 ? true : false;
        }
        return callbacks && callbacks.length ? true : false;
      },
      dispatch: function(event) {
        map[event.type].forEach(function(callback) {
          callback(event);
        });
        return this;
      },
      reset: function() {
        map = {};
        return this;
      },
    };
  };
  
}(window));