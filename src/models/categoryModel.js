const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const categorySchema = new Schema({
  key : {
    type: String
  },
  title: {
    type: String,
  },
  description: {
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
