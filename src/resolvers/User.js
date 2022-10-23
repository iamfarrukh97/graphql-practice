const User = {
  async posts(parent, args, { prisma }, info) {
    const posts = await prisma.post.findMany({
      where: {
        userId: parent.id,
      },
    });
    return posts;
  },
  async comments(parent, args, { prisma }, info) {
    const comments = await prisma.comment.findMany({
      where: {
        userId: parent.id,
      },
    });
    return comments;
  },
};

export { User as default };
