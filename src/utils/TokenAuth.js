import jwt from "jsonwebtoken";

const generateAuthToken = async (userId) => {
  const token = await new Promise((resolve, reject) => {
    jwt.sign({ userId }, process.env.JWT_SECRET, function (err, token) {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
  return token;
};
const verifyAuthToken = async (request, prisma) => {
  const header = request?.request
    ? request.request.headers.get("authorization")
    : request.connection.context.get("Authorization");

  if (header && header.startsWith("Bearer")) {
    const token = header.split(" ")[1];
    console.log({ token });
    const tokenPayload = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      });
    });
    const userId = tokenPayload.userId;
    console.log({ userId });
    console.log({ tokenPayload });

    return await prisma.user.findUnique({ where: { id: userId } });
  }
  return null;
};

export { generateAuthToken, verifyAuthToken };
