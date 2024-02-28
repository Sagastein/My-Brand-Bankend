import express, { Router } from "express";
import connectDB from "./config/connectDB";
import { UserRouter } from "./routes/user.route";
import { MessageRouter } from "./routes/message.route";
import { blogRouter } from "./routes/blog.route";
import { commentRouter } from "./routes/comment.route";
const server = express();
const PORT = 8000;

server.use(express.json());
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
