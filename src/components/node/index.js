import loadable from '@loadable/component';

const Node = loadable(
  () => import (
    /* webpackChunkName: "product" */
    './node'
  )
);

export { Node };
