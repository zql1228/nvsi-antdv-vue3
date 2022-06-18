const TerserPlugin = require('terser-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const productionGzipExtensions = ['js', 'css']
const webpack = require('webpack')

const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir)
}

const createProxy = (obj) => {
  const ret = {}
  const httpsRE = /^https:\/\//

  if (obj) {
    obj = JSON.parse(obj)
    for (const prefix in obj) {
      const target = obj[prefix]
      const isHttps = httpsRE.test(target)

      ret[prefix] = {
        target: target,
        changeOrigin: true,
        ws: true,
        pathRewrite: (path) => path.replace(new RegExp(`^${prefix}`), ''),
        // https is require secure=false
        ...(isHttps ? { secure: false } : {}),
      }
    }
  }
  console.log(ret)
  return ret
}

// 生产环境配置cdn注入
const cdn = {
  // 忽略打包的第三方库
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    echarts: 'echarts',
  },
  // 通过cdn方式使用
  js: [
    '/volunteer/js/esm/echarts.esm.min_5.1.2.js',
    '/volunteer/js/esm/vue.esm-browser.prod.min_3.2.26.js',
    '/volunteer/js/esm/vue-router.esm-bundler.min_4.0.0.js',
    '/volunteer/js/esm/vuex.esm-browser.prod.min_4.0.0.js',
  ],
}
module.exports = {
  //如果在服务器部署的时候需要添加上下文，则这里需要配置该上下文，用于打包时添加依赖关系
  publicPath: process.env.VUE_PUBLIC_PATH,
  outputDir: 'volunteer',
  lintOnSave: false,
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].title = '全国志愿服务信息系统'
      // 配置cdn引入
      // args[0].cdn = cdn
      return args
    })
    // 忽略打包配置
    // config.externals = cdn.externals

    // 删除预加载
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')

    config.resolve.alias.set('@', resolve('src'))

    // 压缩图片
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        bypassOnDebug: true,
        mozjpeg: { progressive: true, quality: 50 }, // 压缩JPEG图像
        optipng: { enabled: true }, // 压缩PNG图像
        pngquant: { quality: [0.5, 0.65], speed: 4 }, // 压缩PNG图像
        gifsicle: { interlaced: false }, // 压缩GIF图像
      })
      .end()

    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all',
      maxInitialRequests: Infinity,
      minSize: 10000,
      cacheGroups: {
        // 第三方组件
        libs: {
          // 指定chunks名称
          name: 'chunk-libs',
          //符合组的要求就给构建venders
          test: /[\\/]node_modules[\\/]/,
          //priority:优先级：数字越大优先级越高，因为默认值为0，所以自定义的一般是负数形式,决定cacheGroups中相同条件下每个组执行的优先顺序。
          priority: 10,
          // 仅限于最初依赖的第三方
          chunks: 'initial',
        },
        // antd: {
        //   // 将antd拆分为单个包
        //   name: 'chunk-antd',
        //   // 重量需要大于libs和app，否则将打包到libs或app中
        //   priority: 20,
        //   // 为了适应cnpm
        //   test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/,
        // },
        // //公共组件
        // commons: {
        //   name: 'chunk-commons',
        //   test: resolve('src/components'),
        //   minChunks: 3,
        //   priority: 30,
        //   //这个的作用是当前的chunk如果包含了从main里面分离出来的模块，则重用这个模块，这样的问题是会影响chunk的名称。
        //   reuseExistingChunk: true,
        //   //最大初始化加载次数，一个入口文件可以并行加载的最大文件数量，默认3
        //   maxInitialRequests: 3,
        //   //表示在分离前的最小模块大小，默认为0，最小为30000
        //   minSize: 0,
        // },
        // utils: {
        //   // split utils libs
        //   name: 'chunk-utils',
        //   test: resolve('src/utils'),
        //   priority: 70,
        //   chunks: 'async',
        //   reuseExistingChunk: true,
        // },
        // 下边这个一加上样式就挂了
        // vendor: {
        //   test: /[\\/]node_modules[\\/]/,
        //   name(module) {
        //     const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
        //     return `npm.${packageName.replace('@', '')}`
        //   },
        //   priority: 20,
        // },
      },
    })
  },
  productionSourceMap: false,
  devServer: {
    /* 自动打开浏览器 */
    open: process.env.VUE_APP_AUTO_OPEN,
    https: false,
    hotOnly: false,
    /* 使用代理 */
    proxy: createProxy(process.env.VUE_PROXY),
    before: () => {},
  },
  css: {
    // requireModuleExtension:false,
    loaderOptions: {
      less: {
        // lessOptions: {
        modifyVars: {
          // 定制主题
          'primary-color': '#D92F2F', // 全局主题色
          'link-color': '#D92F2F', // 链接色
          // // 菜单menu色
          'menu-bg': 'rgba(217, 47, 47, 0)', // 菜单背景色
          // 'menu-item-color': 'rgba(255,255,255,.6)', // 菜单-每个item的字体颜色
          // 'menu-highlight-color': '#fff', // 选中item后的字体色
          // 'menu-inline-submenu-bg': 'rgba(217, 47, 47, 0)', //子 菜单的背景色
          // 'menu-item-active-bg': 'rgba(217, 47, 47, 0)', // 被选中的item的背景色
          // 'menu-item-font-size': '16px',
          'menu-item-height': '40px !important',
        },
        javascriptEnabled: true,
        // },
      },
    },
  },
  configureWebpack: (config) => {
    // console.log('process.env.NODE_ENV: ', process.env.NODE_ENV)

    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
      // 打包文件大小配置
      config.performance = {
        maxEntrypointSize: 10000000,
        maxAssetSize: 3000000,
      }
      config.plugins.push(
        new TerserPlugin({
          // 去除console.log ,警告,
          terserOptions: {
            compress: {
              warnings: false,
              drop_console: false,

              pure_funcs: ['console.log'],
            },
          },
        }),
        new CompressionWebpackPlugin({
          // 压缩代码
          algorithm: 'gzip', //压缩算法/功能
          test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //包括所有通过测试断言的资产 //test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          minRatio: 0.7, //压缩比
          deleteOriginalAssets: false, // true 不删除源文件 false 删除源文件
        }),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 5,
          minChunkSize: 100,
        })
      )
    } else {
      // 为开发环境修改配置...
    }
  },
}

