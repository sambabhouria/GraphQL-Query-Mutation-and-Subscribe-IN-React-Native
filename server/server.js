const express = require('express');
const http = require('http');
const {ApolloServer, gql} = require('apollo-server-express');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const app = express();
const PORT = 4000;

// setting up appolo server
const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers,
  subscriptions: {
    onConnect: () => console.log('Connected to websocket'),
  },
  tracing: true,
  grapqhl: true,
});

server.applyMiddleware({app});
const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({port: PORT}, () => {
  console.log(
    `🚀💪🐞🥂 🐼💳💎 🛳  🦁 🍰 🏅 🔜 Server ready at http://localhost:${PORT}${server.graphqlPath}`,
  );
  console.log(
    `🚀💪🐞🥂 🐼💳💎 🛳  🦁 🍰 🏅 🔜  Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`,
  );
});
