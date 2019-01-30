const path = require('path');

const isProd = process.env.NODE_ENV === 'production';

export default {
  app: path.resolve('src/index.js'),
  filename: './scripts/[name].bundle.js',
  chunkFileName: './scripts/[name].[hash].js',
  path: path.resolve('public/assets/'),
  publicPath: '/',
  sourceMapFilename: '[file].map',
  alias: {
    components: path.join(__dirname, '../src/components')
  },
  devtool: isProd ? 'source-map' : 'nosources-source-map',
  cssFileName: './styles/[name].bundle.css',
  isServer: process.env.NODE_MODE === 'server'
};