import { IncomingMessage, ServerResponse } from "node:http";

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: Array<string>;
};

export type HandlerWithPathFunction = (
  req: IncomingMessage,
  res: ServerResponse,
  path: Array<string>
) => void;

export type HandlerFunction = (
  req: IncomingMessage,
  res: ServerResponse
) => void;
