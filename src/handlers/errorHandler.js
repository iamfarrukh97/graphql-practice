class AppError extends Error {
  constructor(error) {
    super(error);
    this.errorMessage = error;
  }
}

export { AppError as default };
