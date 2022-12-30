const express = require("express");
const app = express();
const port = 3000;
const movies = [
  { title: "Jaws", year: 1975, rating: 8 },
  { title: "Avatar", year: 2009, rating: 7.8 },
  { title: "Brazil", year: 1985, rating: 8 },
  { title: "الإرهاب والكباب‎", year: 1992, rating: 6.2 },
];

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
  res.json({ status: 200, data: movies });
});

app.get("/movies/read/id/:id", (req, res) => {
  const id = req.params.id;
  id && id < movies.length
    ? res.json({ status: 200, data: movies[id] })
    : res.status(404).json({
        status: 404,
        error: true,
        message: "the movie <ID> does not exist",
      });
});

app.get("/movies/read/by-date", (req, res) => {
  res.json({ status: 200, data: movies.sort((a, b) => a.year - b.year) });
});

app.get("/movies/read/by-rating", (req, res) => {
  res.json({ status: 200, data: movies.sort((a, b) => b.rating - a.rating) });
});

app.get("/movies/read/by-title", (req, res) => {
  res.json({
    status: 200,
    data: movies.sort((a, b) => {
      let title_a = a.title.toUpperCase();
      let title_b = b.title.toUpperCase();
      let order = 0;
      title_a < title_b ? (order = -1) : (order = 1);
      return order;
    }),
  });
});

app.get("/movies/create", (req, res) => {
  req.query.rating ? req.query.rating : (req.query.rating = "4");
  let title = req.query.title;
  let year = req.query.year;
  let rating = req.query.rating;
  !title || !year || year.length != 4 || isNaN(year)
    ? res.json({
        status: 403,
        error: true,
        message:
          "you cannot create a movie without providing a title and a year",
      })
    : movies.push({
        title: title,
        year: parseInt(year),
        rating: parseInt(rating),
      })
      res.json({ status: 200, data: movies });
});

app.get("/movies/update", (req, res) => {});

app.get("/movies/delete", (req, res) => {});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
