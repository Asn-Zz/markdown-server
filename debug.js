/**
 * Vercel部署调试工具
 * 用于检查环境变量和模块加载情况
 */

const fs = require('fs');
const path = require('path');

// 检查环境变量
const checkEnvironment = () => {
  console.log('\n=== 环境变量 ===');
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`PORT: ${process.env.PORT}`);
  console.log(`VERCEL: ${process.env.VERCEL}`);
  console.log(`VERCEL_ENV: ${process.env.VERCEL_ENV}`);
  console.log(`VERCEL_URL: ${process.env.VERCEL_URL}`);
  console.log(`VERCEL_REGION: ${process.env.VERCEL_REGION}`);
};

// 检查MathJax模块
const checkMathJax = () => {
  console.log('\n=== MathJax模块检查 ===');
  try {
    const mathjax = require('mathjax-node-sre');
    console.log('✅ mathjax-node-sre 模块加载成功');
    
    // 检查MathJax配置
    console.log('\n=== MathJax配置 ===');
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
    console.log('✅ MathJax配置成功');
    
    // 启动MathJax
    mathjax.start();
    console.log('✅ MathJax启动成功');
    
    // 测试简单公式
    console.log('\n=== 测试MathJax渲染 ===');
    mathjax.typeset({
      math: 'x = 1',
      format: 'TeX',
      svg: true
    }, (data) => {
      if (data.errors) {
        console.error('❌ MathJax渲染失败:', data.errors);
      } else {
        console.log('✅ MathJax渲染成功');
        console.log('SVG输出长度:', data.svg.length);
      }
    });
  } catch (error) {
    console.error('❌ mathjax-node-sre 模块加载失败:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
};

// 检查yuml2svg模块
const checkYuml = () => {
  console.log('\n=== yuml2svg模块检查 ===');
  try {
    const yuml2svg = require('yuml2svg');
    console.log('✅ yuml2svg 模块加载成功');
    
    // 测试简单图表
    console.log('\n=== 测试yuml2svg渲染 ===');
    yuml2svg('(start)->(end)', {}).then(svg => {
      console.log('✅ yuml2svg渲染成功');
      console.log('SVG输出长度:', svg.length);
    }).catch(error => {
      console.error('❌ yuml2svg渲染失败:', error.message);
    });
  } catch (error) {
    console.error('❌ yuml2svg 模块加载失败:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
  }
};

// 检查node_modules目录
const checkNodeModules = () => {
  console.log('\n=== node_modules检查 ===');
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules目录存在');
    
    // 检查mathjax-node-sre目录
    const mathjaxPath = path.join(nodeModulesPath, 'mathjax-node-sre');
    if (fs.existsSync(mathjaxPath)) {
      console.log('✅ mathjax-node-sre目录存在');
      
      // 列出mathjax-node-sre目录内容
      try {
        const files = fs.readdirSync(mathjaxPath);
        console.log('mathjax-node-sre目录内容:', files);
      } catch (error) {
        console.error('❌ 无法读取mathjax-node-sre目录:', error.message);
      }
    } else {
      console.error('❌ mathjax-node-sre目录不存在');
    }
    
    // 检查yuml2svg目录
    const yumlPath = path.join(nodeModulesPath, 'yuml2svg');
    if (fs.existsSync(yumlPath)) {
      console.log('✅ yuml2svg目录存在');
    } else {
      console.error('❌ yuml2svg目录不存在');
    }
  } else {
    console.error('❌ node_modules目录不存在');
  }
};

// 运行所有检查
const runDiagnostics = async () => {
  console.log('🔍 开始Vercel部署诊断...');
  console.log('当前工作目录:', __dirname);
  
  checkEnvironment();
  checkNodeModules();
  checkMathJax();
  checkYuml();
  
  console.log('\n✅ 诊断完成');
};

// 执行诊断
runDiagnostics();