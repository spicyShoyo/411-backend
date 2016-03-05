/**
 * Created by @tourbillon on 3/5/16.
 */

const Controller = require('./../controller');
const { GET } = require('./../http-methods');

export default class MockController extends Controller {

  get prefix() { return 'mock'; }

  @GET('')
  mock(req, res, next) {
    res.send({a: 'b'});
    return next();
  }
}