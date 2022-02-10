const express = require("express");
const res = require("express/lib/response");
const Article = require("./../models/article");
const mongoose = require("mongoose");

// to give a router that can be used to create views
const router = express.Router();

router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});
// creating a route for successful save
router.get("/articles/:slug", async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug }); //find outputs an array of articles.
  //only return the fields you need instead of the whole object

  if (article == null) res.redirect("/");
  res.render("articles/show", { article: article });
});

router.post(
  "/",
  async (req, res, next) => {
    console.log(req.body);
    req.article = new Article();
    console.log(req.body);
    res.path = "new";
    next();
  },
  saveArticleAndRedirect
);

router.put(
  "/:id",
  async (req, res, next) => {
    //Use mongoose method to convert the ID string to ObjectID data type
    console.log(req.params.id);
    const postId = mongoose.Types.ObjectId(req.params.id);
    console.log(postId);
    req.article = await Article.findById(postId);
    res.path = "edit";
    next();
    //This is af middleware
  },
  saveArticleAndRedirect
);

// Since forms allow get/post the method actions and links only get, the method-ovveride library allows the overriding the method the form
router.delete("/:id", async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

async function saveArticleAndRedirect(req, res) {
  // return  async (req, res) => {
  const path = req.path;
  let article = req.article;
  console.log("Here too");
  // const article = new Article()
  article.title = req.body.title;
  article.description = req.body.description;
  article.markdown = req.body.markdown;

  console.log(article);

  try {
    // An assynchronous function.
    // updating the article with the new saved article
    await article.save();
    // console.log("Here too")
    // res.send("Success")
    // res.redirect(`/articles/${article.slug}`)
    res.redirect("/");
  } catch (e) {
    // res.render(`articles/${path}`, { article: article })
    console.log(e);
    res.send("Another one");
  }
}
// }

module.exports = router;
