import { IncomingMessage, ServerResponse } from "http";
import * as db from "../db";
import {
  InvalidIdError,
  InvalidRequestError,
  UserNotFoundError,
  WrongUserError,
  sendError,
} from "../utils/error";
import { HandlerFunction, HandlerWithPathFunction } from "../utils/types";

const readBody = async (req: IncomingMessage) => {
  return new Promise((resolve, reject) => {
    const body = [];
    req.on("data", (chunk: any) => {
      body.push(chunk);
    });
    req.on("end", () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyJSON = JSON.parse(bodyString);
      resolve(bodyJSON);
    });
    req.on("error", () => reject());
  });
};

export const router: HandlerWithPathFunction = async (req, res, path) => {
  console.log(`Request received ${req.method}:${req.url}`);
  console.log(path);
  switch (req.method) {
    case "GET":
      await get(req, res, path);
      break;
    case "POST":
      await post(req, res);
      break;
    case "PUT":
      await put(req, res, path);
      break;
    case "DELETE":
      await del(req, res, path);
      break;
    default:
      throw new InvalidRequestError();
  }
};

export const get: HandlerWithPathFunction = async (req, res, path) => {
  if (path.length === 0) {
    const users = db.getAllUsers();
    res.end(JSON.stringify(users));
    return;
  }

  const id = path.shift();
  if (!db.validateId(id)) {
    throw new InvalidIdError();
  }

  const user = await db.getUser(id);
  res.end(JSON.stringify(user));
};

export const post: HandlerFunction = async (req, res) => {
  readBody(req)
    .then((data: unknown) => {
      if (!db.validateUser(data)) {
        throw new WrongUserError();
      }
      return db.createUser(data);
    })
    .then((user) => {
      res.end(JSON.stringify(user));
    })
    .catch((error) => {
      sendError(res, error);
    });
};

export const put: HandlerWithPathFunction = async (req, res, path) => {
  const id = path.shift();
  if (!db.validateId(id)) {
    throw new InvalidIdError();
  }

  return readBody(req)
    .then((data: unknown) => {
      if (!db.validateUser(data)) {
        throw new WrongUserError();
      }
      return db.updateUser(id, data);
    })
    .then((user) => {
      res.end(JSON.stringify(user));
    })
    .catch((error) => {
      sendError(res, error);
    });
};

export const del: HandlerWithPathFunction = async (req, res, path) => {
  const id = path.shift();
  if (!db.validateId(id)) {
    throw new InvalidIdError();
  }

  db.deleteUser(id).then(() => {
    res.statusCode = 204;
    res.end("User deleted");
  });
};
