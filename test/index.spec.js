/* global Event */
const
  expect = window.chai.expect,
  sinon = window.sinon,
  opspark = window.opspark,
  factory = opspark.factory;

describe('factory', function () {
  it('should exist as a namespace at window.opspark.factory', function () {
    expect(factory).to.be.an('object');
    expect(factory).to.have.keys('dispatcher');
  });
});

describe('dispatcher', function () {
  describe('on', function () {
    it('should add a handler for the given event type', function () {
      const 
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      expect(dispatcher.has('click')).to.be.true;
    });
    it('should not add duplicate handlers', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = sinon.spy();
      dispatcher.on('click', callback);
      dispatcher.on('click', callback);
      dispatcher.dispatch(new Event('click'));
      expect(callback.calledOnce).to.be.true;
    });
    it('should return API', function () {
      const dispatcher = factory.dispatcher();
      expect(dispatcher.on('click', function() {})).to.eql(dispatcher);
    });
    it('should throw if handler is not a Function', function () {
      const dispatcher = factory.dispatcher();
      expect(() => dispatcher.on('click', 1)).to.throw(TypeError);
    });
  });
  describe('once', function () {
    it('should add a handler for the given event type, only handled once', function () {
      const 
        dispatcher = factory.dispatcher(),
        callback = sinon.spy();
      dispatcher.once('click', callback);
      expect(dispatcher.has('click', callback)).to.be.true;
      dispatcher.dispatch(new Event('click'));
      expect(dispatcher.has('click', callback)).to.be.false;
      dispatcher.dispatch(new Event('click'));
      expect(callback.calledOnce).to.be.true;
    });
  });
  describe('off', function () {
    it('should remove a handler for the given event type', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      dispatcher.off('click', callback);
      expect(dispatcher.has('click')).to.be.false;
    });
    it('should return API', function () {
      const dispatcher = factory.dispatcher();
      expect(dispatcher.off('click', function() {})).to.eql(dispatcher);
    });
  });
  describe('has', function () {
    it('should return true if dispatcher has any handlers of type', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      expect(dispatcher.has('click')).to.be.true;
    });
    it('should return false if dispatcher has no handlers of type', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      expect(dispatcher.has('tick')).to.be.false;
    });
    it('should return true if dispatcher has specific handler for type', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      expect(dispatcher.has('click', callback)).to.be.true;
    });
    it('should return false if dispatcher does not have specific handler for type', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      expect(dispatcher.has('click', function () {})).to.be.false;
    });
    it('should return false if dispatcher has no handlers of type, even if handler is registered by another event', function () {
      const
        dispatcher = factory.dispatcher(),
        callback = function() {};
      dispatcher.on('click', callback);
      expect(dispatcher.has('tick', callback)).to.be.false;
    });
  });
  describe('dispatch', function () {
    it('should do nothing if no handlers registered for event of type', function () {
      const dispatcher = factory.dispatcher();
      expect(() => dispatcher.dispatch(new Event('click'))).to.not.throw();
    });
    it('should dispatch to all handlers registered for event of type', function () {
      const
        dispatcher = factory.dispatcher(),
        callbackOne = sinon.spy(),
        callbackTwo = sinon.spy();
      dispatcher.on('click', callbackOne);
      dispatcher.on('click', callbackTwo);
      dispatcher.dispatch(new Event('click'));
      expect(callbackOne.calledOnce).to.be.true;
      expect(callbackTwo.calledOnce).to.be.true;
    });
    it('should not dispatch to other handlers registered for other events', function () {
      const
        dispatcher = factory.dispatcher(),
        callbackOne = sinon.spy(),
        callbackTwo = sinon.spy();
      dispatcher.on('click', callbackOne);
      dispatcher.on('tick', callbackTwo);
      dispatcher.dispatch(new Event('click'));
      expect(callbackOne.calledOnce).to.be.true;
      expect(callbackTwo.calledOnce).to.be.false;
    });
  });
  describe('clearHandlers', function () {
    it('should clear the map of references to any registerd handlers', function () {
      const callback = function() {};
      expect(factory.dispatcher()
        .on('click', callback)
        .clearHandlers()
        .has('click')).to.be.false;
    });
  });
});