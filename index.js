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

// Ensures Promise support available://{{{
try {
    if (Promise === undefined) throw "WTF!"; // Never get there...
} catch (e) {
    var Promise = require("promise");
};//}}}


module.exports = function newPooledPostgreSQL(cfg) {

    var ctype = cfg.type || "postgresql"; // Also accept "remote". See https://www.npmjs.com/package/pooled-pg#remote-connections


    var connStr = ctype+"://"
        + cfg.user
        + ":" + cfg.password
        + "@" + cfg.connect
    ;

    console.log ("connStr:", connStr);

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
