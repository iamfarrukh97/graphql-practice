import bcrypt from "bcryptjs";

const hashPassword = async (password) => {
  if (password.length < 4) {
    throw new Error("Password is too short");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
};

const verifyPassword = async (enteredPassword, hashPassword) => {
  const verify = await bcrypt.compare(enteredPassword, hashPassword);
  return verify;
};

export { hashPassword, verifyPassword };
