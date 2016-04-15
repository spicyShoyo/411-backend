/**
 * Created by @tourbillon on 3/8/16.
 */

const Controller = require('./../controller');
const {
    GET
} = require('./../http-methods');
const UseMiddleware = require('./../use-middleware');
const requireParams = require('./../middleware/require-params');
const db = require('./../database');
const Errors = require('restify-errors');
const uuid = require('node-uuid');

export default class randomController extends Controller {

    get prefix() {
        return 'random';
    }

    /**
     * @api {post} /v1/drinktyped Drinktyped
     * @apiName Drinktyped
     * @apiGroup Drinktyped
     *
     * @apiParam none
     *
     * @apiSuccess {String} drinks drinks with name start with the drinktyped.
     *
     */
    @GET('')
    drinktyped(req, res, next) {
        let connection;
        db.then(conn => {
            connection = conn;
            return conn.query(`SELECT url FROM drink ORDER BY RAND() LIMIT 1;`);
        }).then(rows => {
            rows[0]["featured"]=true;
            res.send({
                url: rows
            });
        }).catch(err => {
            req.log.error(err);
            return next(new Errors.InternalServerError());
        });
    }
}
