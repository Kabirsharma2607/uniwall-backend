import express from "express";
import { appRouter } from "./router/route";

const app = express();

app.use(express.json());

// app.use(middleware)

app.use("/api/v1", appRouter);

// app.get("/api/v1/get-user", (req, res) => {
//   res.json({
//     name: "Kabir",
//     age: 12,
//   });
// });

// app.post("/hello-world", (req, res) => {
//   const body = req.body;

//   console.log(body);

//   res.send();
// });

app.listen(3000);
