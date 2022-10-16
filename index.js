import { createServer, createPubSub } from "@graphql-yoga/node";
import express from "express";
import { PrismaClient } from "@prisma/client";
import errorController from "./handlers/errorController.js";
import Query from "./src/resolvers/Query.js";
import Mutation from "./src/resolvers/Mutation.js";
import Subscription from "./src/resolvers/Subscription.js";
import User from "./src/resolvers/User.js";
import Post from "./src/resolvers/Post.js";
import Comment from "./src/resolvers/Comment.js";
import typeDefs from "./src/schema.js";
import { verifyAuthToken } from "./src/utils/TokenAuth.js";
import AutoCreateAdmin from "./src/utils/AutoCreateAdmin.js";
const pubsub = createPubSub();
const prisma = new PrismaClient();
const app = express();
const graphQLServer = createServer({
  schema: {
    typeDefs: typeDefs,
    resolvers: {
      Query,
      Mutation,
      Subscription,
      User,
      Post,
      Comment,
    },
  },
  async context(request) {
    return {
      prisma,
      pubsub,
      currentUser: await verifyAuthToken(request, prisma),
    };
  },
});

app.use("/graphql", graphQLServer);
app.listen(4000, async () => {
  AutoCreateAdmin(prisma);
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
