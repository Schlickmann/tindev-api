const express = require("express");
const DeveloperController = require("./controllers/DeveloperController");
const LikeController = require("./controllers/LikeController");
const DislikeController = require("./controllers/DislikeController");
const routes = express.Router();

routes.get("/devs", DeveloperController.index);
routes.post("/devs", DeveloperController.store);

routes.post("/devs/:dev_id/likes", LikeController.store);
routes.post("/devs/:dev_id/dislikes", DislikeController.store);

module.exports = routes;
