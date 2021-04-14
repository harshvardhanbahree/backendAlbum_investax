const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const storage = require('./config/storage');//multer
const app = express();
const albumAPI = require('./controllers/routes')


app.use(cors());

app.use(bodyParser.json());

module.exports = app;


//**Return a single photo 
app.get("/photos/:albumName/:fileName",albumAPI.singlePhoto);

//**Upload multiple files 
app.put("/photos", storage.upload.array("documents", 12),albumAPI.multipleFiles);

//** Returns all photos  
app.post("/photos/list",albumAPI.allPhotos);

//**Delete a Single Photo 
app.delete("/photos/:albumName/:fileName",albumAPI.deleteSinglePhoto);

//**Delete Multiple Photos 
app.delete("/photos", albumAPI.deleteMultiplePhoto);



app.listen(8888, function () {
  console.log("Server is running on port 8888");
});
