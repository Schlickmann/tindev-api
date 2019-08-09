require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

class Server {
  constructor() {
    this.express = express();
    this.isDev = process.env.NODE_ENV !== "production";

    this.middlewares();
    this.connectDatabase();
    this.routes();
  }

  middlewares() {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
  }

  connectDatabase() {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${
        process.env.DB_PASSWORD
      }@schlickmannapps-unyax.mongodb.net/omnistack8?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    );
  }

  routes() {
    // make the server use the routes defined in routes.js
    this.express.use(require("./routes"));
  }
}

module.exports = new Server().express;
