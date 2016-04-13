
const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');
const uuid = require('node-uuid');

export default class clustercenterController extends Controller {

  get prefix() { return 'clustercenter'; }

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
      username: String,
                  })
                 ])

  @POST('')
  drinktyped(req, res, next) {
    let username = req.body.username;
    let connection;
    db.then(conn => {
      connection = conn;
      return conn.query(`SELECT * FROM drink WHERE drinkname IN
                         (SELECT DISTINCT clustercenter FROM clustering
                         WHERE clustercenter <> ALL
                         (SELECT DISTINCT drinkname FROM likedrink WHERE username = "${username}")
                         ORDER BY RAND()) LIMIT 16;`);
        }).then(rows => {
          if (rows.length !== 16)
            return conn.query(`SELECT * FROM drink WHERE drinkname = ANY
                              (SELECT DISTINCT clustercenter FROM clustering
                              ORDER BY RAND()) LIMIT 16;`);
          else
            return rows;
        }).then(rows => {
          for (let i = 0; i < 16; ++i) {
            rows[i]["featured"]=false;
          }
          rows[0]["featured"]=true;
          rows[3]["featured"]=true;
          rows[8]["featured"]=true;
          rows[11]["featured"]=true;
          res.send({
            drinks: rows
          });
        }).catch(err => {return next(new Errors.InternalServerError())});
  }
}
