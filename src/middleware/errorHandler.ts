import HttpError from "../utils/httpError";

const errorHandler = (err: any, req: any, res: any, next: any) => {
  console.error(err.stack);

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      error: err.message,
    });
  }

  // Prisma errors
  if (err.code === "P2002") {
    return res.status(400).json({
      error: "A record with this information already exists",
    });
  }

  if (err.code === "P2025") {
    return res.status(404).json({
      error: "Record not found",
    });
  }

  // Default error
  res.status(500).json({
    error: "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { details: err.message }),
  });
};

export default errorHandler;
