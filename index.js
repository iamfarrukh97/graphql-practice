import { createServer, createPubSub } from "@graphql-yoga/node";
import express from "express";
import { PrismaClient } from "@prisma/client";
import errorController from "./handlers/errorController.js";
import db from "./src/db.js";
import Query from "./src/resolvers/Query.js";
import Mutation from "./src/resolvers/Mutation.js";
import Subscription from "./src/resolvers/Subscription.js";
import User from "./src/resolvers/User.js";
import Post from "./src/resolvers/Post.js";
import Comment from "./src/resolvers/Comment.js";
import typeDefs from "./src/schema.js";

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
  context: { prisma, db, pubsub },
});

// graphQLServer.start();
const check = async () => {
  // const posts = await prisma.post.findMany({
  //   include: {
  //     user: true,
  //   },
  // });
  // console.log(JSON.stringify(posts));
  // const post = await prisma.post.create({
  //   data: {
  //     title: "test post 1",
  //     body: "test body 1",
  //     published: false,
  //     user: {
  //       connect: { id: "14adae66-0150-4e1c-b536-a8758bb98164" },
  //     },
  //   },

  //   include: {
  //     user: true,
  //   },
  // });
  console.log(JSON.stringify(post));
};
app.use("/graphql", graphQLServer);
app.listen(4000, () => {
  // check();
  console.log("Running a GraphQL API server at http://localhost:4000/graphql");
});
