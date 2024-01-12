const fs = require("fs");
const path = require("path");

exports.createSubtitleFile = (req, res, next) => {
  try {
    const videoFileName = req.file.filename;
    const subtitlesFileName = `subtitles_${path.parse(videoFileName).name}.vtt`;

    const rootDir = path.dirname(require.main.filename);
    const subtitlesFilePath = path.join(
      rootDir,
      "public/",
      "subtitles",
      subtitlesFileName
    );

    // Create an empty WebVTT file
    fs.writeFileSync(subtitlesFilePath, "WEBVTT\n\n");

    // Add the subtitles file path to the request object for later use
    req.subtitlesFilePath = subtitlesFilePath;

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
