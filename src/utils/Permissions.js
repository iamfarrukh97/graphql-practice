import { or, shield } from "graphql-shield";
import { isAdmin, isAuthor, isAuthenticated } from "./Rules.js";
const permissions = shield({
  Query: {
    users: isAdmin,
    me: isAuthenticated,
  },
  Mutation: {
    createPost: or(isAdmin, isAuthor),
  },
});

export { permissions as default };
