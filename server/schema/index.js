import { PubSub, withFilter } from 'graphql-subscriptions';
import { productList } from '../data/product';
import { makeExecutableSchema } from 'graphql-tools';
import graphqlFields from 'graphql-fields';

const pubsub = new PubSub();

const typeDefs = `
  type Product {
    id: Int!
    name: String
    description: String
    node: [Node]
    nodes(skip: Int, first: Int): NodeInfo
  },
  type Node {
    id: Int
    name: String
    color: String
  }
  type NodeInfo {
    node: [Node]
    pageInfo: PageInfo
    totalCount: Int
  }
  input NodeInput {
    name: String
    color: String
  }
  type PageInfo {
    startCursor: String
    endCursor: String
    hasNextPage: Boolean
  }
  type productResult {
    products: [Product]
    pageInfo: PageInfo
    totalCount: Int
  }
  type Query {
    productById(id: Int!): Product
    productList(skip: Int, first: Int, orderBy: String): productResult
  }
  type Mutation {
    addProductNode(id: Int!, node: NodeInput!): Product
  }
  type Subscription {
    nodeAdded(productId: Int!): Product
  }
`;

const getPaginator = (length, first, skip) => {
  const dist = skip - first;
  const currentPage = Math.ceil(first / dist) + 1;
  return {
    startCursor: skip || length,
    endCursor: Math.min(length, dist * (currentPage + 1)),
    hasNextPage: (dist * currentPage) < length
  }
}

const resolvers = {
  Query: {
    productById: (_, { id }, context, info) => {
      if (graphqlFields(info).nodes) {
        const { node, ...rest } = productList.find(x => x == id);
        const totalCount = node.length;
        return {
          nodes: ({ skip, first }) => ({
            node: node.slice(first, (skip || totalCount)),
            pageInfo: getPaginator(totalCount, first, skip),
            totalCount
          }),
          ...rest
        };
      } else {
        return productList.find(x => x == id);
      }
    },
    productList: (_, { skip, first, orderBy }) => {
      const totalCount = productList.length;
      const products = productList.slice(first, (skip || totalCount))
        .sort((a, b) => (''+b[orderBy]).localeCompare(a[orderBy]));
      return {
        products,
        pageInfo: getPaginator(totalCount, first, skip),
        totalCount
      }
    }
  },
  Mutation: {
    addProductNode: (_, { id, node }) => {
      const { length: nodeCount } = productList.reduce((acc, obj) => (acc.push(...obj.node), acc), []);
      const product = productList.find(x => x == id);
      product.node.push({
        id: nodeCount + 1,
        name: `${node.name} ${nodeCount + 1}`,
        color: `#${(('00' + ~~(Math.random() * 1023)).toString(16)).slice(-3)}`
      });
      pubsub.publish('nodeAdded', { nodeAdded: product, productId: id });
      return product;
    }
  },
  Subscription: {
    nodeAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator('nodeAdded'),
        ({ nodeAdded: product }, args) => product == args.productId
      )
    }
  }
}

export default makeExecutableSchema({
  typeDefs,
  resolvers
});
