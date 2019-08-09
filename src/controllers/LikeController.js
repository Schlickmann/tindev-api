const Developer = require("../models/Developers");

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
      console.log("Match");
    }

    loggedDev.likes.push(targetDev._id);

    await loggedDev.save();

    return res.json(loggedDev);
  }
};
