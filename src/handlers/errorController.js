export default (err, req, res, next) => {
  console.log("err", err);
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
