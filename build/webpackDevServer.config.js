import errorOverlayMiddleware from 'react-dev-utils/errorOverlayMiddleware';
import path from 'path';

import config from './webpack.config.dev.babel';

const HOST = process.env.HOST || '0.0.0.0';

export default (proxy, allowedHost) => {
  return {
    //disableHostCheck: !proxy || process.env.DANGEROUSLY_DISABLE_HOST_CHECK === 'true',
    //compress: true,
    //clientLogLevel: 'none',
    contentBase: path.resolve(__dirname, '../public'),
    //watchContentBase: true,
    hot: true,
    publicPath: config.output.publicPath,
    quiet: true,
    watchOptions: {
      ignored: /node_modules/,
    },
    host: HOST,
    //overlay: false,
    historyApiFallback: true,
    public: allowedHost,
    before: (app) => app.use(errorOverlayMiddleware())
  };
}