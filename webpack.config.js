const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractCSS = new ExtractTextPlugin({
  // `allChunks` is needed to extract from extracted chunks as well.
  allChunks: true,
  filename: "css/[name].css"
})

module.exports = {
  mode: 'development',

  entry: {
    index: './src/js/index.js'
  },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractCSS.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                sourceMap: true
              }
            },
            'sass-loader'
          ],
          fallback: "style-loader"
        })
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src', 'js'),
        use: 'babel-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              fallback: 'file-loader'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "宝石勇士",
      favicon: './src/images/favicon.ico',
      template: path.resolve(__dirname, './index.html')
    }),
    extractCSS
  ],

  devServer: {
    stats: 'errors-only',
    host: process.env.HOST,
    port: process.env.PORT,
    // does not capture runtime errors of the application
    overlay: true
  }
}