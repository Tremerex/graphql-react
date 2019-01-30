import loadable from '@loadable/component';

const Product = loadable(
  () => import(
    /* webpackChunkName: "product" */
    './product'
  )
);

export { Product };
