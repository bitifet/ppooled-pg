// ppooled-pg - index.js
// =========================================
// Promisified PostgreSQL driver with more effective pooling strategies.
//
// Simply a personal promise wrapper for https://www.npmjs.com/package/pooled-pg
//
// @author: Joan Miquel Torres <jmtorres@112ib.com>
// @company: GEIBSAU
// @license: GPL
//
"use strict";

var Pooled = require("pooled-pg");
var Promise = require("bluebird");

module.exports = function newPooledPostgreSQL(cfg) {

    var proto = cfg.protocol || "postgresql"; // Also accept "remote". See https://www.npmjs.com/package/pooled-pg#remote-connections


    var connStr = proto+"://"
        + cfg.user
        + ":" + cfg.password
        + "@" + cfg.connect
    ;

    function promisedQuery(sql, prm) {//{{{
        if (sql instanceof Array && prm === undefined) {
            prm = sql[1];
            sql = sql[0];
        };
        return new Promise (function(resolve, reject){
            Pooled.connect(connStr, function(error, client, done) {
                client.query(sql, prm, function(error, result) {
                    done();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    };
                });
            });

        });
    };//}}}

    function promisedQueryRows(sql, prm) {//{{{
        return new Promise (function(resolve, reject) {
            promisedQuery(sql,prm)
                .then(function(data){
                    resolve(data.rows);
                })
                .catch(reject)
            ;
        });
    };//}}}

    return {
        query: promisedQuery,
        queryRows: promisedQueryRows
    };

};
