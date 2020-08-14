const Koa = require('koa');
const app = new Koa();
const bodyParser = require('koa-bodyparser');
const isProduction = process.env.NODE_ENV === 'production';
const controller = require('./controller');
const templating = require('./templating');
const model = require('./model');
const cors = require('koa2-cors')

let
    User = model.User;

    // (async () => {
    //     var user = await User.create({
    //         userId:'0',
    //         name: 'John',
    //         gender: false,
    //         email: 'john-' + Date.now() + '@garfield.pet',
    //         passwd: 'hahaha'
    //     });
    //     console.log('created: ' + JSON.stringify(user));
    // })();
    
app.use(cors());
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});


if (! isProduction) {
    let staticFiles = require('./static-files');
    app.use(staticFiles('/static/', __dirname + '/static'));
}

app.use(bodyParser());

app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(controller());

app.listen(8888);

console.log('app started at port 8888...');