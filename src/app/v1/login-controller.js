/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class LoginController extends Controller {

  get prefix() { return 'login'; }

  /**
   * @api {post} /v1/login Login
   * @apiName Login
   * @apiGroup Login
   *
   * @apiParam username Username.
   * @apiParam password Password.
   * 
   * @apiSuccess {String} token Access token.
   *
   */
  @UseMiddleware([
    requireParams({
      username: String,
      password: String
                  })
                 ])
  @POST('')
  login(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    db.then(conn => conn.query(`SELECT * FROM user WHERE username = '${username}' AND password = '${password}';`))
      .then(rows => {
        if (rows.length === 0) return next(new Errors.ForbiddenError());
        res.send({ token: rows[0].token });
        return next();
      });
  }
}

