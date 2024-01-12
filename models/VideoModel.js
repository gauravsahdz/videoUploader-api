const mongoose = require("mongoose");

const VideoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    videoUrl: {
      type: String,
      trim: true,
      required: true,
    },
    subtitleUrl: {
      type: String,
      trim: true,
    },
    subtitleFilename: {
      type: String,
      trim: true,
    },
    filename: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MyVideos", VideoSchema);
