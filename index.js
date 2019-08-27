const Koa = require('koa');
const app = new Koa();
const path = require('path');
const koaStatic = require('koa-static')
const koaBody = require('koa-body')
const PORT = process.env.PORT || 3000

app.use(cors({origin: 'https://gongjs.github.io/'}))
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(koaBody({
  multipart:true,
  formidable: {
    uploadDir: path.join(__dirname,'/public/uploads'),
    keepExtensions:true
  }
}))
app.use(async (ctx, next) => {
    if (ctx.request.path === '/upload') {
      const file = ctx.request.files.file
      const basename = path.basename(file.path)
      ctx.body= {
        url: `${ctx.origin}/uploads/${basename}`
      }
    } else {
        await next();
    }
});

app.listen(PORT, ()=>{
  console.log('server is running at http://localhost:3000')
})