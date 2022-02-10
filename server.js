const express = require("express");
const mongoose = require("mongoose");
const Article = require("./models/article");
const articleRouter = require("./routes/articles");
const methodOverride = require("method-override");
const app = express();

mongoose.connect("mongodb://localhost/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
 console.log("Database Connected!")
);

//seting up the view engine to ejs wich is writing all views. View engine converts the ejs code to HTML.
app.set("view engine", "ejs");

//  access all the different parameters from the articles form inside the article route in server.js. Has to be set before the articleRouter is used.
app.use(express.urlencoded({ extended: false }));

//  When the parameter _method is set in any form situation, it will ovveride the method
app.use(methodOverride("_method"));

//arrow function where the left part denotes the input of a function and the right part the output of that function.
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });

  // to access the views folder and pass all different articles using an object.
  res.render("articles/index", { articles: articles });
});

//articles will be included in the URL path
app.use("/articles", articleRouter);

app.listen(8080);
