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
const q = require('q');

export default class recommendationController extends Controller {

	get prefix() {
		return 'recommendation';
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
			drinkname: String,
		})
	])

	@POST('')
	drinksearch(req, res, next) {
		let username = req.body.username;
		let drinkname = req.body.drinkname;
		let connection;
		db.then(conn => {
			connection = conn;
			return conn.query(`SELECT DISTINCT d.* FROM clustering c, drink d WHERE c.clustercenter IN
							   (SELECT clustercenter FROM clustering WHERE drinkname = "${drinkname}") 
							   AND c.drinkname <> "${drinkname}" AND c.drinkname NOT IN
							   (SELECT DISTINCT drinkname FROM likedrink WHERE username = "${username}")
							   AND c.drinkname = d.drinkname;`);
		}).then(rows => {
			return Promise.all(rows.map(arr => {
				let sub_query_drinkname = arr["drinkname"];
				return db.then(
					conn => connection.query(`SELECT COUNT(*) FROM ingredientof 
											  WHERE drinkname = "${sub_query_drinkname}" AND ingredientname IN
											  (SELECT ingredientname FROM ingredientof WHERE drinkname = "${drinkname}");`))
					.then(row => [arr, row[0]["COUNT(*)"]]);
			}));
        }).then(result => {
        	result.sort(function(a, b){
        		return b[1]-a[1];
        	})
        	result = result.slice(0, 16).map(arr => {
        		return arr[0]
        	});
        	for (let i = 0; i < 16; ++i)
        		result[i]["featured"]=false;
        	res.send({
        		drinks: result
        	});
        }).catch(err => {
        	req.log.error(err);
        	return next(new Errors.InternalServerError());
        });
	}
}
