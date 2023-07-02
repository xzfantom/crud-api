import {
  createServer as createServerHttp,
  IncomingMessage,
  ServerResponse,
} from "http";
import dotenv from "dotenv";
import { router as apiRouter } from "./routes/api";
import { CustomError, sendError } from "./routes/error";

dotenv.config();

const { PORT } = process.env;
const port = PORT ?? 4000;

const requestListener = (req: IncomingMessage, res: ServerResponse) => {
  try {
    console.log("Request received", req.url);
    const fullPath = req.url.slice(1).split("/");
    const path = fullPath.shift();
    console.log(fullPath, path);
    switch (path) {
      case "api":
        apiRouter(req, res, fullPath);
        break;
      default:
        res.writeHead(404);
        res.end("Not Found");
    }
  } catch (error) {
    const err = error instanceof CustomError ? error : new CustomError();
    sendError(res, err);
  }
};

const server = createServerHttp(requestListener);

server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
