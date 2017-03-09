const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const htmlWebpackPlugin = new HtmlWebpackPlugin({ template: 'index.html' });
const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV === 'development' || 'true'))
});
const extractTextPlugin = new ExtractTextPlugin({ filename: '[name]-[hash].css', disable: false, allChunks: true });

module.exports = {
  context: path.join(__dirname, 'src'),
  entry: [
    './index.html',
    './main.js',
    './main.scss',
  ],
  output: {
    filename: '[hash].js',
  },
  devtool: 'source-map',
  plugins: [htmlWebpackPlugin, definePlugin, extractTextPlugin],
  resolve: {
    modules: ['node_modules', path.join(__dirname, 'src')]
  },
  module: {
    rules: [
      { test: /\.html$/, use: "html-loader?interpolate", },
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
          loader: 'css-loader?localIdentName=[path][name]__[local]&modules&importLoaders=1&sourceMap=true!postcss-loader!sass-loader',
        }),
      },
      { test: /\.(png|jpg|gif)$/, use: 'url-loader?limit=15000&name=image/png+jpg+gif/[name]-[hash:base64:10].[ext]' },
      { test: /\.eot(\?v=\d+.\d+.\d+)?$/, use: 'url-loader' },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, use: 'url-loader?limit=10000&mimetype=application/font-woff' },
      { test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, use: 'url-loader?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'url-loader?limit=10000&mimetype=image/svg+xml' },
    ]
  },
  devServer: {
    historyApiFallback: true,
    proxy: {
      '/api*': 'http://localhost:8181'
    }
  }
};
