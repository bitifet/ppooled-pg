ppooled-pg
==========

> Promisified PostgreSQL driver with more effective pooling strategies.


Brief
-----


This is simply a personal promise wrapper for wonderful but non promise aware
PostgreSQL driver [pooled-pg](https://www.npmjs.com/package/pooled-pg).

This is not intended, at least nowadays, to be a complete full-featured tool.
This only has methods I found handy for my own purposes.

But push requests are welcome if anyone is interested in improving it.


Setup
-----

```sh
    npm install ppooled-pg
```


Usage
-----


### Instantiation

```javascript

var pPooled = require("ppooled-pg");

var ppg = pPooled({
    protocol: "postgresql", // "postgresql" (default) or "remote".
                        // See https://www.npmjs.com/package/pooled-pg#advanced-usage-remote-mode
    user: "db_user_name",
    password: "db_user_password",
    connect: "db_user_connect_string",
        // See pooled-pg documenetation for more details on connect string:
        // https://www.npmjs.com/package/pooled-pg
});

```


### Promisified methods


#### query(sql, args)

Simple wrapper to pooled-pg query method.

```javascript
var q = ppg.query(sql, args);

q.then(function(result){
    console.log(result);
    // result.rows = Actual result data.
}.catch(function(err){
    console.error(err);
    // Some error happened.
});
```


#### queryRows(sql, args)

Like `query()` but strip out all metadata retuning just resulting rows (more
handy if you don't care about other stuff).

```javascript
var q = ppg.queryRows(sql, args);

q.then(function(result){
    console.log(result);
    // result = Actual result data.
}.catch(function(err){
    console.error(err);
    // Some error happened.
});
```

### Synchronous methods

Synchronous methods works just the same as its promisified counterparts (in
fact they are just wrappers over them) but returns data syncronously instead of
as promise.

>
It may seem weird having synchronous methods in a promise library. But
sometimes is Ok to read some data synchronously. Specially at startup, when is
so common having to read common parameters that are needed for almost all the
rest of the process.
>
Having synchronous methods saves us to be forced to install another PostgresSQL
library to do just that and, most importantly, dealing with different syntax
and / or outcome formatting.
>

### querySync(sql, args):

```javascript
try {
    console.log(ppg.querySync(sql, args));
} catch (err) {
    console.error(err);
    // Some error happened.
};
```

### queryRowsSync(sql, args):

```javascript
try {
    console.log(ppg.queryRowsSync(sql, args));
} catch (err) {
    console.error(err);
    // Some error happened.
};
```



Contributing
------------

If you are interested in contributing with this project, you can do it in many ways:

  * Creating and/or mantainig documentation.

  * Implementing new features or improving code implementation.

  * Reporting bugs and/or fixing it.
  
  * Sending me any other feedback.

  * Whatever you like...
    
Please, contact-me, open issues or send pull-requests thought [this project GIT repository](https://github.com/bitifet/ppooled-pg)

