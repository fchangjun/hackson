// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = {
  devServer: {
    host: '0.0.0.0',
    proxy: {
      '/llm': {
        target: 'http://172.26.64.107:11434/', // 目标服务器地址
        changeOrigin: true, // 是否改变源
        pathRewrite: { '^/llm': '' }, // 重写路径，将 /api 替换为空字符串
        ws: true, // 是否支持 WebSocket
        secure: false, // 如果是 https 接口，需要配置这个参数
        logLevel: 'debug' // 用于调试代理时的日志输出
      },
      '/video': {
        target: 'http://172.26.64.107:8000', // 目标服务器地址
        changeOrigin: true, // 是否改变源
        pathRewrite: { '^/video': '' }, // 重写路径，将 /api 替换为空字符串
        ws: true, // 是否支持 WebSocket
        secure: false, // 如果是 https 接口，需要配置这个参数
        logLevel: 'debug' // 用于调试代理时的日志输出
      },
      '/image_to_text': {
        target: 'http://172.26.98.50:8000/', // 目标服务器地址
        changeOrigin: true, // 是否改变源
        secure: false, // 如果是 https 接口，需要配置这个参数
        logLevel: 'debug' // 用于调试代理时的日志输出
      },
      '/api': {
        target: 'https://design-test.now.baidu-int.com',
        changeOrigin: true, // 是否改变源
      }
    }
  }
};