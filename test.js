/**
 * 简单的测试脚本，用于验证服务是否正常工作
 */

const http = require('http');
const url = require('url');

// 测试LaTeX公式
const testLatex = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8001,
      path: '/?tex=x%20%3D%20%7B-b%20%5Cpm%20%5Csqrt%7Bb%5E2-4ac%7D%20%5Cover%202a%7D',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ LaTeX测试通过');
          resolve(true);
        } else {
          console.error('❌ LaTeX测试失败:', res.statusCode);
          reject(new Error(`LaTeX测试失败: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ LaTeX测试请求错误:', e.message);
      reject(e);
    });

    req.end();
  });
};

// 测试yUML图表
const testYuml = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8001,
      path: '/?yuml=(start)-%3E(end)',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ yUML测试通过');
          resolve(true);
        } else {
          console.error('❌ yUML测试失败:', res.statusCode);
          reject(new Error(`yUML测试失败: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ yUML测试请求错误:', e.message);
      reject(e);
    });

    req.end();
  });
};

// 测试健康检查
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 8001,
      path: '/health',
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('✅ 健康检查测试通过');
          resolve(true);
        } else {
          console.error('❌ 健康检查测试失败:', res.statusCode);
          reject(new Error(`健康检查测试失败: ${res.statusCode}`));
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ 健康检查测试请求错误:', e.message);
      reject(e);
    });

    req.end();
  });
};

// 运行所有测试
const runTests = async () => {
  console.log('🔍 开始测试...');
  try {
    await testHealth();
    await testLatex();
    await testYuml();
    console.log('✅ 所有测试通过！服务正常工作。');
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
    process.exit(1);
  }
};

// 等待服务启动
console.log('⏳ 等待服务启动...');
setTimeout(runTests, 2000);