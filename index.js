const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");

const conversationRoute=require("./routes/conversation");
const messageRoute=require("./routes/message");
const multer=require("multer");
const path=require("path")

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(() => {
    console.log("Db connected");
}).catch((e) => {
    console.log("No connection");
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});


//middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

/routes
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);

app.get("/", (req, res) => {
    res.send("Welcome to home page");
});

app.get("/users", (req, res) => {
    res.send("Welcome to users app");
});

app.listen(8800, () => {
    console.log("Server is running");
})
