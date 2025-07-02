/**
 * 错误处理工具
 * 用于捕获和记录服务器错误
 */

const errorHandler = {
  /**
   * 记录错误信息
   * @param {Error} err - 错误对象
   * @param {string} context - 错误发生的上下文
   */
  logError: function(err, context) {
    console.error(`[${new Date().toISOString()}] Error in ${context}:`, err);
    if (err.stack) {
      console.error(err.stack);
    }
  },

  /**
   * 创建错误响应
   * @param {http.ServerResponse} res - HTTP响应对象
   * @param {string} message - 错误消息
   * @param {number} statusCode - HTTP状态码
   */
  sendErrorResponse: function(res, message, statusCode = 500) {
    res.writeHead(statusCode, {'Content-type': 'text/html;charset=utf-8'});
    res.write(`<html><body><h1>Error</h1><p>${message}</p></body></html>`);
    res.end();
  }
};

module.exports = errorHandler;