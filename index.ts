import express from "express";
import routes from './routes/user';
import {prisma} from "./config/postgres";
const app = express();
app.use(express.json());

// Use routes
app.use('/user', routes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
