const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('../webpack.config');
const webpack = require('webpack');

const config = {
  mode: 'development',
  devtool: 'inline-source-map',
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      filename: null,
      test: /\.(ts|js)($|\?)/i,
    }),
  ],
};

module.exports = merge(baseConfig, config);
