const {
  addVideo,
  getAllVideos,
  updateSubtitle,
} = require("../controllers/video");
const { createSubtitleFile } = require("../middlewares/createSubtitleFile");
const { videoUpload } = require("../middlewares/videoUpload");

const router = require("express").Router();

router
  .post("/upload", videoUpload.single("video"), createSubtitleFile, addVideo)
  .get("/videos", getAllVideos);

router.patch("/videos/:id", updateSubtitle);
module.exports = router;
