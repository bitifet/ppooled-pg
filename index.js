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

const Pooled = require("pooled-pg");
const Promise = require("bluebird");
const Deasync = require("deasync");
const $args$ = Symbol.for("arguments");

function dePromise(f, self) {
    return Deasync(function() {
        const args = Array.prototype.slice.call(arguments);
        const cb = args.pop();

        f.apply(self, args)
            .then(x=>cb(null, x))
            .catch(e=>cb(e))
        ;
    });
};

module.exports = function newPooledPostgreSQL(cfg) {

    const proto = cfg.protocol || "postgresql"; // Also accept "remote". See https://www.npmjs.com/package/pooled-pg#remote-connections


    const connStr = proto+"://"
        + cfg.user
        + ":" + cfg.password
        + "@" + cfg.connect
    ;

    function promisedQuery(sql, prm) {//{{{
        if (sql instanceof Array && prm === undefined) {
            prm = sql[1];
            sql = sql[0];
        };
        prm || (prm = []);

        // Accept named arguments if SQL has arguments symbol defined.
        if (! (prm instanceof Array)) {
            const argNames = sql[$args$];
            const newPrm = [];
            if (! (argNames instanceof Array)) throw "Query doesn't accept named arguments.";
            for (let i=0; i<argNames.length; i++) {
                let value = prm[argNames[i]];
                newPrm.push(value === undefined ? null : value);
            };
            prm = newPrm;
        };

        return new Promise (function(resolve, reject){
            Pooled.connect(connStr, function(error, client, done) {
                client.query(String(sql), prm, function(error, result) {
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
        return promisedQuery(sql,prm)
            .then(data => data.rows)
        ;
    };//}}}

    return {
        query: promisedQuery,
        queryRows: promisedQueryRows,
        querySync: dePromise(promisedQuery),
        queryRowsSync: dePromise(promisedQueryRows),
    };

};
