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
        let drinktyped = req.body.drinktyped;
        let connection;
        db.then(conn => {
            connection = conn;
            return conn.query(`SELECT * FROM drink ORDER BY likes DESC LIMIT 16;`);
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
            return next();
        });
    }
}
