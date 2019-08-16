const { Schema, model } = require("mongoose");

const ConnectionSchema = new Schema(
  {
    developer_id: {
      type: Schema.Types.ObjectId,
      ref: "Developer"
    },
    socket_id: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = model("Connection", ConnectionSchema);
