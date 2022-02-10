// marked library allows the creation ofmarkdown and turn it into HTML and slugify allows the conversion of the title into a URL friendly slug
// dompurify library allows us to sanitize our HTML to prevent the addition of malicious code
// jsdom allows the rendering of HTML inside Node.js
const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom"); //because we only need the JSDOM portion
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    //required: true
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, //or default: () => Date.now()
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
}); //use time stamps)

articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // converting markdown to HTML and purifying it
  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.marked(this.markdown));
  }

  next();
});

// To use the articleSchema. The article table is in the db with all the fields
module.exports = mongoose.model("Article", articleSchema);
