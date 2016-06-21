ppooled-pg
==========

> Promisified PostgreSQL driver with more effective pooling strategies.


<a name="Brief"></a>Brief
-------------------------


This is simply a personal promise wrapper for wonderful but non promise aware PostgreSQL driver [pooled-pg](https://www.npmjs.com/package/pooled-pg).

This is not intended, at least nowadays, to be a complete full-featured tool. This only has methods I found handy for my own purposes.

But push requests are welcome if anyone is interested in improving it.


<a name="Setup">Setup</a>
-------------------------


    npm install ppooled-pg


<a name="Expample"></a>
-----------------------


```javascript

    var pPooled = require("pooled-pg");

    // If your node.js version doesn't support promises natively, you probably
    // should execute "npm install promise" and comment out following row:
    // var Promise = require("promise");
    
    var ppg = pPooled({
        type: "postgresql", // "postgresql" (default) or "remote".
                            // See https://www.npmjs.com/package/pooled-pg#advanced-usage-remote-mode
        user: "db_user_name",
        password: "db_user_password",
        connect: "db_user_connect_string",
            // See pooled-pg documenetation for more details on connect string:
            // https://www.npmjs.com/package/pooled-pg
    });


    // ========
    // Methods:
    // ========


    // query(sql, args):
    // -----------------

    var q = ppg.query(sql, args);

    q.then(function(result){
        console.log(result);
        // result.rows = Actual result data.
    });
        
    q.catch(function(err){
        console.error(err);
        // Some error happened.
    });

    // queryRows(sql, args):
    // ---------------------

    var q = ppg.queryRows(sql, args);

    q.then(function(result){
        console.log(result);
        // result = Actual result data.
    });
        
    q.catch(function(err){
        //...
    });
    


``````



<a name="contributing"></a>Contributing
---------------------------------------

If you are interested in contributing with this project, you can do it in many ways:

  * Creating and/or mantainig documentation.

  * Implementing new features or improving code implementation.

  * Reporting bugs and/or fixing it.
  
  * Sending me any other feedback.

  * Whatever you like...
    
Please, contact-me, open issues or send pull-requests thought [this project GIT repository](https://github.com/bitifet/ppooled-pg)

