const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;

const app = express();

mongoose
  .connect("mongodb://localhost:27017/blogs")
  // .connect("mongodb://localhost/blogs")
  // .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to the db..!!");
  })
  .catch((error) => {
    console.log("Something went wrong..", error);
  });

const User = mongoose.model(
  "users",
  new mongoose.Schema({
    id: Number,
    name: String,
    email: String,
    password: String,
    phone: String,
    website: String,
  })
);

app.get("/api/users", async (req, res) => {
  const { email, password } = req.query;
  const users = await User.find(email && password ? { email, password } : {});
  res.send(users);
});
app.get("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ id });
  if (user) {
    res.send(user);
  } else {
    res.status(404).send({ message: "User not Found!" });
  }
});

app.post("/api/users", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res.send({ message: "Data is required." });
  }
  const user = new User(req.body);
  const createdUser = await user.save();
  res.send(createdUser);
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { email, name, phone, password, website } = req.body;
  const user = await User.findOne(id);
  if (user) {
    user.email = email;
    user.name = name;
    user.phone = phone;
    user.password = password;
    user.website = website;
    const updatedUser = await user.save();
    res.send(updatedUser);
  } else {
    res.status(404)({ message: "User not found!" });
  }
});

//POST
const Post = mongoose.model(
  "posts",
  new mongoose.Schema(
    {
      id: Number,
      title: String,
      body: String,
      userId: Number,
    },
    {
      timestamps: true,
    }
  )
);
app.get("/api/posts", async (req, res) => {
  const { userId } = req.query;
  const posts = await Post.find(userId ? { userId } : {});
  res.send(posts);
});
app.get("/api/posts/:id", async (req, res) => {
  const { id } = req.params;
  const post = await Post.findOne({ id });
  if (post) {
    res.send(post);
  } else {
    res.status(404).send({ message: "Post not Found!" });
  }
});
app.post("/api/posts", async (req, res) => {
  if (!req.body.title || !req.body.body) {
    return res.send({ message: "Data is required." });
  }
  const post = new Post(req.body);
  const createdPost = await post.save();
  res.send(createdPost);
});

app.get("/api/seed", async (req, res) => {
  await User.deleteMany();
  await User.insertMany([
    {
      id: 1,
      name: "Leanne Graham",
      email: "Sincere@april.biz",
      password: "123",
      phone: "1231-23123-3213-123-131",
      website: "https://notmywebsite.com",
    },
  ]);
  await Post.deleteMany();
  await Post.insertMany([
    {
      id: 1,
      title: "Hellooo!!",
      body: "Welcome to my Awesomeness",
      userId: 1,
    },
  ]);
  res.send({ message: "seeded successfully" });
});

// const dirname = path.resolve();
// app.use("/", express.static(dirname + "/build"));
// app.get("/", (req, res) => res.sendFile(dirname + "/build/index.html"));

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
