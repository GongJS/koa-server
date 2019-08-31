const Koa = require('koa');
const app = new Koa();
const path = require('path');
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const gm = require('gm')
const cors = require('koa2-cors');
const PORT = process.env.PORT || 3000

app.use(cors({ origin: '*' }))
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true,
  },
}))
app.use(async (ctx, next) => {
  if (ctx.request.path === '/upload') {
    const file = ctx.request.files.file
    const basename = path.basename(file.path)
    gm(`./public/uploads/${basename}`)
      .size(function (err, size) {
        if (!err) {
          console.log('width = ' + size.width);
          console.log('height = ' + size.height);
        }
      });
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`,
      width: size.width,
      height: size.height
    }
  } else {
    await next();
  }
});

app.listen(PORT, () => {
  console.log('server is running at http://localhost:3000')
})