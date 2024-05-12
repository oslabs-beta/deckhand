const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: path.join(__dirname, 'app', 'src', 'index.tsx'),
  output: {
    path: path.join(__dirname, 'build'),
    publicPath: '/',
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
    historyApiFallback: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: { loader: 'ts-loader' },
      },
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
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // these files can be imported without specifying extension
  },
};