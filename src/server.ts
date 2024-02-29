import express, { Router } from "express";
import connectDB from "./config/connectDB";
import { UserRouter } from "./routes/user.route";
import { MessageRouter } from "./routes/message.route";
import { blogRouter } from "./routes/blog.route";
import { commentRouter } from "./routes/comment.route";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
const swaggerDocument = YAML.load("./src/config/swagger.yaml");
const server = express();
const PORT = 8000;
server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
server.use(express.json());
server.use(cors());
server.use(bodyParser.json());
server.use(cookieParser());
server.use(express.urlencoded({ extended: true }));
const app = Router();
server.use("/api/v1", app);
app.use("/users", UserRouter);
app.use("/messages", MessageRouter);
app.use("/blogs", blogRouter);
app.use("/comments", commentRouter);
server.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
