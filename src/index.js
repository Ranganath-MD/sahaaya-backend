const express = require("express")
const socketIo = require("socket.io");
const http = require("http");
const cors = require("cors");
const { configureDB } = require("./configureDB");
const { socketConnection } = require("./utils/socketInit")
const { campaignRouter } =  require("./controllers/campaignController");
const { usersRouter } =  require("./controllers/usersController");
const app = express();
const server = http.createServer(app);

const io = socketIo(server,  {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ['websocket'],
    credentials: true
  },
  serveClient: true,
});
const { categoriesRouter } =  require("./controllers/categoryController");


io.on("connection", (socket) => {
  console.log("connected")
  socketConnection(socket)
})
// mongoose connection
configureDB();

// Initialize the express app
const port = process.env.PORT || 8080;

app.use(express.json());
app.options('*', cors())
app.use(cors());
app.use("/categories", categoriesRouter);
app.use("/campaign", campaignRouter);
app.use("/users", usersRouter);

//base route
app.get("/", (_, res) => {
  res.send("<h1>Sahaaya-backend</h1>");
});

server.listen(port, () => {
  console.log("listening on port", port);
});
