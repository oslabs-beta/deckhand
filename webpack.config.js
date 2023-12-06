const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: './app/src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'index_bundle.js',
  },
  target: 'web',
  devServer: {
    host: '0.0.0.0',
    // port: 8080 by default
    static: {
      directory: path.join(__dirname, 'public'),
    },
    proxy: {
      // list every endpoint
      '/api': 'http://localhost:3000',
      '/getAccessToken': 'http://localhost:3000',
      '/getUserData': 'http://localhost:3000',
      '/getOauth': 'http://localhost:3000',
      '/getUserInfo': 'http://localhost:3000',
      '/searchInfo': 'http://localhost:3000',
      '/grabCookie': 'http://localhost:3000',
      '/github': 'http://localhost:3000'
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
        exclude: /node_modules/,
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
      template: path.join(__dirname, './app/public/index.html'),
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'], // these files can be imported without specifying extension
  },
};
