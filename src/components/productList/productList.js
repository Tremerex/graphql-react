import React from 'react';
import PropTypes from 'prop-types';
import { Query } from "react-apollo";
import { Link } from 'react-router-dom';

import { GET_PRODUCTS } from '../apollo/queries/product';
import Styles from './productList.scss';

class ProductList extends React.Component {
  render() {
    const { skip, first } = this.props;
    return (
      <Query
        query={GET_PRODUCTS}
        variables={{ skip, first }}
      >
        {
          (response) => {
            const { loading, data, error } = response;
            if (error) return `Error! ${error.message}`;
            if (loading) return 'loading...';
            const { productList: { products } = [] } = data;
            return (
              <div className={Styles.container}>
                <div className={Styles.pageHeader}>
                  <h1 className={Styles.title}>
                    Product List
                  </h1>
                </div>
                <div className={Styles.productList}>
                  <ul>
                    {
                      products.map(product => (
                        <li key={product.id}>
                          <div>
                            <Link to={{ pathname: `/product/${product.id}`, search: 'nodeSkip=10&first=0'  }}>
                              {product.id}
                            </Link>
                          </div>
                          <div>
                            {product.name}
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </div>
              </div>
            );
          }
        }
      </Query>
    );
  }
}

ProductList.PropTypes = {
  skip: PropTypes.number,
  first: PropTypes.number
}

export default ProductList;