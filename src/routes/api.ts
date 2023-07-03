import { router as userRouter } from "./users";
import { InvalidRequestError } from "../utils/error";

export const router = async (req, res, path) => {
  const nextPath = path.shift();
  switch (nextPath) {
    case "users":
      await userRouter(req, res, path);
      break;
    default:
      throw new InvalidRequestError();
  }
};
