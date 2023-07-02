import { IncomingMessage, ServerResponse } from "http";
import * as db from "../db";
import {
  InvalidIdError,
  InvalidRequestError,
  UserNotFoundError,
  WrongUserError,
  sendError,
} from "./error";

export const router = (
  req: IncomingMessage,
  res: ServerResponse,
  path: Array<string>
) => {
  console.log(`Request received ${req.method}:${req.url}`);
  console.log(path);
  switch (req.method) {
    case "GET":
      get(req, res, path);
      break;
    case "POST":
      post(req, res);
      break;
    case "PUT":
      put(req, res, path);
      break;
    case "DELETE":
      del(req, res, path);
      break;
    default:
      throw new InvalidRequestError();
  }
};

export const get = (
  req: IncomingMessage,
  res: ServerResponse,
  path: Array<string>
) => {
  if (path.length === 0) {
    const users = db.getAllUsers();
    res.end(JSON.stringify(users));
    return;
  }

  const id = path.shift();
  if (!db.validateId(id)) {
    throw new InvalidIdError();
  }

  const user = db.getUser(id);
  if (!user) {
    throw new UserNotFoundError();
  }

  res.end(JSON.stringify(user));
};

export const post = (req: IncomingMessage, res: ServerResponse) => {
  new Promise((resolve, reject) => {
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
  })
    .then((data: unknown) => {
      if (db.validateUser(data)) {
        const user = db.createUser(data);
        res.end(JSON.stringify(user));
      } else throw new WrongUserError();
    })
    .catch((error) => {
      sendError(res, error);
    });
};

export const put = (
  req: IncomingMessage,
  res: ServerResponse,
  path: Array<string>
) => {
  const id = path.shift();
  if (!db.validateId(id)) {
    throw new InvalidIdError();
  }

  new Promise((resolve, reject) => {
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
  })
    .then((data: unknown) => {
      if (db.validateUser(data)) {
        const user = db.updateUser(id, data);
        res.end(JSON.stringify(user));
      } else throw new WrongUserError();
    })
    .catch((error) => {
      sendError(res, error);
    });
};

export const del = (
  req: IncomingMessage,
  res: ServerResponse,
  path: Array<string>
) => {
  const id = path.shift();
  if (!db.validateId(id)) {
    throw new InvalidIdError();
  }

  db.deleteUser(id);
  res.statusCode = 204;
  res.end("User deleted");
};
