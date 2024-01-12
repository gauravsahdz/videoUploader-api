const VideoSchema = require("../models/VideoModel");
const fs = require("fs");
const path = require("path");

const createSubtitleFile = require("../middlewares/createSubtitleFile");

exports.addVideo = async (req, res) => {
  const { title, description } = req.body;
  const slug = title.toLowerCase().split(" ").join("-");
  const videoPath = req.file.path;
  const subtitleUrl = req.subtitlesFilePath
    ? req.subtitlesFilePath.replace("public", "")
    : null;
  const subtitleFilename = subtitleUrl ? subtitleUrl.split("\\").pop() : null;

  const video = new VideoSchema({
    title,
    slug,
    description,
    filename: req.file.filename,
    videoUrl: videoPath,
    subtitleUrl,
    subtitleFilename,
  });

  try {
    await video.save();
    res.status(200).json({
      message: "Video Uploaded Successfully",
      video,
    });
  } catch (error) {
    res.status(400).json({
      message: "Video upload failed",
      error,
    });
  }
};

exports.getAllVideos = async (req, res) => {
  try {
    const videos = await VideoSchema.find({});
    res.status(200).json({
      videos,
    });
  } catch (error) {
    res.status(400).json({
      message: "Videos fetch failed",
      error,
    });
  }
};

exports.updateSubtitle = async (req, res) => {
  try {
    const video = await VideoSchema.findById(req.params.id);
    const subtitleFilename = video.subtitleFilename;

    // Check if the subtitle file with the given filename exists
    const subtitleFilePath = path.join(
      __dirname,
      `../public/subtitles/${subtitleFilename}`
    );

    const subtitleFile = fs.readFileSync(subtitleFilePath, "utf-8");
    const subtitleFileArray = subtitleFile.split("\n");
    let count = 1;

    for (let i = 0; i < subtitleFileArray.length; i++) {
      const existingLine = subtitleFileArray[i].trim();

      // Check if the line is the header or empty, and push it unchanged
      if (
        existingLine === "" ||
        existingLine.startsWith("WEBVTT") ||
        existingLine.includes("-->")
      ) {
        continue; // Skip empty lines, lines with timestamps, and the header
      }

      // Increment the count only when encountering a line with a number
      count++;
    }

    // Append the new timestamp range and subtitle from req.body at the end
    const newSubtitleContent = `\n${count}\n${req.body.timestampRange},\n${req.body.subtitle}\n`;
    fs.appendFileSync(subtitleFilePath, newSubtitleContent);

    res.status(200).json({
      message: "Subtitle updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
