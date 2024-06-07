import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Server is Ready and Started");
});
app.get("/api/jokes", (req, res) => {
  const jokes = [
      {
          id: 1,
          name: '1st joke',
          content: "this is first joke"
      },
      {
          id: 2,
          name: '2nd joke',
          content: "this is second joke"
      },
      {
          id: 3,
          name: '3rd joke',
          content: "this is third joke"
      },
      {
          id: 4,
          name: '4th joke',
          content: "this is fourth joke"
      },
      {
          id: 5,
          name: '5th joke',
          content: "this is fifth joke"
      }
  ]

  res.send(jokes);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Serve at http:localhost:${port}`);
});
