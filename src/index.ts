import express from "express";

const app = express();

app.use(express.json());

app.get("/hello-world", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.listen(3000);
