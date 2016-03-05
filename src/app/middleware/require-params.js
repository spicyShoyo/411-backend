const Errors = require('restify-errors');
const defineMiddleware = require('./../define-middleware');

module.exports = defineMiddleware('require-params', (req, res, next, params) => {
  let checkMatch = (bodyParams, requireParams) => {

    let analyzeObject = (b, r) => {
      if (r.hasOwnProperty('type')) return r.type === b.constructor;
      else if (r.hasOwnProperty('structure')) return checkMatch(b, r.structure);
      else throw new Error('Param behavior not specified.');
    };

    for (let key in requireParams) {
      let isOptional = typeof requireParams[key] === 'object' && requireParams[key].optional;
      if (bodyParams.hasOwnProperty(key)) {
        if (requireParams[key].constructor === Function) {
          if (bodyParams[key].constructor !== requireParams[key]) return false;
        }
        else if (requireParams[key].constructor === Array) {
          if (bodyParams[key].constructor === Array) {
            if (requireParams[key][0].constructor === Function) {
              for (let idx = 0; idx < bodyParams[key].length; ++idx) {
                if (bodyParams[key][idx].constructor !== requireParams[key][0]) return false;
              }
            }
            else if (requireParams[key][0].constructor === Object) {
              for (let idx = 0; idx < bodyParams[key].length; ++idx) {
                if (!analyzeObject(bodyParams[key][idx], requireParams[key][0])) return false;
              }
            }
            else throw new Error('Param behaviour not specified.');
          }
          else return false;
        }
        else if (requireParams[key].constructor === Object) {
          return analyzeObject(bodyParams[key], requireParams[key]);
        }
        else throw new Error('Param behaviour not specified.');
      }
      else if (!bodyParams.hasOwnProperty(key) && isOptional) continue;
      else return false;
    }
    return true;
  };

  if (!checkMatch(req.body, params)) return next(new Errors.BadRequestError());
  else return next();
});
