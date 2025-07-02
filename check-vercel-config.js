/**
 * Vercel配置检查工具
 * 用于验证vercel.json和相关配置文件是否正确
 */

const fs = require('fs');
const path = require('path');

// 检查文件是否存在
const checkFileExists = (filePath) => {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  console.log(`${exists ? '✅' : '❌'} ${filePath} ${exists ? '存在' : '不存在'}`);
  return exists;
};

// 检查vercel.json配置
const checkVercelConfig = () => {
  console.log('\n=== 检查vercel.json配置 ===');
  const vercelConfigPath = path.join(__dirname, 'vercel.json');
  
  if (fs.existsSync(vercelConfigPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      console.log('✅ vercel.json 解析成功');
      
      // 检查版本
      if (config.version === 2) {
        console.log('✅ 版本配置正确 (version: 2)');
      } else {
        console.warn('⚠️ 版本配置可能有问题，推荐使用 version: 2');
      }
      
      // 检查构建配置
      if (config.builds && Array.isArray(config.builds)) {
        console.log('✅ builds 配置存在');
        
        const nodeBuild = config.builds.find(build => build.use === '@vercel/node');
        if (nodeBuild) {
          console.log('✅ @vercel/node 构建配置存在');
          
          if (nodeBuild.config && nodeBuild.config.includeFiles) {
            console.log('✅ includeFiles 配置存在');
            if (nodeBuild.config.includeFiles.includes('node_modules/**')) {
              console.log('✅ includeFiles 包含 node_modules/**');
            } else {
              console.warn('⚠️ includeFiles 不包含 node_modules/**，可能导致依赖加载问题');
            }
          } else {
            console.warn('⚠️ 缺少 includeFiles 配置，可能导致依赖加载问题');
          }
        } else {
          console.warn('⚠️ 缺少 @vercel/node 构建配置');
        }
      } else {
        console.warn('⚠️ 缺少 builds 配置');
      }
      
      // 检查路由配置
      if (config.routes && Array.isArray(config.routes)) {
        console.log('✅ routes 配置存在');
        
        const healthRoute = config.routes.find(route => 
          route.src === '/health' || route.src === '/_health'
        );
        if (healthRoute) {
          console.log('✅ 健康检查路由配置存在');
        } else {
          console.warn('⚠️ 缺少健康检查路由配置');
        }
        
        const catchAllRoute = config.routes.find(route => route.src === '/(.*)');
        if (catchAllRoute) {
          console.log('✅ 通配符路由配置存在');
        } else {
          console.warn('⚠️ 缺少通配符路由配置');
        }
      } else {
        console.warn('⚠️ 缺少 routes 配置');
      }
      
      // 检查环境变量配置
      if (config.env) {
        console.log('✅ env 配置存在');
        if (config.env.NODE_ENV) {
          console.log(`✅ NODE_ENV 设置为 ${config.env.NODE_ENV}`);
        } else {
          console.warn('⚠️ 缺少 NODE_ENV 环境变量配置');
        }
      } else {
        console.warn('⚠️ 缺少 env 配置');
      }
      
    } catch (error) {
      console.error('❌ vercel.json 解析失败:', error.message);
    }
  } else {
    console.error('❌ vercel.json 不存在');
  }
};

// 检查package.json配置
const checkPackageJson = () => {
  console.log('\n=== 检查package.json配置 ===');
  const packageJsonPath = path.join(__dirname, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      console.log('✅ package.json 解析成功');
      
      // 检查依赖
      if (packageJson.dependencies) {
        console.log('✅ dependencies 配置存在');
        
        if (packageJson.dependencies['mathjax-node-sre']) {
          console.log(`✅ mathjax-node-sre 版本: ${packageJson.dependencies['mathjax-node-sre']}`);
        } else {
          console.warn('⚠️ 缺少 mathjax-node-sre 依赖');
        }
        
        if (packageJson.dependencies['yuml2svg']) {
          console.log(`✅ yuml2svg 版本: ${packageJson.dependencies['yuml2svg']}`);
        } else {
          console.warn('⚠️ 缺少 yuml2svg 依赖');
        }
      } else {
        console.warn('⚠️ 缺少 dependencies 配置');
      }
      
      // 检查引擎配置
      if (packageJson.engines && packageJson.engines.node) {
        console.log(`✅ Node.js 版本要求: ${packageJson.engines.node}`);
      } else {
        console.warn('⚠️ 缺少 engines.node 配置，建议指定 Node.js 版本');
      }
      
      // 检查脚本
      if (packageJson.scripts) {
        console.log('✅ scripts 配置存在');
        
        if (packageJson.scripts.start) {
          console.log(`✅ start 脚本: ${packageJson.scripts.start}`);
        } else {
          console.warn('⚠️ 缺少 start 脚本');
        }
        
        if (packageJson.scripts.debug) {
          console.log(`✅ debug 脚本: ${packageJson.scripts.debug}`);
        } else {
          console.warn('⚠️ 缺少 debug 脚本');
        }
      } else {
        console.warn('⚠️ 缺少 scripts 配置');
      }
      
    } catch (error) {
      console.error('❌ package.json 解析失败:', error.message);
    }
  } else {
    console.error('❌ package.json 不存在');
  }
};

// 检查.npmrc配置
const checkNpmrc = () => {
  console.log('\n=== 检查.npmrc配置 ===');
  const npmrcPath = path.join(__dirname, '.npmrc');
  
  if (fs.existsSync(npmrcPath)) {
    try {
      const npmrc = fs.readFileSync(npmrcPath, 'utf8');
      console.log('✅ .npmrc 文件存在');
      
      if (npmrc.includes('legacy-peer-deps=true')) {
        console.log('✅ legacy-peer-deps 配置正确');
      } else {
        console.warn('⚠️ 缺少 legacy-peer-deps=true 配置');
      }
      
      if (npmrc.includes('node-linker=hoisted')) {
        console.log('✅ node-linker 配置正确');
      } else {
        console.warn('⚠️ 缺少 node-linker=hoisted 配置');
      }
      
    } catch (error) {
      console.error('❌ .npmrc 读取失败:', error.message);
    }
  } else {
    console.warn('⚠️ .npmrc 文件不存在，建议创建');
  }
};

// 检查必要文件
const checkRequiredFiles = () => {
  console.log('\n=== 检查必要文件 ===');
  
  checkFileExists('index.js');
  checkFileExists('package.json');
  checkFileExists('vercel.json');
  checkFileExists('.npmrc');
  checkFileExists('error-handler.js');
  checkFileExists('debug.js');
  checkFileExists('test.js');
};

// 运行所有检查
const runChecks = () => {
  console.log('🔍 开始Vercel配置检查...');
  
  checkRequiredFiles();
  checkVercelConfig();
  checkPackageJson();
  checkNpmrc();
  
  console.log('\n✅ 配置检查完成');
};

// 执行检查
runChecks();