/*
  * @ 这个是使用image-webpack-loader 参考配置
  config.module
      .rule('images')
      // .exclude.add(resolve('src/assets/icons')) // 排除icons目录，这些图标已用 svg-sprite-loader 处理，打包成 svg-sprite 了
      .end()
      .use('url-loader')
      .tap((options) => ({
        limit: 10240, // 稍微改大了点
        fallback: {
          loader: require.resolve('file-loader'),
          options: {
            // 在这里修改file-loader的配置
            // 直接把outputPath的目录加上，虽然语义没分开清晰但比较简洁
            // name: 'static/img/[name].[hash:8].[ext]',
            esModule: false, //低版本默认为false，高版本默认为true 这里为6.2.0为高本版本所以要手动设置为false
          },
        },
      }))
      .end()
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 50 }, // 压缩JPEG图像
        optipng: { enabled: true }, // 压缩PNG图像
        pngquant: { quality: [0.5, 0.65], speed: 4 }, // 压缩PNG图像
        gifsicle: { interlaced: false }, // 压缩GIF图像
      })
      .end()
      .enforce('post') // 表示先执行配置在下面那个loader，即image-webpack-loader
  */

/*
    * @
     // 开启js分离
     optimization: {
      runtimeChunk: 'single',
      splitChunks: {
        chunks: 'all',
        maxInitialRequests: Infinity,
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name (module) {
              // get the name. E.g. node_modules/packageName/not/this/part.js
              // or node_modules/packageName
              const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
              // npm package names are URL-safe, but some servers don't like @ symbols
              return `npm.${packageName.replace('@', '')}`
            }
          }
        }
      }
    }
*/
