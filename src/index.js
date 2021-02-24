const express = require("express")
const { configureDB } = require("./configureDB");
const cors = require("cors");
const { categoriesRouter } =  require("./controllers/categoryController");
const { usersRouter } =  require("./controllers/usersController");

// mongoose connection
configureDB();

// Initialize the express app
const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(cors());
app.use("/categories", categoriesRouter);
app.use("/users", usersRouter);

//base route
app.get("/", (_, res) => {
  res.send("<h1>Sahaaya-backend</h1>");
});

app.listen(port, () => {
  console.log("listening on port", port);
});
