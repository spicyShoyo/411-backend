
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
    let likes = 0;
    let ingredientname = req.body.ingredientname;
    let connection;
    db.then(conn => {
        connection = conn;
        let url = connection.query(`SELECT u FROM pic ORDER BY RANDOM() LIMIT 1`);
        connection.query(`INSERT INTO ingredientof (drinkname, ingredientname) VALUES ('${drinkname}', '${ingredientname}')`);
        connection.query(`INSERT INTO drink (drinkname, category, alcohol, glass, likes, url)
                          VALUES ('${drinkname}', '${category}', '${alcohol}', '${glass}', '${likes}', '${url}')`);
        return next();
      });
  }
}
