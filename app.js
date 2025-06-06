import express from "express";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
const JWT_SECRET = "fhjagjaglajgjkg";
const users = [];
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});
app.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (users.find((user) => user.username === username)) {
    return res.status(400).send("User already exists");
  }

  users.push({
    username: username,
    password: password,
  });
    console.log(users);
  res.json({
    message: "user created successfully",
  });
});
app.post("/signin", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let foundUser = users.find((user) => {
    if (user.username === username && user.password === password) return true;
  });
  if (foundUser) {
    const token = jwt.sign(
      {
        username: foundUser.username,
      },
      JWT_SECRET
    );
    res.json({
      message: "user signed in successfully",
      token: token,
    });
  } else {
    res.status(400).send("Invalid username or password");
  }
});
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.username = decoded.username;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
}

app.get("/me", auth, (req, res) => {
  const userfound = users.find((user) => user.username === req.username);
  if (userfound) {
    res.json({
      username: userfound.username,
      message: "user found successfully",
    });
  } else {
    res.status(404).send("User not found");
  }
});
app.listen(3000, () => {
  console.log("server is running on port 3000");
});
