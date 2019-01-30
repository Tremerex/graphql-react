import { serverConfiguration } from 'universal-webpack';

import configuration from './webpack.config.prod.babel';
import settings from './universal.webpack.config.json';

export default serverConfiguration(configuration, settings);
