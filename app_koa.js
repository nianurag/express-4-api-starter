var koa = require('koa');
var cluster = require('cluster');
var numCPUs = require('os').cpus().length;
var bodyParser = require('koa-bodyparser');
var router = require('koa-router')();

var config = require('./conf.json');

var knex = require('knex')({
    client: 'pg',
    connection: config.dbConnection
});

var bookshelf = require('bookshelf')(knex);
var GzUser = bookshelf.Model.extend({ tableName : 'gz_users'});

//if (cluster.isMaster) {
//    for (var i = 0; i < numCPUs; i++) {
//        cluster.fork();
//    }
//
//    cluster.on('exit', (worker, code, signal) => {
//        console.log("worker ${worker.process.pid} died");
//        cluster.fork();
//    });
//}
//else {
var app = express();
app.use(bodyParser());
app
    .use(router.routes())
    .use(router.allowedMethods());

router.get("/gz_user/:id", function *(next) {
    var bookshelf = require('bookshelf')(knex);
    var gzId = req.params.id;

    new GzUser({ id: gzId })
        .fetch()
        .then(gz_user => res.send(gz_user.toJSON()))
        .catch(err => res.statusCode(500));
});

app.post("/gz_user", function {
    var gzUser = req.body;
    new GzUser(gzUser)
        .save()
        .then(gzUserSaved => res.send(gzUserSaved))
        .catch(err => res.statusCode(500));
});
app.listen(3000);
//}
