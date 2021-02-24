const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const categorySchema = new Schema({
  title: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = {
    Category
}
