const Koa = require('koa');
const app = new Koa();
const path = require('path');
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const gm = require('gm')
const cors = require('@koa/cors');
const PORT = process.env.PORT || 3000

const hanldeImage = (filePath) => {
  return new Promise((resolve, reject) => {
    gm(`./${filePath}`).size((err, size) => {
      if (!err) {
        resolve({
          width: size.width,
          height: size.height
        })
      } else {
        reject(err)
      }
    })
  })
}
app.use(cors())
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({
  multipart: true,
  formidable: {
    uploadDir: path.join(__dirname, 'public/uploads'),
    keepExtensions: true,
  },
}))
app.use(async (ctx, next) => {
  if (ctx.request.url === '/upload') {
    const file = ctx.request.files.post
    const basename = path.basename(file.path)
    const imageRes = await hanldeImage(`public/uploads/${basename}`)
    const height = imageRes.height
    const width = imageRes.width
    ctx.body = {
      url: `${ctx.origin}/uploads/${basename}`,
      width,
      height
    }
  } else {
    await next();
  }
});

app.listen(PORT, () => {
  console.log(`server is running at http://localhost:${PORT}`)
})
