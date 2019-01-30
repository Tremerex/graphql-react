import loadable from '@loadable/component';

const ProductList = loadable(
  () => import(
    /* webpackChunkName: "productList" */
    './productList'
  ),
);

export { ProductList };