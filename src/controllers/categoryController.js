const express = require("express");
const { Category } = require("../models/categoryModel");
const router = express.Router();

router.get("/",  async (_, res) => {
  try {
    const result = await Category.find();
    res.send(result)
  }catch(err){
    res.send({ message: "Something went wrong: Can't find categories"})
  }
})

router.post("/", async (req, res) => {
  try {
    const body = req.body;
    const category = new Category(body);
    const result = await category.save();
    res.send(result);
  }catch(err) {
    res.send(err);
  }
})
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Category.findByIdAndDelete(id);
    res.send(result);
  }catch (err){
    res.send(err)
  }
})

module.exports = {
    categoriesRouter : router
}

