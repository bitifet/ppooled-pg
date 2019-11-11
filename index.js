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

function dePromise(f, self) {//{{{
    return Deasync(function() {
        const args = Array.prototype.slice.call(arguments);
        const cb = args.pop();

        f.apply(self, args)
            .then(x=>cb(null, x))
            .catch(e=>cb(e))
        ;
    });
};//}}}

function isSqltt(q) { // Duck-check for SQL Tagged Template{{{
    // ( https://www.npmjs.com/package/sqltt )
    return (
        q
        && (typeof q.sql == "function")
        && (typeof q.args == "function")
    );
};//}}}

module.exports = function newPooledPostgreSQL(cfg, defaults = {}) {

    const proto = cfg.protocol || "postgresql"; // Also accept "remote". See https://www.npmjs.com/package/pooled-pg#remote-connections

    Object.entries(defaults).map(([k, v])=>Pooled.defaults[k]=v)

    const connStr = proto+"://"
        + cfg.user
        + ":" + cfg.password
        + "@" + cfg.connect
    ;

    function promisedQuery(q, prm) {//{{{
        let sql;
        if (q instanceof Array && prm === undefined) {
            prm = q[1];
            q = q[0];
        };

        if (isSqltt(q)) {
            sql = q.sql("postgresql");
            prm = q.args(prm);
        } else {
            sql = q;
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
