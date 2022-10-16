import { GraphQLYogaError } from "@graphql-yoga/node";

class AppError extends Error {
  constructor(error) {
    console.log("=>", { error });
    if (error?.message) {
      return Promise.reject(new GraphQLYogaError(error.message));
    } else {
      return Promise.reject(new GraphQLYogaError(error));
    }
    // super(error.message);

    // this.code = error.code;
    // // this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // this.isOperational = true;

    // Error.captureStackTrace(this, this.constructor);
    // if (error.code === "P2002") {
    //   return Promise.reject(
    //     new GraphQLYogaError(
    //       `Cannot post comment on non-existing link with id '.`
    //     )
    //   );
    // }
  }
}

export { AppError as default };
