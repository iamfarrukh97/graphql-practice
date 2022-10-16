import { hashPassword } from "./passwordhashing.js";

const createAdmin = async (prisma) => {
  const adminExists = await prisma.user.findUnique({
    where: {
      email: "hokage@gmail.com",
    },
  });
  if (!adminExists) {
    const adminToCreate = {
      name: "Hokage",
      email: "hokage@gmail.com",
      role: "ADMIN",
    };
    const password = await hashPassword("admin12@");
    await prisma.user.create({
      data: { ...adminToCreate, password },
    });
  }
};

export { createAdmin as default };
