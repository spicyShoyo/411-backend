/**
 * Created by @tourbillon on 3/5/16.
 */

// const authenticate = require('./middleware/authentication');
const Errors = require('restify-errors');
const config = require('./config');
const { copyProperties } = require('./../utils/wrap');
const b = require('bluebird');

class Controller {

  register (server, version) {
    if (!this.prefix) throw new Error(`No prefix defined for controller ${this.constructor.name}`);
    let prefix = this.prefix;
    for (let funcName in this) {
      if (typeof this[funcName]._path !== 'undefined') {
        let path = prefix + this[funcName]._path;
        let method = this[funcName]._method;

        // Resolve middlewares
        if (typeof this[funcName]._middlewares !== 'undefined') {
          let original = this[funcName];
          let middlewares = [];
          for(let middlewareName in original._middlewares) {
            middlewares.push(original._middlewares[middlewareName]);
          }
          let newFun = function(req, res, next) {
            b.mapSeries(middlewares, middleware => {
                return new Promise((resolve, reject) => {
                  let ifError = err => {
                    if (!err) return resolve();
                    else return reject(err);
                  };
                  middleware(req, res, ifError);
                });
              })
              /*
              // Authentication, should be the last for performance
              .then(() => {
                // Authentication attributes on methods take precedence over that on the class
                if (typeof this[funcName]._authenticate_override === 'boolean')
                  this[funcName]._authenticate = this[funcName]._authenticate_override;
                // If an authentication attribute is defined here, wrap the function
                if (typeof this[funcName]._authenticate === 'boolean' && this[funcName]._authenticate) {
                  return new Promise((resolve, reject) => {
                    let ifError = err => {
                      if (!err) return resolve();
                      else return reject(err);
                    };
                    authenticate()(req, res, ifError);
                  });
                }
              })
              */
              .then(() => original(req, res, next))
              .catch(err => next(err));
          }.bind(this);
          copyProperties(original, newFun);
          this[funcName] = newFun;
        }

        // Register this handler
        server[method]({ path: path, version: version }, this[funcName]);
      }
    }
  }
}

module.exports = Controller;
