import express from "express";
import { appRouter } from "./router/route";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", appRouter);

app.listen(3000, () => {console.log("Server running on PORT 3000")});
