require('dotenv').config();

const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { jwtMiddleware } = require('./lib/token');

const app = new Koa();
const router = new Router();
const api = require('./api');

const mongoose = require('mongoose');
const bodyParsrer = require('koa-bodyparser');

mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true
  }).then(
      (response) => {
          console.log('Successfully connected to mongodb');
      }
  ).catch(e => {
      console.error(e);
  });

const port = process.env.PORT || 4000;

router.use('/api', api.routes());

app.use(bodyParsrer());
app.use(jwtMiddleware);
router.use('/api', api.routes());
app.use(router.routes()).use(router.allowedMethods());

router.use('./api', api.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
    console.log('heurm server is listening to port ' + port);
});

//해시함수
const password = 'abc123';
const secret = 'MySecretKey1$1$234';

const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');

console.log(hashed);

//jwt token
const token = jwt.sign({ foo : 'bar' }, 'secret-key', { expiresIn: '7d' }, (err, token) => {
    //expiresIN:유효기간
    if(err) {
        console.log(err);
        return;
    }
    console.log(token);
});