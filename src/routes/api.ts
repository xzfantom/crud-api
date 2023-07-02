import { router as userRouter } from "./users";
import { InvalidRequestError } from "./error";

export const router = (req, res, path) => {
  const nextPath = path.shift();
  switch (nextPath) {
    case "users":
      userRouter(req, res, path);
      break;
    default:
      throw new InvalidRequestError();
  }
};
