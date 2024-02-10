// @ts-expect-error TS(2451) FIXME: Cannot redeclare block-scoped variable 'path'.
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.join(__dirname, 'app', 'src', 'index.js'),
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'index_bundle.js',
  },
  target: 'web',
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    static: {
      directory: path.join(__dirname, 'app', 'public'),
    },
    hot: true,
    proxy: {
      '/api': 'http://localhost:3000'
    },
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'], // order reads right to left (turns sass files to css to style string)
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'app', 'public', 'index.html'),
    }),
    new CopyPlugin({
      patterns: [
        { from: path.join('app', 'public', 'icons'), to: 'icons' }
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'], // these files can be imported without specifying extension
  },
};
