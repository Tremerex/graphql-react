import webpack from 'webpack';
import path from 'path';
import fs from 'fs';

import config from '../config';

export default {
  mode: process.env.NODE_ENV,
  entry: {
    app: config.app
  },
  output: {
    filename: config.filename,
    chunkFilename: config.chunkFileName,
    path: config.path,
    publicPath: config.publicPath
  },
  resolve: {
    alias: {
      '@component': config.alias.components
    },
    modules: ['node_modules'],
    extensions: ['.js']
  },
  devtool: config.devtool,
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  optimization: {
    splitChunks: {
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        default: false,
        vendors: {
          chunks: 'async',
          test: '/node_modules/',
          priority: 10
        },
        commons: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          filename: './scripts/commons.chunk.js'
        }
      }
    }
  }
}
