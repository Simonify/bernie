const path = require('path');

module.exports = {
  module: {
    loaders: []
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[hash].js',
    publicPath: '/assets/'
  },
  resolve: {
    modulesDirectories: ['node_modules'],
    root: [
      path.join(__dirname, '../'),
      path.join(__dirname, '../src'),
      path.join(__dirname, '../shared')
    ],
    extensions: ['', '.js']
  }
};
