import { or, shield } from "graphql-shield";
import errorController from "../handlers/errorController.js";
import { isAdmin, isAuthor, isAuthenticated } from "./Rules.js";
const permissions = shield(
  {
    Query: {
      users: isAdmin,
      me: isAuthenticated,
      myPosts: or(isAdmin, isAuthor),
    },
    Mutation: {
      updateUser: isAuthenticated,
      deleteUser: isAuthenticated,
      createPost: or(isAdmin, isAuthor),
      updatePost: or(isAdmin, isAuthor),
      deletePost: or(isAdmin, isAuthor),
      createComment: isAuthenticated,
      updateComment: isAuthenticated,
      deleteComment: isAuthenticated,
    },
  },
  {
    async fallbackError(thrownThing, parent, args, context, info) {
      errorController(thrownThing);
    },
  }
);

export { permissions as default };
