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

export default class drinksearchController extends Controller {

	get prefix() {
		return 'drinksearch';
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
			param: String,
			searchby: String,
		})
	])

	@POST('')
	drinksearch(req, res, next) {
		let param = req.body.param;
		let searchby = req.body.searchby;
		let connection;
		if (searchby == 'drinkname') {
			db.then(conn => {
				connection = conn;
				return conn.query(`SELECT * FROM drink WHERE drinkname LIKE '%${param}%' LIMIT 8;`);
			}).then(rows => {
				for (let i = 0; i < 8; ++i) {
					if (i < rows.length) {
						rows[i]["featured"] = false;
					}
				}
				if (0 < rows.length) {
					rows[0]["featured"] = true;
				}
				if (3 < rows.length) {
					rows[3]["featured"] = true;
				}
				res.send({
					drinks: rows
				});
				return next();
			});
		} else {
			//to be added
			res.send({
				drinks: []
			});
			return next();
		}
	}
}
