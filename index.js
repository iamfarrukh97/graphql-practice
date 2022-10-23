import { createServer, createPubSub } from "@graphql-yoga/node";
import { PrismaClient } from "@prisma/client";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import express from "express";
import errorController from "./src/handlers/errorController.js";
import Query from "./src/resolvers/Query.js";
import Mutation from "./src/resolvers/Mutation.js";
import Subscription from "./src/resolvers/Subscription.js";
import User from "./src/resolvers/User.js";
import Post from "./src/resolvers/Post.js";
import Comment from "./src/resolvers/Comment.js";
import typeDefinitions from "./src/schema.js";
import { verifyAuthToken } from "./src/utils/TokenAuth.js";
import AutoCreateAdmin from "./src/utils/AutoCreateAdmin.js";
import permissions from "./src/utils/Permissions.js";
const pubsub = createPubSub();
const prisma = new PrismaClient();
const app = express();

const schema = makeExecutableSchema({
  resolvers: [
    {
      Query,
      Mutation,
      Subscription,
      User,
      Post,
      Comment,
    },
  ],
  typeDefs: typeDefinitions,
});
const schemaWithPermissions = applyMiddleware(
  schema,
  permissions.generate(schema)
);
const graphQLServer = createServer({
  schema: schemaWithPermissions,
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
