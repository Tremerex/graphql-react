import React from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';

import { ProductList } from '../productList';
import { Product } from '../product';
import Styles from './init.scss';

export default class App extends React.Component {
  render() {
    return (
      <div className={Styles.container}>
        <div>
          <div className={Styles.nav}>
            <ul>
              <li>
                <NavLink to="/">
                  Product List
                </NavLink>
              </li>
            </ul>
          </div>
          <Switch>
            <Route exact path="/" render={props => < ProductList {...props} />} />
            <Route name="product" path="/product/:productId" component={Product} />
          </Switch>
        </div>
      </div>
    );
  }
}
