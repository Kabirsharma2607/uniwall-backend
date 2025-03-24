import express from "express";

const app = express();

app.use(express.json());

app.get("/hello-world", (req, res) => {
  res.json({
    message: "Hello world",
  });
});

app.post("/hello-world", (req, res) => {
  const body = req.body;

  console.log(body);

  res.send("working");
});

app.listen(3000);
