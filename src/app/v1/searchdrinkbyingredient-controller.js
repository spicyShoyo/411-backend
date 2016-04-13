
const Controller = require('./../controller');
const {
	POST
} = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');
const q = require('q');

export default class searchdrinkbyingredientController extends Controller {

	get prefix() {
		return 'searchdrinkbyingredient';
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
			ingredientnames: [String],
		})
	])

	@POST('')
	drinksearch(req, res, next) {
		let ingredientnames = req.body.ingredientnames;
		let connection;
		let drinknames = []

		var promiseArr = [];
		for (let i=0; i<ingredientnames.length; i++) {
			for (let j=i+1; j<ingredientnames.length; j++) {
				for (let k=j+1; k<ingredientnames.length; k++) {
					promiseArr.push(
						db.then(conn => {
							return conn.query(`SELECT DISTINCT drinkname FROM ingredientof 
											   WHERE ingredientname LIKE "%${ingredientnames[i]}%" AND drinkname = ANY 
											   (SELECT drinkname FROM ingredientof WHERE ingredientname LIKE "%${ingredientnames[j]}%")
											   AND drinkname = ANY 
											   (SELECT drinkname FROM ingredientof WHERE ingredientname LIKE "%${ingredientnames[k]}%") LIMIT 8;`);
							}).then(rows => drinknames.push(rows))
							.catch(err => console.log(err))
						)
					}
				}
			}

			q.all(promiseArr).then(function(){
				let result = [];
				drinknames.forEach(arr => {
					let arrrr = [];
					if (arr.length !== 1 || arr[0].drinkname !== 'undefined') {
						arr.forEach(d => {
							if (d.drinkname !== 'undefined')
								arrrr.push(d);
						})
					}
					if (arrrr.length !== 0)
						result.push(arrrr);
				})


				if (result.length>0) {
					res.send({
						drinknames: result
					});
				}
				else {
					return next(new Errors.NotFoundError("Drinkname not found!"));
				}
			})
		}
	}
