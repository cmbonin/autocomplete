'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: JSON.stringify(process.env.NODE_ENV),
  entry: {
    'js/autocomplete/autocomplete': [ path.join(__dirname, 'src/autocomplete/autocomplete.js') ],
    'main': [ path.join(__dirname, 'src/main.js') ],
    'assets/app.css': [ path.join(__dirname, 'src/assets/app.scss') ]
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    publicPath: '/autocomplete/'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.resolve(__dirname, 'src/assets'), to: 'assets' },
      { from: path.resolve(__dirname, 'src/index.html'), to: './' }
    ]),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ExtractTextPlugin('app.css'),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          compress: true,
          ecma: 6,
          mangle: true
        },
        sourceMap: false
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader'
        }
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/assets/'),
        use: ExtractTextPlugin.extract({
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.svg/,
        exclude: /node_modules/,
        use: {
          loader: 'file-loader'
        }
      }
    ]
  }
};
