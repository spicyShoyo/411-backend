/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class likeDrinkController extends Controller {

  get prefix() { return 'likedrink'; }

  /**
   * @api {get} /v1/likedrink
   * @apiName likedrink
   * @apiGroup likedrink
   *
   * @apiParam username, string
   * @apiSuccess {String} drinks drinks liked by the user
   *
   */
  @POST('')
  likedrink(req, res, next) {
    let username = req.body.username;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT d.* FROM likedrink l, drink d WHERE l.username='${username}' AND l.drinkname=d.drinkname;`);
      }).then(rows=> {
        res.send({drinks:rows});
        return next();
      });
  }
}
