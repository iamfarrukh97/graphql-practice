import AppError from "../handlers/errorHandler.js";
import { hashPassword, verifyPassword } from "../utils/PasswordHashing.js";
import { generateAuthToken } from "../utils/TokenAuth.js";
const Mutation = {
  async signUp(parent, args, { prisma }, info) {
    try {
      const password = await hashPassword(args.data.password);
      const user = await prisma.user.create({
        data: { ...args.data, email: args.data.email.toLowerCase(), password },
      });
      if (user.id) {
        const token = await generateAuthToken(user.id);
        return { user, token };
      }
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async login(parent, args, { prisma }, info) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: args.data.email.toLowerCase() },
      });
      if (!user) {
        throw new Error("Incorrent credentials");
      }
      const isMatched = await verifyPassword(args.data.password, user.password);
      if (!isMatched) {
        throw new Error("Incorrent credentials");
      }
      return { user, token: await generateAuthToken(user.id) };
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async deleteUser(parent, args, { currentUser, prisma }, info) {
    try {
      const { id } = args;
      let userIdToDelete = currentUser.id;
      if (currentUser.role === "ADMIN") {
        userIdToDelete = id;
      }
      if (!userIdToDelete) {
        throw new AppError("Invalid user id");
      }
      const deletedUser = await prisma.user.delete({
        where: {
          id: userIdToDelete,
        },
      });
      if (!deletedUser) {
        throw new AppError("Unable to delete user");
      }
      return deletedUser;
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async updateUser(parent, args, { prisma, currentUser }, info) {
    try {
      const { id, data } = args;
      const fieldsToUpdate = {};
      let userIdToUpdate = currentUser.id;
      if (currentUser.role === "ADMIN") {
        userIdToUpdate = id;
        if (typeof data.role === "string" && typeof id === "string") {
          fieldsToUpdate.role = data.role;
        }
      }
      if (!userIdToUpdate) {
        throw new AppError("Invalid user id");
      }

      if (typeof data.email === "string") {
        fieldsToUpdate.email = data.email;
      }

      if (typeof data.name === "string") {
        fieldsToUpdate.name = data.name;
      }
      if (typeof data.age === "number") {
        fieldsToUpdate.age = data.age;
      }
      const user = await prisma.user.update({
        where: {
          id: userIdToUpdate,
        },
        data: fieldsToUpdate,
      });

      if (!user) {
        throw new AppError("User not found");
      }

      return user;
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async createPost(parent, args, { currentUser, prisma, pubsub }, info) {
    try {
      const post = await prisma.post.create({
        data: { ...args.data, userId: currentUser.id },
      });
      if (args.data.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
      return post;
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async deletePost(parent, args, { currentUser, prisma, pubsub }, info) {
    try {
      const { id } = args;
      const isPostAuthor = await prisma.post.findFirst({
        where: { id, userId: currentUser.id },
      });
      if (!isPostAuthor) {
        throw new AppError("You are not author of this post");
      }

      const post = await prisma.post.delete({
        where: { id },
      });
      if (!post) {
        throw new AppError("Post not found");
      }
      if (post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: post,
          },
        });
      }

      return post;
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async updatePost(parent, args, { currentUser, prisma, pubsub }, info) {
    try {
      const { id, data } = args;
      const isPostAuthor = await prisma.post.findFirst({
        where: { id, userId: currentUser.id },
      });
      if (!isPostAuthor) {
        throw new AppError("You are not author of this post");
      }
      const originalPost = { ...isPostAuthor }; // isPostAuthor contains the post data
      const fieldsToUpdate = {};
      if (typeof data.title === "string") {
        fieldsToUpdate.title = data.title;
      }

      if (typeof data.body === "string") {
        fieldsToUpdate.body = data.body;
      }
      if (typeof data.published === "boolean") {
        fieldsToUpdate.published = data.published;
      }
      const post = await prisma.post.update({
        where: {
          id: id,
        },
        data: fieldsToUpdate,
      });

      if (!post) {
        throw new AppError("Post not found");
      }

      if (typeof data.published === "boolean") {
        fieldsToUpdate.published = data.published;

        if (fieldsToUpdate.published && !post.published) {
          pubsub.publish("post", {
            post: {
              mutation: "DELETED",
              data: originalPost,
            },
          });
        } else if (!originalPost.published && post.published) {
          pubsub.publish("post", {
            post: {
              mutation: "CREATED",
              data: post,
            },
          });
        }
      } else if (post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "UPDATED",
            data: post,
          },
        });
      }

      return post;
    } catch (error) {
      throw new AppError(error.message);
    }
  },
  async createComment(parent, args, { currentUser, prisma, pubsub }, info) {
    const postExists = await prisma.post.findFirst({
      where: {
        id: args.data.postId,
        published: true,
      },
    });
    if (!postExists) {
      throw new AppError("Unable to find user and post");
    }
    const comment = await prisma.comment.create({
      data: { ...args.data, userId: currentUser.id },
    });
    pubsub.publish(`comment ${args.data.postId}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  async deleteComment(parent, args, { prisma, pubsub, currentUser }, info) {
    const { id } = args;

    const isCommentAuthor = await prisma.comment.findFirst({
      where: { id, userId: currentUser.id },
    });
    if (!isCommentAuthor) {
      throw new AppError("You are not author of this comment");
    }
    const deletedComment = await prisma.comment.delete({
      where: {
        id,
      },
    });
    if (!deletedComment) {
      throw new AppError("Comment not found");
    }
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment,
      },
    });
    return deletedComment;
  },
  async updateComment(parent, args, { prisma, currentUser, pubsub }, info) {
    const { id, data } = args;
    const isCommentAuthor = await prisma.comment.findFirst({
      where: { id, userId: currentUser.id },
    });
    if (!isCommentAuthor) {
      throw new AppError("You are not author of this comment");
    }
    const fieldsToUpdate = {};
    if (typeof data.text === "string") {
      fieldsToUpdate.text = data.text;
    }
    const comment = await prisma.comment.update({
      where: {
        id,
      },
      data: fieldsToUpdate,
    });
    if (!comment) {
      throw new AppError("Comment not found");
    }
    pubsub.publish(`comment ${comment.postId}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export { Mutation as default };
