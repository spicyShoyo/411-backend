/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const {
	POST
} = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');

export default class addingredientController extends Controller {

	get prefix() {
		return 'addingredient';
	}

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
		let ingredientname = req.body.ingredientname;
		let connection;
		db.then(conn => {
			connection = conn;
			return connection.query(`INSERT INTO ingredientof (drinkname, ingredientname) VALUES ('${drinkname}', '${ingredientname}')`);
		}).then(rows => {
			let retStr=`Awesome! Drink created successfully!`;
			res.send({
				drinks: retStr,
			});
			return next();
		}).catch(err=> {
			let retStr=`Fail to create drink!`;
			res.send({
				drinks: retStr
			});
			return next();
		});
	}
}
