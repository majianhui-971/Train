'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')  // 获取配置
const vueLoaderConfig = require('./vue-loader.conf')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {   // 配置webpack编译入口
    app: ["babel-polyfill", "./src/main.js"]
  },
  output: {   // 配置webpack输出路径和命名规则
    path: config.build.assetsRoot,  // webpack输出的目标文件夹路径（例如：/dist）
    filename: '[name].js',   // webpack输出bundle文件命名格式，基于文件的md5生成Hash名称的script来防止缓存
    publicPath: process.env.NODE_ENV === 'production'  // webpack编译输出的发布路径(判断是正式环境或者开发环境等)
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],   //自动解析确定的拓展名,使导入模块时不带拓展名
    alias: {        // 创建import或require的别名，一些常用的，路径长的都可以用别名
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/, // vue文件后缀
        loader: 'babel-loader',  //使用babel-loader处理
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        exclude: [resolve('src/icons')], // 存放 svg 文件夹
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.svg$/,
        use: [
          {loader: 'svg-sprite-loader', options: {
              symbolId: 'icon-[name]',
              name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
          },
          {loader: 'svgo-loader', options: {
              plugins: [
                { removeViewBox: false },
                { removeXMLNS: true }
              ]
            }
          }
        ],
        include: [resolve('src/icons')] // 存放 svg 文件夹
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
