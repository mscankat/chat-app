const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = 3001;

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow requests from this origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE"); // Allow specific HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "*"); // Allow specific headers
  next();
});

app.post("/", async (req, res) => {
  const code = req.body.code;
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const tokenUrl = `https://github.com/login/oauth/access_token`;
  const userURL = "https://api.github.com/user";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
    }),
  };

  const response = await fetch(tokenUrl, options);
  const data = await response.json();
  console.log(data);
  res.json(data.access_token);

  // const user = await fetch(userURL, {
  //   headers: {
  //     Authorization: `Bearer ${data.access_token}`,
  //   },
  // });
  // const userData = await user.json();
  // console.log(userData);

  // res.json(userData);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
