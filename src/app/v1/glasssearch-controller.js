
const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class glasssearchController extends Controller {

  get prefix() { return 'glasssearch'; }

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
      glasssearch: String,
                  })
                 ])

  @POST('')
  glasssearch(req, res, next) {
    let glasssearch = req.body.glasssearch;
    let connection;
    db.then(conn => {
        connection = conn;
        return conn.query(`SELECT distinct glass FROM drink WHERE glass LIKE '%${glasssearch}%' LIMIT 5;`);
      }).then(rows=> {
        res.send({drinks:rows});
        return next();
      });
  }
}
