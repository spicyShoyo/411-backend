const wrap = require('./../../src/utils/wrap');
const assert = require('assert');

var number = 0;
var fun;

function TestClass() {
  this.a = 0;
};
TestClass.prototype = {
  sth: function () { this.a++; }
};

describe('Wrapper Utilities', function () {
  describe('#wrapBefore', function () {
    it('should increment number after function executes', function () {
      fun = wrap.wrapBefore(function () {}, function () { number++; });
      fun();
      assert.equal(number, 1);
    });

    it('should preserve function properties', function () {
      fun = function () {};
      fun._a = 1;
      fun = wrap.wrapBefore(fun, function () {});
      assert.equal(fun._a, 1);
    });

    it('should not break scoping', function () {
      var clazz = new TestClass();
      clazz.sth = wrap.wrapBefore(clazz.sth, function () {}, clazz);
      clazz.sth();
      assert.equal(clazz.a, 1);
    });
  });

  describe('#wrapAfter', function () {
    it('should increment number after function executes', function () {
      fun = wrap.wrapAfter(function () {}, function () { number++; });
      fun();
      assert.equal(number, 2);
    });

    it('should preserve function properties', function () {
      fun = function () {};
      fun._a = 1;
      fun = wrap.wrapAfter(fun, function () {});
      assert.equal(fun._a, 1);
    });
  });

  describe('#intercept', function() {
    it ('should let function run when number is 3', function (done) {
      ++number;
      fun = wrap.intercept(function () { done(); }, function (resolve, reject) {
        if (number === 3) resolve();
        else reject();
      });
      fun();
    });

    it('should not let function run when number is 5', function (done) {
      number += 2;
      fun = wrap.intercept(function () { done(false); }, function (resolve, reject) {
        if (number === 3) resolve();
        else reject(done());
      });
      fun();
    });

    it('should preserve function properties', function () {
      fun = function () {};
      fun._a = 1;
      fun = wrap.intercept(fun, function () {});
      assert.equal(fun._a, 1);
    });
  });
});