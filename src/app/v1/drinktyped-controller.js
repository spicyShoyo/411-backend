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

export default class drinktypedController extends Controller {

  get prefix() { return 'drinktyped'; }

  /**
   * @api {post} /v1/drinktyped Drinktyped
   * @apiName Drinktyped
   * @apiGroup Drinktyped
   *
   * @apiParam typed drink name typed so far.
   *
   * @apiSuccess {String} drinks drinks with name start with the drinktyped.
   *
   */
  @UseMiddleware([
    requireParams({
      drinktyped: String,
                  })
                 ])

  @POST('')
  drinktyped(req, res, next) {
    let drinktyped = req.body.drinktyped;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT drinkname FROM drink WHERE drinkname LIKE '${drinktyped}%' LIMIT 5;`);
      }).then(rows=> {
        res.send({drinks:rows});
        return next();
      });
  }
}
