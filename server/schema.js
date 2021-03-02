const {gql} = require('apollo-server-express');

const typeDefs = gql`
  scalar JSON
  type User {
    name: String!
    age: Int!
    email: String!
    address: String!
    password: String!
  }
  type Query {
    users: [User!]!
    user(email: String!): User
  }
  type Mutation {
    createUser(
      name: String!
      age: Int!
      email: String!
      address: String!
      password: String!
    ): JSON
    updateUser(email: String!, name: String, address: String, age: Int): JSON
    deleteUser(email: String!): JSON
  }
  type Subscription {
    userAdded: User
  }
`;
module.exports = typeDefs;
