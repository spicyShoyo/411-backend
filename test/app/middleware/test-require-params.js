const assert = require('assert');
const requireParams = require('./../../../src/app/middleware/require-params');



let produceRequest = (b) => {
  return {
    body: b
  }
};

let produceNext = (done) => (err) => done(err);

describe('Require params', function() {
  let mockRequest = produceRequest({
    title: '',
    description: ''
  });
  it('should recognize simple parameters', function(done) {
    requireParams({
      title: String,
      description: String
    })(mockRequest, null, produceNext(done));
  });
  
  it('should recognize type specification', function(done) {
    requireParams({
      title: {type: String},
      description: {type: String}
    })(mockRequest, null, produceNext(done));
  });
  
  it('should parse structure specification outside arrays', function(done) {
    mockRequest = produceRequest({
      deepInside: {
        foo: 'bar'
      }
    });
    requireParams({
      deepInside: {
        structure: {
          foo: String
        }
      }
    })(mockRequest, null, produceNext(done));
  });
  
  it('should also work recursively in the same situation', function(done) {
    mockRequest = produceRequest({
      deepInside: {
        foo: {
          bar: ''
        }
      }
    });
    requireParams({
      deepInside: {
        structure: {
          foo: {
            structure: {
              bar: String
            }
          }
        }
      }
    })(mockRequest, null, produceNext(done));
  });
  
  it('should handle arrays', function(done) {
    mockRequest = produceRequest({
      anArray: ['', 'la']
    });
    requireParams({
      anArray: [String]
    })(mockRequest, null, produceNext(done));
  });
  
  it('and object structures inside arrays', function(done) {
    mockRequest = produceRequest({
      anArray: [
        {
          foo: 'bar'
        },
        {
          foo: 'baz'
        }
      ]
    });
    requireParams({
      anArray: [{structure: {foo: String}}]
    })(mockRequest, null, produceNext(done));
  });
  
  it('should allow optional parameters', function(done) {
    mockRequest = produceRequest({
      title: ''
    });
    requireParams({
      title: String,
      description: {type: String, optional: true}
    })(mockRequest, null, produceNext(done));
  });
});