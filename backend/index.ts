import express from "express";
import user from "./routes/user";
import admin from "./routes/admin";
import {prisma} from "./config/postgres";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());
// Use routes
app.use('/user', user);
app.use('/admin', admin);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
