const Post = {
  async user(parent, args, { prisma }, info) {
    const user = await prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
    return user;
  },
  async comments(parent, args, { prisma }, info) {
    const comments = await prisma.comment.findMany({
      where: {
        postId: parent.id,
      },
    });
    return comments;
  },
};

export { Post as default };
