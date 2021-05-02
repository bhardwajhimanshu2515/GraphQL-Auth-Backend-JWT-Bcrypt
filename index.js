const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");

const typeDefs = require("./src/typeDefs");
const resolvers = require("./src/resolvers");

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app: app });

  app.use((req, res) => {
    res.send("Hello these requests are being handled by Express Server");
  });

  await mongoose
    .connect("mongodb://127.0.0.1:27017/graphAuthDB", {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    })
    .then(() => {
      console.log("Connected to mongoDB");
    })
    .catch((err) => {
      console.log(err);
    });
    
  app.listen(8081, () => {
    console.log("Server has been Started");
  });
}

startServer();
