import { rule } from "graphql-shield";

const isAdmin = rule()(async (parent, args, { currentUser }, info) => {
  return currentUser?.role === "ADMIN";
});
const isAuthor = rule()(async (parent, args, { currentUser }, info) => {
  return currentUser?.role === "AUTHOR";
});
const isAuthenticated = rule()(async (parent, args, { currentUser }, info) => {
  const ROLES = ["ADMIN", "AUTHOR", "USER"];
  return ROLES.includes(currentUser.role);
});

export { isAdmin, isAuthor, isAuthenticated };
