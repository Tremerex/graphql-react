import loadable from '@loadable/component';

const App = loadable(
  () => import(
    /* webpackChunkName: "init" */
    './init'
  )
);

export { App };
