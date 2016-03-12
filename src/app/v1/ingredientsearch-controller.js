/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class ingredientearchController extends Controller {

  get prefix() { return 'ingredientsearch'; }

  /**
   * @api {post} /v1/ingredientsearch Ingredientsearch
   * @apiName Ingredientsearch
   * @apiGroup Ingredientsearch
   *
   * @apiParam typed drink name typed so far.
   *
   * @apiSuccess {String} ingredients ingredients with name contains the ingredienttyped.
   *
   */
  @UseMiddleware([
    requireParams({
      ingredienttyped: String,
                  })
                 ])

  @POST('')
  drinksearch(req, res, next) {
    let ingredienttyped = req.body.ingredienttyped;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT DISTINCT ingredientname FROM ingredientof WHERE ingredientname LIKE '%${ingredienttyped}%' LIMIT 5;`);
      }).then(rows=> {
        res.send({ingredients:rows});
        return next();
      });
  }
}
