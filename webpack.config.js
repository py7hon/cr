const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { getIfUtils, removeEmpty } = require('webpack-config-utils')
const { ifProduction } = getIfUtils(process.env.NODE_ENV)
const { EnvironmentPlugin } = require('webpack')

module.exports = {
  entry: path.join(__dirname, 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'assets/js/[name]_[hash:8].js',
    chunkFilename: 'assets/js/[name]_[chunkhash:8].js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      path.join(__dirname, 'src'),
      'node_modules'
    ],
    extensions: [
      '.js',
      '.json',
      '.vue',
      '.css',
      '.scss'
    ]
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.s?css$/,
        use: [
          ifProduction(MiniCssExtractPlugin.loader, 'vue-style-loader'),
          'css-loader',
          {
            loader: 'postcss-loader', // Run postcss actions
            options: {
              plugins: () => ([
                require('autoprefixer')
              ])
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg|webp)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'assets/[ext]/[name]_[hash:8].[ext]'
          }
        }]
      }
    ]
  },
  plugins: removeEmpty([
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      title: 'CR',
      description: 'A new frontend for Crunchyroll, with a less crunchy experience.',
      template: path.join(__dirname, '/src/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true
      }
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '/static'),
      to: path.join(__dirname, '/dist')
    }]),
    ifProduction(new MiniCssExtractPlugin({
      filename: 'assets/css/[name]_[hash:8].css',
      chunkFilename: 'assets/css/[name]_[chunkhash:8].css'
    })),
    new EnvironmentPlugin({
      'GA_KEY': null
    })
  ]),
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  },
  devServer: {
    historyApiFallback: true,
    port: 8080
  }
}
