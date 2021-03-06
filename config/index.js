'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {                            //dev环境

    // Paths
    assetsSubDirectory: 'static',   //编译输出的二级目录
    assetsPublicPath: '/',          //编译发布的根目录，可配置为资源服务器域名或CDN域名
    proxyTable: {                   //需要proxyTable代理的接口（可跨域）
      '/api': {
        target: "http://localhost:9091",
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined   开发服务器监听的特定端口
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true              //是否开启cssSourceMap
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'), //编译输入的index.html文件

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),   //编译输出的静态资源路径
    assetsSubDirectory: 'static',       //编译输出的二级目录
    assetsPublicPath: '/',              //编译发布的根目录

    /**
     * Source Maps
     */

    productionSourceMap: true,          //是否开启cssSourceMap
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,              //是否开启gzip
    productionGzipExtensions: ['js', 'css'],  //需要使用gzip压缩的文件扩展名

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
