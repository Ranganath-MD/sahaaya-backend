const express = require("express");
const { Category } = require("../models/categoryModel");
const router = express.Router();

router.get("/", (_, res) => {
  Category.find()
    .then((result) => {
      res.send(result)
    })
    .catch(() => {
      res.send({ message: "Something went wrong: Can't find categories"})
    })
})

router.post("/", (req, res) => {
  const body = req.body;
  const category = new Category(body);
  category.save()
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})
router.delete("/:id", (req, res) => {
  const id = req.params.id
  Category.findByIdAndDelete(id)
    .then((result) => {
      res.send(result)
    })
    .catch((err) => {
      console.log(err)
    })
})

module.exports = {
    categoriesRouter : router
}

