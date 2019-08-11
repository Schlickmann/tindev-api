const api = require("../services/api");
const Developer = require("../models/Developers");

module.exports = {
  async index(req, res) {
    const { user } = req.headers;

    const loggedDev = await Developer.findById(user);

    const users = await Developer.find({
      $and: [
        { _id: { $ne: user } },
        { _id: { $nin: loggedDev.likes } },
        { _id: { $nin: loggedDev.dislikes } }
      ]
    });

    return res.json(users);
  },

  async store(req, res) {
    const { username } = req.body;
    username = username.toLowerCase();

    const devExists = await Developer.findOne({ user: username });

    if (devExists) {
      return res.json(devExists);
    }
    const response = await api.get(`/users/${username}`);

    const { name, bio, avatar_url: avatar } = response.data;

    const developer = await Developer.create({
      name,
      user: username,
      bio,
      avatar
    });

    return res.json(developer);
  }
};

// Index = show all; Show = show one; Update = update one; Delete = delete one;
