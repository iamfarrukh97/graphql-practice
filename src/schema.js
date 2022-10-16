import gql from "graphql-tag";
const typeDefinitions = gql`
  type Query {
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
    me: User!
    post: Post!
  }

  type Mutation {
    signUp(data: CreateUserInput!): AuthPayload!
    login(data: LoginUserInput!): AuthPayload!
    deleteUser(id: ID!): User!
    updateUser(id: ID!, data: UpdateUserInput!): User!
    createPost(data: CreatePostInput!): Post!
    deletePost(id: ID!): Post!
    updatePost(id: ID!, data: UpdatePostInput!): Post!
    createComment(data: CreateCommentInput!): Comment!
    deleteComment(id: ID!): Comment!
    updateComment(id: ID!, data: UpdateCommentInput!): Comment!
  }

  type Subscription {
    comment(postId: ID!): CommentSubscriptionPayload!
    post: PostSubscriptionPayload!
  }
  type AuthPayload {
    user: User!
    token: String!
  }
  enum UserRoleSignUp {
    AUTHOR
    USER
  }
  input CreateUserInput {
    name: String!
    email: String!
    password: String!
    age: Int
    role: UserRoleSignUp
  }
  input LoginUserInput {
    email: String!
    password: String!
  }
  input UpdateUserInput {
    name: String
    email: String
    age: Int
  }

  input CreatePostInput {
    title: String!
    body: String!
    published: Boolean!
  }

  input UpdatePostInput {
    title: String
    body: String
    published: Boolean
  }

  input CreateCommentInput {
    text: String!
    userId: ID!
    postId: ID!
  }

  input UpdateCommentInput {
    text: String
  }

  scalar DateTime

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    user: User
    comments: [Comment]
    createdAt: DateTime!
    updatedAt: DateTime!
  }
  enum UserRole {
    ADMIN
    AUTHOR
    USER
  }
  type User {
    id: ID!
    name: String!
    email: String!
    # password: String!
    role: UserRole!
    age: Int
    posts: [Post]
    comments: [Comment]
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Comment {
    id: ID!
    text: String!
    user: User!
    post: Post!
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  enum MutationType {
    CREATED
    UPDATED
    DELETED
  }

  type PostSubscriptionPayload {
    mutation: MutationType!
    data: Post!
  }

  type CommentSubscriptionPayload {
    mutation: MutationType!
    data: Comment!
  }
`;
export { typeDefinitions as default };
