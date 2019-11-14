const path = require('path');

module.exports = {
  mode: 'development',
  context: path.join(__dirname, './'),
  entry: './src/app.js',
  output: {
    path: path.join(__dirname, 'server/public'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.js'],
  },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        include: path.join(__dirname, 'app'),
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: {loader: 'html-loader'}
      }
    ],
  },
  node: {
    fs: 'empty'
  }
};