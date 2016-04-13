
const Controller = require('./../controller');
const { POST } = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class addDrinkController extends Controller {

  get prefix() { return 'adddrink'; }

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
  adddrink(req, res, next) {
    let drinkname = req.body.drinkname;
    let category = req.body.category;
    let alcohol = "Alcoholic";
    let glass = req.body.glass;
    let num = 99999;
    let likes = 0;
    let connection;
    let url;
    db.then(conn => {
      connection = conn;
      return connection.query(`SELECT u FROM zliu80_bacchanalia.pic ORDER BY rand() LIMIT 1`);
    }).then(rows => {
      url = rows[0]["u"];
      connection.query(`INSERT INTO drink (drinkname, category, alcohol, glass, num, likes, url)
                        VALUES ("${drinkname}", "${category}", "${alcohol}", "${glass}", "${num}", "${likes}", "${url}")`);
      let retStr="Drink created!"
      res.send({
        drinks: retStr
      });
      return next();
      }).catch(err=> {
      let retStr="Fail to create drink!";
      res.send({
        drinks: retStr
      });
      return next();
    });
  }
}
