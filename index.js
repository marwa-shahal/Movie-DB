const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
app.use(express.json());

mongoose.set("strictQuery", false);

mongoose.connect(
  "mongodb+srv://admin:VWh6ABH43dCqt2do@cluster0.tzhvcg0.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const UserSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    default: 4,
  },
});

const movies = mongoose.model("User", UserSchema);

// const movies = [
//   { title: "Jaws", year: 1975, rating: 8 },
//   { title: "Avatar", year: 2009, rating: 7.8 },
//   { title: "Brazil", year: 1985, rating: 8 },
//   { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
// ];

app.get("/", (req, res) => {
  res.send("ok");
});
app.get("/test", (req, res) => {
  res.json({ status: 200, message: "Ok" });
});

app.get("/time", (req, res) => {
  const d = new Date();
  let hours = d.getHours();
  let minutes = d.getMinutes();
  res.json({ status: 200, message: `${hours}:${minutes}` });
});

app.get("/hello/:id", (req, res) => {
  res.json({ status: 200, message: "Hello," + req.params.id });
});

app.get("/search", (req, res) => {
  const search = req.query.s;
  typeof search != "undefined"
    ? res.json({ status: 200, message: "ok", data: search })
    : res.status(500).json({
        status: 500,
        error: true,
        message: "you have to provide a search",
      });
});

app.get("/movies/read", (req, res) => {
  //res.json({ status: 200, data: movies });
  movies
    .find()
    .then((moviesData) => {
      res.send({ status: 200, data: moviesData });
    })
    .catch((err) => {
      console.log("error");
    });
});

app.get("/movies/read/id/:id", (req, res) => {
  const id = req.params.id;
  id && id < movies.length
    ? movies
        .find()
        .then((moviesData) => {
          res.send({ status: 200, data: moviesData[id] });
        })
        .catch((err) => {
          console.log("error");
        })
    : res.status(404).send({
        status: 404,
        error: true,
        message: "the movie <ID> does not exist",
      });
});

app.get("/movies/read/by-date", (req, res) => {
  movies
        .find()
        .then((moviesData) => {
          res.send({ status: 200, data: movies.sort((a, b) => a.year - b.year) });
        })
        .catch((err) => {
          console.log("error");
        })
});

app.get("/movies/read/by-rating", (req, res) => {
  movies
        .find()
        .then((moviesData) => {
          res.send({ status: 200, data: movies.sort((a, b) => b.rating - a.rating) });
        })
        .catch((err) => {
          console.log("error");
        })
});

app.get("/movies/read/by-title", (req, res) => {
  movies
  .find()
  .then((moviesData) => {
    res.send({
      status: 200,
      data: movies.sort((a, b) => {
        let title_a = a.title.toUpperCase();
        let title_b = b.title.toUpperCase();
        let order = 0;
        title_a < title_b ? (order = -1) : (order = 1);
        return order;
      })})
  .catch((err) => 
    console.log("error")
  )
})
});
app.post("/movies/create", (req, res) => {
  req.query.rating ? req.query.rating : (req.query.rating = "4");
  let title = req.query.title;
  let year = req.query.year;
  let rating = req.query.rating;
  if (!title || !year || year.length != 4 || isNaN(year)) {
    res.send({
      status: 403,
      error: true,
      message: "you cannot create a movie without providing a title and a year",
    });
  } else {
    movies
      .create({
        title: title,
        year: parseInt(year),
        rating: parseInt(rating),
      })
      .then((newMovie) => {
        movies
          .find()
          .then((moviesData) => {
            res.send({ status: 200, data: moviesData });
          })
          .catch((err) => {
            console.log("error, no entry found");
          });
      })
      .catch((err) => {
        "error, connot create element";
      });
  }
});

app.put("/movies/update/:id", (req, res) => {
  let id = req.params.id;
  let title = req.query.title;
  let rating = req.query.rating;
  let year = req.query.year;
  title ? (movies[id - 1].title = title) : movies[id - 1].title;
  rating ? (movies[id - 1].rating = parseInt(rating)) : "";
  year ? (movies[id - 1].year = parseInt(year)) : "";
  res.json({ status: 200, data: movies });
});

app.delete("/movies/delete/:id", (req, res) => {
  let id = req.params.id;
  if (id > movies.length) {
    res.status(404).send({
      status: 404,
      error: true,
      message: "the movie <ID> does not exist",
    });
  } else {
    movies.splice(id - 1, 1);
    res.json({ status: 200, data: movies });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


