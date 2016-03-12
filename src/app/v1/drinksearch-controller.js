/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class drinksearchController extends Controller {

  get prefix() { return 'drinksearch'; }

  /**
   * @api {post} /v1/drinksearch Drinksearch
   * @apiName Drinksearch
   * @apiGroup Drinksearch
   *
   * @apiParam typed drink name typed so far.
   *
   * @apiSuccess {String} drinks drinks with name contains the drinktyped.
   *
   */
  @UseMiddleware([
    requireParams({
      drinktyped: String,
                  })
                 ])

  @POST('')
  drinksearch(req, res, next) {
    let drinktyped = req.body.drinktyped;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT * FROM drink WHERE drinkname LIKE '%${drinktyped}%' LIMIT 5;`);
      }).then(rows=> {
        res.send({drinks:rows});
        return next();
      });
  }
}
