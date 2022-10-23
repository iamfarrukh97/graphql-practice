import { rule } from "graphql-shield";
import { GraphQLYogaError } from "@graphql-yoga/node";
const isAdmin = rule()(async (parent, args, { currentUser }, info) => {
  if (!currentUser) {
    return new GraphQLYogaError("Please login!");
  }
  if (currentUser?.role === "ADMIN") {
    return true;
  }
  return new GraphQLYogaError("You are not authorized for this action!");
});
const isAuthor = rule()(async (parent, args, { currentUser }, info) => {
  if (!currentUser) {
    return new GraphQLYogaError("Please login!");
  }
  if (currentUser?.role === "AUTHOR") {
    return true;
  }
  return new GraphQLYogaError("You are not authorized for this action!");
});
const isAuthenticated = rule()(async (parent, args, { currentUser }, info) => {
  if (!currentUser) {
    return new GraphQLYogaError("Please login!");
  }
  const ROLES = ["ADMIN", "AUTHOR", "USER"];
  if (ROLES.includes(currentUser?.role)) {
    return true;
  }
  return new GraphQLYogaError("You are not authorized for this action!");
});

export { isAdmin, isAuthor, isAuthenticated };
