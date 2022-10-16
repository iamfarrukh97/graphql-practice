import { c } from "tar";
import AppError from "../../handlers/errorHandler.js";

const Query = {
  async users(parent, args, { prisma }, info) {
    const where = args.query
      ? {
          OR: [{ name: { contains: args.query, mode: "insensitive" } }],
        }
      : {};
    try {
      const users = await prisma.user.findMany({ where });
      return users;
    } catch (error) {
      console.log("error=>", error);
    }
  },
  async posts(parent, args, { currentUser, prisma }, info) {
    console.log({ currentUser });
    const where = args.query
      ? {
          OR: [
            { title: { contains: args.query, mode: "insensitive" } },
            { body: { contains: args.query, mode: "insensitive" } },
          ],
        }
      : {};

    const posts = await prisma.post.findMany({ where });
    return posts;
  },
  async comments(parent, args, { prisma }, info) {
    try {
      const comments = await prisma.comment.findMany();
      return comments;
    } catch (error) {
      console.log("error =>", error);
    }
  },
  me() {
    return {
      id: "123098",
      name: "Mike",
      email: "mike@example.com",
    };
  },
  post() {
    // const user
    const user = {
      __typename: "User",
      id: "1",
    };
    const post = {
      __typename: "Post",
      id: "092",
      title: "GraphQL 101",
      body: "",
      published: false,
      user,
    };
    return post;
  },
};

export { Query as default };
