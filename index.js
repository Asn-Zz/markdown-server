const http = require("http"),
    url = require('url'),
    qs = require('querystring'),
    mathjax = require("mathjax-node-sre"),
    yuml2svg = require('yuml2svg'),
    errorHandler = require('./error-handler');

// 配置mathjax-node-sre
mathjax.config({
  MathJax: {
    loader: {
      load: ['input/tex', 'output/svg']
    },
    SVG: {
      font: "TeX"
    }
  }
});

mathjax.start();

const app = http.createServer((req,res)=>{
    try {
        // 解析URL和路径
        const parsedUrl = url.parse(req.url);
        const pathname = parsedUrl.pathname;
        
        // 健康检查路由
        if (pathname === '/health' || pathname === '/_health') {
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify({ status: 'ok', version: require('./package.json').version }));
            return;
        }
        
        let queryObj = qs.parse(parsedUrl.query),
            tex = queryObj.tex,
            yuml = queryObj.yuml,
            theme = queryObj.theme,
            errFn = (msg)=>{
                errorHandler.sendErrorResponse(res, msg, 404);
            },
            successFn = (result)=>{
                res.writeHead(200,{'Content-type':'image/svg+xml;charset=utf-8'});
                res.write(result);
                res.end();
            };
    
    
        if(yuml){
            yuml2svg(yuml,{isDark:theme === 'dark'}).then(v => {
                successFn(v);
            }).catch(e => {
                errorHandler.logError(e, 'yuml2svg');
                errFn('Yuml formula is wrong!');
            });
        }else if(tex){
            mathjax.typeset({
                math:tex,
                format:'TeX',
                svg:true
            },data => {
                if(data.errors) {
                    errorHandler.logError(new Error(data.errors.join(', ')), 'mathjax');
                    errFn('LaTeX formula is wrong!');
                    return;
                }
                if(theme === 'dark'){
                    data.svg = data.svg.replace(/fill="currentColor"/g,'fill="#ffffff"');
                };
                successFn(data.svg);
            })
        }else{
            // 请通过`tex`参数传入LaTeX公式，或使用`yuml`参数传入`yuml`表达式。
            errFn('Please pass LaTeX formula via `tex` parameter or `Yuml` expression using `yuml` parameter.');
        }
    } catch (error) {
        errorHandler.logError(error, 'server');
        errorHandler.sendErrorResponse(res, 'Internal Server Error', 500);
    }
});
const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});