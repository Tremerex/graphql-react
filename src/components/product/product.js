import React from 'react';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import { Query } from "react-apollo";
import { Node } from '../node';

import { GET_PRODUCT_BY_ID } from '../apollo/queries/product';
import { mergeDeep, get } from '../commons/utils';
import Styles from './product.scss';

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.loadMore = this.loadMore.bind(this);
  }

  loadMore(fetchMore, { id, skip, first }) {
    return fetchMore({
      variables: { id, skip, first },
      updateQuery: (prev, { fetchMoreResult }) => {
        const node = get(fetchMoreResult, 'productById.nodes.node', []);
        if (!node.length) return prev;
        return mergeDeep(prev, fetchMoreResult);
      }
    })
  }

  componentDidMount() {
    this.mainContainer = document.querySelector('#mainContainer');
  }

  render() {
    const { match: { params: { productId, nodeSkip = 10, nodeFirst = 0 } = {} } = {} } = this.props;
    return (
      <Query
        query={GET_PRODUCT_BY_ID}
        variables={{ id: productId, skip: nodeSkip, first: nodeFirst }}
      >
        {
          (response) => {
            const { loading, data, error, fetchMore } = response;
            if (error) return `Error! ${error.message}`;
            if (loading) return 'loading...';

            const { productById: { id, name, nodes: { pageInfo, node = [] } } } = data;
            return (
              <div id={id} className={Styles.container}>
                <div className={Styles.pageHeader}>
                  <h1 className={Styles.title}>
                    {name}
                  </h1>
                </div>
                <div>
                  <InfiniteScroll
                    getScrollParent={() => this.mainContainer}
                    loadMore={() => this.loadMore(fetchMore, {
                      id,
                      skip: ~~pageInfo.endCursor,
                      first: ~~pageInfo.startCursor
                    })}
                    hasMore={pageInfo.hasNextPage}
                    loader={<div key={0}>Loading ...</div>}
                    threshold={0}
                  >
                    <ul className={Styles.nodeList}>
                      {
                        node.map(node => (
                          <li key={node.id}>
                            <Node name={node.name} color={node.color} />
                          </li>
                        ))
                      }
                    </ul>
                  </InfiniteScroll>
                </div>
              </div>
            );
          }
        }
      </Query>
    );
  }
}

Product.PropTypes = {
  productId: PropTypes.number.isRequired,
  nodeSkip: PropTypes.number,
  nodeFirst: PropTypes.number
};

export default Product;
