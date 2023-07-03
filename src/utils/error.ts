export class CustomError extends Error {
  code: number;

  constructor(message = "Internal server error", code = 500) {
    super(message);
    this.code = code;
  }
}

export class InvalidIdError extends CustomError {
  constructor() {
    super("Invalid id", 400);
  }
}

export class UserNotFoundError extends CustomError {
  constructor() {
    super("User not found", 404);
  }
}

export class WrongUserError extends CustomError {
  constructor() {
    super("Wrong required fields", 400);
  }
}

export class InvalidRequestError extends CustomError {
  constructor() {
    super("Invalid request", 404);
  }
}

export const sendError = (res, error: CustomError) => {
  console.log(`Error ${error.code}: ${error.message}`);
  res.writeHead(error.code);
  res.end(error.message);
};
