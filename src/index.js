/**
 * Created by @tourbillon on 3/5/16.
 */

const restify = require('restify');
const requireDir = require('require-dir');
const customErrorFormatter = require('./utils/custom-error-formatter');
const versioning = require('restify-url-semver');
const config = require('./app/config');

const server = restify.createServer({
                                      name: 'billboard',
                                      versions: config.server.versions,
                                      formatters: {
                                        'application/json': customErrorFormatter
                                      }
                                    });
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());
server.use(restify.requestLogger());
server.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  return next();
});

// Handles undefined body content and replaces it with an Object
server.use((req, res, next) => {
  if ('undefined' === typeof req.body) req.body = {};
return next();
});

// Versioning
server.pre(versioning());

// Generic Error Handling
let defineErrorHandler = (errName, errContent) => {
  server.on(errName, (req, res, err, cb) => {
    // console.log("in error handling: " + errName);
    if ('undefined' === typeof err.message || '' === err.message) {
    err.message = errContent;
  }
  // console.log("out of this error handler");
  // Note: currently only 404 is known to do this, but maybe we'll add more later on.
  if (err instanceof restify.errors.ResourceNotFoundError)
    res.send(err.statusCode, {error: err.message});
  return cb();
});
};

defineErrorHandler('BadRequest', 'Bad request format');
defineErrorHandler('NotFound', 'Record not found');
defineErrorHandler('ResourceNotFound', 'Record not found');
defineErrorHandler('InternalServer', 'Server internal error');
defineErrorHandler('Forbidden', 'Credentials invalid');
defineErrorHandler('Unauthorized', 'Token expired or invalid');

// Register Controllers
server.versions.forEach(version => {
  let semver = version.split('.');
if (semver[2] === '0') {
  semver.splice(2);
  if (semver[1] === '0') semver.splice(1);
}
let trimmedVersion = semver.join('.');
let controllers = requireDir(`./app/v${trimmedVersion}`, { recurse: false });
Object.keys(controllers)
  .map(x => controllers[x])
.map(exported => exported.default)
.forEach(ThatController => new ThatController().register(server, version));
});

// Start Server
server.listen(process.env.PORT || 51119, () => console.log('%s listening at %s', server.name, server.url));

export default server;
