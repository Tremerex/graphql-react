import webpack from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import webpackMerge from 'webpack-merge';
import webpackBaseConfig from './webpack.config.base.babel';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import PreloadWebpackPlugin from 'preload-webpack-plugin';
import LoadablePlugin from '@loadable/webpack-plugin';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import config from '../config';

export default webpackMerge(webpackBaseConfig, {
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: config.path
            }
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 10,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }, {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: config.path
            }
          }, {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 10,
              localIdentName: '[name]__[local]___[hash:base64:5]'
            }
          }, {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new MiniCssExtractPlugin({
      filename: config.cssFileName
    }),
    new HtmlWebpackPlugin({
      template: './server/assets/index.html',
      filename: '../index.html'
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      as(entry) {
        if (/\.css$/.test(entry)) return 'style';
        return 'script';
      },
      include: 'allChunks'
    }),
    new TerserPlugin({
      parallel: true,
      sourceMap: true,
      terserOptions: {
        output: {
          comments: false,
        },
        compress: {
          warnings: false,
        },
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    }),
    new LoadablePlugin({
      filename: '../loadable-stats.json',
      writeToDisk: true
    }),
    /*new ReactLoadablePlugin({
      filename: './public/assets/react-loadable.json'
    })*/
  ]
});
