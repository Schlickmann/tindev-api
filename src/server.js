require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Connection = require("./models/Connections");

class Server {
  constructor() {
    this.app = express();
    this.server = require("http").Server(this.app);
    this.io = require("socket.io")(this.server);
    this.isDev = process.env.NODE_ENV !== "production";

    this.connectDatabase();
    this.middlewares();
    this.routes();
  }

  connectDatabase() {
    mongoose.connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${
        process.env.DB_PASSWORD
      }@schlickmannapps-unyax.mongodb.net/omnistack8?retryWrites=true&w=majority`,
      { useNewUrlParser: true }
    );
  }

  middlewares() {
    this.io.on("connection", async socket => {
      let connection = null;
      const { developer } = socket.handshake.query;

      const devExists = await Connection.findOne({ developer_id: developer });

      if (devExists) {
        connection = await devExists.update({
          socket_id: socket.id
        });
      } else {
        connection = await Connection.create({
          developer_id: developer,
          socket_id: socket.id
        });
      }
    });

    this.app.use((req, res, next) => {
      req.io = this.io;

      return next();
    });

    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  routes() {
    // make the server use the routes defined in routes.js
    this.app.use(require("./routes"));
  }
}

module.exports = new Server().server;
