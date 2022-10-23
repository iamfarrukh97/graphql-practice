import { GraphQLYogaError } from "@graphql-yoga/node";
import { Prisma } from "@prisma/client";
export default (error) => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    throw new GraphQLYogaError(`prisma error`);
  } else {
    const { errorMessage } = error;
    throw new GraphQLYogaError(errorMessage);
  }
  //   if (thrownThing instanceof ApolloError) {
  //     // expected errors
  //     return thrownThing
  //   }
  //   if (thrownThing instanceof Error) {
  //     // unexpected errors
  //     console.error(thrownThing)
  //     await Sentry.report(thrownThing)
  //     return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
  //   }
  //   // what the hell got thrown
  //   console.error('The resolver threw something that is not an error.')
  //   console.error(thrownThing)
  //   return new ApolloError('Internal server error', 'ERR_INTERNAL_SERVER')
  // err.statusCode = err.statusCode || 500;
  // err.status = err.status || 'error';
  // if (process.env.NODE_ENV === 'development') {
  //   sendErrDev(err, res);
  // } else {
  //   let error = { ...JSON.parse(JSON.stringify(err)) };
  //   if (error.name === 'CastError') error = handleCastErrorDB(error);
  //   if (error.code === 11000) error = handleDuplicateErrorDB(error);
  //   if (error.name === 'ValidationError')
  //     error = handleValidationErrorDB(error);

  //   sendErrProd(error, res);
  // }
};
