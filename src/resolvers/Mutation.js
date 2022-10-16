import AppError from "../../handlers/errorHandler.js";
import { Prisma } from "@prisma/client";
import console from "console";
const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const user = await prisma.user.create({
      data: args.data,
    });
    return user;
  },
  async deleteUser(parent, args, { prisma }, info) {
    console.log("agra", args);
    try {
      const deletedUser = await prisma.user.delete({
        where: {
          id: args.id,
        },
      });
      console.log({ deletedUser });

      const deletedPosts = await prisma.post.deleteMany({
        where: {
          userId: args.id,
        },
      });
      console.log({ deletedPosts });
      // db.posts = db.posts.filter((post) => {
      //   const match = post.author === args.id;

      //   if (match) {
      //     db.comments = db.comments.filter((comment) => comment.post !== post.id);
      //   }

      //   return !match;
      // });
      // db.comments = db.comments.filter((comment) => comment.author !== args.id);

      return true;
    } catch (error) {
      console.log("error =>", error);
    }
  },
  async updateUser(parent, args, { prisma }, info) {
    try {
      const { id, data } = args;

      const fieldsToUpdate = {};
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
          id,
        },
        data: fieldsToUpdate,
      });

      if (!user) {
        throw new Error("User not found");
      }

      return user;
    } catch (error) {
      console.log("error =>", error);
    }
  },
  async createPost(parent, args, { prisma, pubsub }, info) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: args.data.userId,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const post = await prisma.post.create({
        data: args.data,
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
      console.log("error=>", error);
    }
  },
  // deletePost(parent, args, { db, pubsub }, info) {
  //   const postIndex = db.posts.findIndex((post) => post.id === args.id);

  //   if (postIndex === -1) {
  //     throw new Error("Post not found");
  //   }

  //   const [post] = db.posts.splice(postIndex, 1);

  //   db.comments = db.comments.filter((comment) => comment.post !== args.id);

  //   if (post.published) {
  //     pubsub.publish("post", {
  //       post: {
  //         mutation: "DELETED",
  //         data: post,
  //       },
  //     });
  //   }

  //   return post;
  // },
  async updatePost(parent, args, { prisma, db, pubsub }, info) {
    const { id, data } = args;

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
        id,
      },
      data: fieldsToUpdate,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    // if (typeof data.published === "boolean") {
    //   fieldsToUpdate.published = data.published;

    //   if (originalPost.published && !post.published) {
    //     pubsub.publish("post", {
    //       post: {
    //         mutation: "DELETED",
    //         data: originalPost,
    //       },
    //     });
    //   } else if (!originalPost.published && post.published) {
    //     pubsub.publish("post", {
    //       post: {
    //         mutation: "CREATED",
    //         data: post,
    //       },
    //     });
    //   }
    // } else if (post.published) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "UPDATED",
    //       data: post,
    //     },
    //   });
    // }

    return post;
  },
  async createComment(parent, args, { prisma, db, pubsub }, info) {
    try {
      const userExists = await prisma.user.findUnique({
        where: {
          id: args.data.userId,
        },
      });
      const postExists = await prisma.post.findFirst({
        where: {
          id: args.data.postId,
          published: true,
        },
      });
      if (!userExists || !postExists) {
        throw new Error("Unable to find user and post");
      }
      const comment = await prisma.comment.create({
        data: args.data,
      });
      pubsub.publish(`comment ${args.data.postId}`, {
        comment: {
          mutation: "CREATED",
          data: comment,
        },
      });

      return comment;
    } catch (error) {
      console.log("error =>", error);
    }
  },
  async deleteComment(parent, args, { prisma, db, pubsub }, info) {
    try {
      const deletedComment = await prisma.comment.delete({
        where: {
          id: args.id,
        },
      });
      if (!deletedComment) {
        throw new Error("Comment not found");
      }
      // pubsub.publish(`comment ${deletedComment.post}`, {
      //   comment: {
      //     mutation: "DELETED",
      //     data: deletedComment,
      //   },
      // });

      return deletedComment;
    } catch (error) {
      console.log("error =>", error);
    }
  },
  async updateComment(parent, args, { prisma, db, pubsub }, info) {
    try {
      const { id, data } = args;
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
        throw new Error("Comment not found");
      }
      pubsub.publish(`comment ${comment.postId}`, {
        comment: {
          mutation: "UPDATED",
          data: comment,
        },
      });

      return comment;
    } catch (error) {
      console.log("error =>", error);
    }
  },
};

export { Mutation as default };
