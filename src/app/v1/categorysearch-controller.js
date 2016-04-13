
const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class categorysearchController extends Controller {

  get prefix() { return 'categorysearch'; }

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
      categorysearch: String,
                  })
                 ])

  @POST('')
  categorysearch(req, res, next) {
    let categorysearch = req.body.categorysearch;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT distinct category FROM drink WHERE category LIKE "%${categorysearch}%" LIMIT 5;`);
      }).then(rows=> {
        res.send({drinks:rows});
        return next();
      });
  }
}
