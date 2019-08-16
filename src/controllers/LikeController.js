const Developer = require("../models/Developers");
const Connection = require("../models/Connections");

module.exports = {
  async store(req, res) {
    const { user } = req.headers;
    const { dev_id } = req.params;

    const loggedDev = await Developer.findById(user);
    const targetDev = await Developer.findById(dev_id);

    if (!targetDev) {
      // 400 - bad request
      return res.status(400).json({ error: "Dev not exists" });
    }

    if (targetDev.likes.includes(loggedDev._id)) {
      const loggedSocket = await Connection.findOne({
        developer_id: loggedDev._id
      });
      const targetSocket = await Connection.findOne({
        developer_id: targetDev._id
      });

      if (loggedSocket) {
        req.io.to(loggedSocket.socket_id).emit("match", targetDev);
      }

      if (targetSocket) {
        req.io.to(targetSocket.socket_id).emit("match", loggedDev);
      }
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
