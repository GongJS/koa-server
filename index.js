const Koa = require('koa');
const app = new Koa();
const path = require('path');
const axios = require('axios');
const koaStatic = require('koa-static')
const multipart = require('koa-multipart');
const koaBody = require('koa-body')
const cors = require('@koa/cors');
const PORT = process.env.PORT || 5000

const baseH5URL = 'http://1.116.156.44:8082';

app.use(cors())
app.use(multipart())
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public/uploads'),
    keepExtensions: true,
  },
}))
app.use(async (ctx, next) => {
  if (ctx.request.url.includes('/p/')) {
    const res = await axios.get(`${baseH5URL}${ctx.request.url}`)
    ctx.body = res.data
    await next();
  } else {
    ctx.body = 'not found'
  }  
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`)
})
