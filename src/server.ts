// src/server.ts
import express, { Router } from "express";
import { createServer } from "http";
import { UserRouter } from "./routes/user.route";
import { MessageRouter } from "./routes/message.route";
import { blogRouter } from "./routes/blog.route";
import { commentRouter } from "./routes/comment.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import connectDB from "./config/connectDB";

const swaggerDocument = YAML.load("./src/config/swagger.yaml");
const corsOption = {
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5500",
    "https://my-brand-bankend.onrender.com",
  ],
  credentials: true,
};
export function configureApp(): express.Application {
  const app = express();

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(express.json());
  app.use(cors(corsOption));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));

  const apiRouter = Router();
  apiRouter.use("/users", UserRouter);
  apiRouter.use("/messages", MessageRouter);
  apiRouter.use("/blogs", blogRouter);
  apiRouter.use("/comments", commentRouter);

  app.use("/api/v1", apiRouter);

  app.get("/", (req, res) => {
    res.status(200).send("welcome to sage brand");
  });
  app.all("*", (req, res) => {
    res.status(404).json({
      message: "Route not found",
    });
  });

  return app;
}
//app.all route not found

const app = configureApp();
const PORT = process.env.PORT || 8000;
const server = createServer(app);

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

export { server };
