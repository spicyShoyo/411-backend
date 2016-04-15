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

export default class createdrinkController extends Controller {

	get prefix() {
		return 'createdrink';
	}

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
			username: String,
		})
	])

	@POST('')
	drinksearch(req, res, next) {
		let username = req.body.username;
		let connection;
		db.then(conn => {
			connection = conn;
			return conn.query(`SELECT drinkname FROM likedrink WHERE username = "${username}" ORDER BY RAND() LIMIT 1;`);
		}).then(rows => {
			let drinkname = rows[0]["drinkname"];
			return connection.query(`SELECT drinkname FROM clustering WHERE clustercenter IN 
									 (SELECT clustercenter FROM clustering WHERE drinkname LIKE "%${drinkname}%")
									 ORDER BY RAND() LIMIT 2;`);
		}).then(rows => {
			let drinkname0 = rows[0]["drinkname"];
			let drinkname1 = rows[1]["drinkname"];
			return connection.query(`SELECT ingredientname, amount, unit FROM ingredientof 
									 WHERE drinkname = "${drinkname0}" OR drinkname = "${drinkname0}";`);
		}).then(rows => {
			res.send({
				ingredients: rows
			});
		}).catch(err => {
			req.log.error(err);
			return next(new Errors.InternalServerError());
		});
	}
}
