# Markdown-server

Markdown-server 提供了Markdown的数学公式 `LaTex`，以及流程图`yUML`服务端渲染支持。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsbfkcel%2Fmarkdown-server)

## 如何使用

### 本地部署

1. 克隆仓库
```bash
git clone https://github.com/your-username/markdown-server.git
cd markdown-server
```

2. 安装依赖
```bash
npm install
```

3. 启动服务
```bash
npm start
```

4. 运行测试脚本（可选）
```bash
npm test
```

默认情况下，服务将在`8001`端口启动。如果需要修改端口，可以通过环境变量`PORT`指定：
```bash
PORT=3000 npm start
```
    
### Vercel一键部署

点击上方的「Deploy with Vercel」按钮，按照提示完成部署。

#### 部署注意事项

1. 本项目使用了`mathjax-node-sre`库来渲染LaTeX公式，确保Vercel部署时能够正确加载所有依赖。
2. 如果部署后遇到问题，可以在Vercel控制台查看日志信息。
3. 服务提供健康检查端点：`/health`或`/_health`，返回JSON格式的状态信息
4. 部署完成后，可以通过添加查询参数来测试服务：
   - LaTeX公式：`?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.`
   - yUML流程图：`?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))`
   - 健康检查：`/health`

#### 故障排除

如果在Vercel部署过程中遇到问题，可以使用以下方法进行故障排除：

1. 使用配置检查工具验证项目配置是否正确：
   ```bash
   npm run check-config
   ```

2. 使用调试工具检查环境和模块加载情况：
   ```bash
   npm run debug
   ```

3. 检查Vercel日志，特别关注与模块加载相关的错误信息。

4. 确保`vercel.json`文件中的`includeFiles`配置正确，以包含所有必要的依赖文件。

5. 如果遇到特定模块的加载问题，可以尝试在`.npmrc`文件中添加相关配置。

6. 如果遇到`mathjax`相关的错误，请确认：
   - 使用的是`mathjax-node-sre`而不是`mathjax-node`
   - 已正确配置MathJax（在`index.js`中）
   - Vercel环境中包含了所有必要的依赖文件

## 查看服务

可以通过以下示例用来查看服务是否正常。

- [（本地）LaTeX 数学公式](http://localhost:8001/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.)
- [（本地）yUML 流程图](http://localhost:8001/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))

---

- [（在线）LaTeX 数学公式](http://towxml.vvadd.com/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D.)
- [（在线）yUML 流程图](http://towxml.vvadd.com/?yuml=%2F%2F%20%7Btype%3Aactivity%7D%0A%2F%2F%20%7Bgenerate%3Atrue%7D%0A%0A(start)-%3E%3Ca%3E%5Bkettle%20empty%5D-%3E(Fill%20Kettle)-%3E%7Cb%7C%0A%3Ca%3E%5Bkettle%20full%5D-%3E%7Cb%7C-%3E(Boil%20Kettle)-%3E%7Cc%7C%0A%7Cb%7C-%3E(Add%20Tea%20Bag)-%3E(Add%20Milk)-%3E%7Cc%7C-%3E(Pour%20Water)%0A(Pour%20Water)-%3E(end))

## 修改服务端口

服务默认使用`8001`端口，您可以通过以下两种方式修改端口：

1. 使用环境变量（推荐）
```bash
PORT=3000 npm start
```

2. 编辑代码
修改`index.js`文件中的以下行：
```javascript
const PORT = process.env.PORT || 8001;
```
