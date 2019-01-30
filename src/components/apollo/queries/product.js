import gql from "graphql-tag";

export const GET_PRODUCT_BY_ID = gql`
  query ProductById($id: Int!, $skip: Int, $first: Int) {
    productById(id: $id) {
      id
      name
      nodes(skip: $skip, first: $first) {
        node {
          id
          name
          color
        }
        pageInfo {
          startCursor
          endCursor
          hasNextPage
        }
        totalCount
      }
    }
  }`;

export const GET_PRODUCTS = gql`
  query ProductList($skip: Int, $first: Int) {
    productList(skip: $skip, first: $first) {
      products {
        id
        name
      }
    }
  }`;