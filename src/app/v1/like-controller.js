/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class likeController extends Controller {

  get prefix() { return 'like'; }

  /**
   * @api {get} /v1/like
   * @apiName like
   * @apiGroup like
   *
   * @apiParam username, string
   *            drinkname, string
   * @apiSuccess {String} drinks row returned
   *
   */
  @POST('')
  like(req, res, next) {
    let drinkname = req.body.drinkname;
    let username = req.body.username;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`UPDATE drink SET likes=likes+1 WHERE drinkname='${drinkname}';`);
      }).then(rows=> {
         connection.query(`INSERT INTO likedrink (username, drinkname) VALUES ('${username}', '${drinkname}')`);
        res.send({drinks:rows});
        return next();
      });
  }
}
