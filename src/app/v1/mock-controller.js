/**
 * Created by @tourbillon on 3/5/16.
 */

const Controller = require('./../controller');
const { GET, POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');

export default class MockController extends Controller {

  get prefix() { return 'mock'; }

  @POST('')
  @UseMiddleware([
    requireParams({
      a: String
                  })
  ])
  mock(req, res, next) {
    res.send({a: 'b'});
    return next();
  }
}