const Comment = {
  async user(parent, args, { prisma }, info) {
    const user = await prisma.user.findUnique({
      where: {
        id: parent.userId,
      },
    });
    return user;
  },
  async post(parent, args, { prisma }, info) {
    const post = await prisma.post.findUnique({
      where: {
        id: parent.postId,
      },
    });
    return post;
  },
};

export { Comment as default };
