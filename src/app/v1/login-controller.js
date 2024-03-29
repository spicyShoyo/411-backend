/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');
const uuid = require('node-uuid');

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
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT * FROM user WHERE username = "${username}" AND password = "${password}";`);
      })
      .then(rows => {
        if (rows.length === 0) return next(new Errors.ForbiddenError());
      })
      .then(() => {
        let newToken = uuid.v4();
        return [connection.query(`UPDATE user SET token = "${newToken}" WHERE username = "${username}";`), newToken];
      })
      .then(([result, newToken]) => {
        res.send({ token: newToken });
      });
  }
}
