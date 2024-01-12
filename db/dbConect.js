const mongoose = require("mongoose");

exports.dbConnection = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(process.env.MONGO_URL + "videoUploader")
    .then(() => {
      console.log("Db Connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
