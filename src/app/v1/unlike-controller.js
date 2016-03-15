/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class unLikeController extends Controller {

  get prefix() { return 'unlike'; }

  /**
   * @api {get} /v1/unlike
   * @apiName unLike
   * @apiGroup unLike
   *
   * @apiParam username, string
   *            drinkname, string
   * @apiSuccess {String} drinks row returned
   *
   */
  @POST('')
  unLike(req, res, next) {
    let drinkname = req.body.drinkname;
    let username = req.body.username;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`UPDATE drink SET likes=likes-1 WHERE drinkname='${drinkname}';`);
      }).then(rows=> {
         connection.query(`DELETE FROM likedrink WHERE username='${username}' AND drinkname='${drinkname}'`);
      }).then(rows => {
        let retStr=`Alright! You just unliked ${drinkname}!`;
        res.send({
          drinks: retStr
        });
        return next();
  		}).catch(err=> {
        let retStr=`You never have liked ${drinkname}!`;
        res.send({
          drinks: retStr
        });
        return next();
      });
  }
}
