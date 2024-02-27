import express, { Router } from "express";
import connectDB from "./config/connectDB";
import { UserRouter } from "./routes/user.route";
import { MessageRouter } from "./routes/message.route";
const server = express();
const PORT = 8000;
const app = Router();
server.use(express.json());

server.use("/api/v1", app);
app.use("/users", UserRouter);
app.use("/messages", MessageRouter);
server.get("/", (req, res) => {
  res.send("Hello World");
});

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
