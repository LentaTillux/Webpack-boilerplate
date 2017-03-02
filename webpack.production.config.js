const { resolve } = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const PJ = 'src';
const PD = 'dist';
const config = {
  devtool: 'cheap-module-source-map', //'cheap-source-map',
  context: resolve(__dirname, PJ),
  entry: [
    './index.html',
    './main.js',
    './main.scss',
  ],
  output: {
    filename: '[name]-[hash].js',
    path: resolve(__dirname, PD),
    publicPath: '',
  },
  resolve: {
    modules: ['node_modules', resolve(__dirname, PJ)]
  },

  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html' }),

    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'false')),
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
      }
    }),
    new ExtractTextPlugin({ filename: '[name]-[hash].css', disable: false, allChunks: true }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      mangle: {
        screw_ie8: true,
        keep_fnames: true,
      },
      compress: {
        screw_ie8: true,
        warnings: false
      },
      comments: false,
    }),
    new CompressionPlugin()
  ],

  module: {
    rules: [
      { test: /\.html$/, use: "html-loader", },
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.(scss|sass)$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          loader: 'css-loader?localIdentName=[path][name]__[local]--[hash:base64:5]&modules&importLoaders=1&sourceMap=true&minimize=true!sass-loader',
        }),
      },
      { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=15000&name=image/png+jpg+gif/[name]-[hash:base64:10].[ext]' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'file-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ]
  }
};

module.exports = config;
