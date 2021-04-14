const multer = require("multer");

//Multer Setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const albumName = req.body.album.toLowerCase();
      // console.log(albumName);
      const path = "./albums/" + albumName;
      cb(null, path);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
  
var upload = multer({
    storage: storage,
  });
  
module.exports = { storage , upload}

  