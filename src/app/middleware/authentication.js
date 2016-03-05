const { getCurrentPerson } = require('./../mytoken');
const Errors = require('restify-errors');
const defineMiddleware = require('./../define-middleware');
const config = require('./../config');
module.exports = defineMiddleware('authentication', (req, res, next) => {
  getCurrentPerson(req)
  .then(person => {
    if (!person) return next(new Errors.ForbiddenError());
    else if (new Date().getTime() - person.lastLoginAt.setTime() > config.authentication.expiresAfter * 60000) {
      return next(new Errors.UnauthorizedError());
    }
    else {
      req.personId = person._id;
      req.person = person; // Deprecated
      return next();
    }
  })
  .catch(err => {
    if (err.message === 'No token specified.') return next(new Errors.ForbiddenError());
    else return next(new Errors.InternalServerError());
  });
});
