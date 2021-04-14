const path = require("path");
const fs = require("fs");

var albumName,fileName,filePath;
var albumPath = path.join(__dirname, '../albums/');


//return single photo
exports.singlePhoto = function(req , res){
    
        try {
                albumName = req.params.albumName;
                fileName = req.params.fileName;
               
                filePath = albumPath+ albumName + "/" + fileName;

               if (fs.existsSync(filePath)) 
                {
                     res.sendFile(filePath);
                } 
                else 
                {
                    res.send({status:"Error",message:"File does not exist"});
                }
            } 
        catch (error) {
                    res.send({status:"Error",message:error});
                }    
}

//Upload Multiple Photos
exports.multipleFiles = async function(req , res) {
  var files = [];
  var resData = [];
  var localPath,photoDescription;

        try{
                albumName = req.body.album;
                files = req.files;
                for(let i =0;i<files.length;i++)  
                {
                    fileName = files[i].filename;
                    filePath = albumPath + albumName + "/" + fileName;
                    localPath = "http://localhost:8888/photos/" + albumName+"/"+fileName;
                    photoDescription = 
                    {
                        album: albumName,
                        name: fileName,
                        path: filePath,
                        raw: localPath,
                    };
                    resData.push(photoDescription);
                }
                res.send({ message: "OK", data: resData });
            }
        catch(error)
            {
                res.send({message:"Error",data:error})    
            }
}
//Return all Photos
exports.allPhotos = function(req , res){
    var resData = [];
    var count = 0;
    var limit = req.body.limit ;
    var skip = req.body.skip;

    var albumFolders =[];
    var filesInAlbum = [];
    var arrayOfFiles = [];
    var albumName;
    var newFile;

    albumFolders = fs.readdirSync("./albums")     
    for(let i =0;i<albumFolders.length;i++)
    {
        if(fs.statSync("./albums/"+albumFolders[i]).isDirectory())  
        {      
            filesInAlbum = fs.readdirSync("./albums/"+albumFolders[i]);
            for(let j=0;j<filesInAlbum.length;j++)
            {   if(skip ===0)
                {
                        if(count<limit)
                        {
                                    arrayOfFiles.push(path.join(__dirname, "./albums", "/", filesInAlbum[j]));
                                    albumName = path.basename("./albums/"+albumFolders[i]);
                                    albumName =  albumName.charAt(0).toUpperCase() + albumName.slice(1);
                                    newFile = 
                                    {
                                        id:(Math.floor(Math.random() * 100000)).toString(),
                                        album: albumName,
                                        name: filesInAlbum[j],
                                        path: "/albums/" + albumName + "/" + filesInAlbum[j],
                                        raw:"http://localhost:8888/photos/" +albumFolders[i] +"/" +filesInAlbum[j],
                                    };
                                    resData.push(newFile);
                                    count++;
                        }
                        else
                        {
                                break;
                        }
                }
                else
                {
                      skip--;
                }
            }
         }
     }
  res.send({ message: "ok", documents: resData });
}

//Delete Single Photo
exports.deleteSinglePhoto = function(req , res){
    albumName = req.params.albumName;
    fileName = req.params.fileName;

    filePath = albumPath + albumName + "/" + fileName;
    try
    {           
                fs.unlink(filePath, (error) => {
                if (error) {
                res.send({status:"Error",message: "File does not exist!"});
                } else {
                res.send({ status:"Success",message: "OK" });
                }
            });
    }
    catch(error)
    {
                res.send({ status:"Error",message: error });
    }
  
}
//Delete multiple Photo
exports.deleteMultiplePhoto = function(req , res){
    
  var items = [];
  items = req.body;
  var singleScopeData; 
            for(let i =0;i<items.length;i++) 
            {
                 albumName = items[i].album;
                 filePath = albumPath+ albumName;
                  if (items[i].documents.includes(',')) 
                    {
                                        singleScopeData = items[i].documents.split(",");
                                        for(let j=0;j<singleScopeData.length;j++)
                                        {
                                            singleScopeData[j] = singleScopeData[j].trim();

                                            try 
                                            {
                                                fs.unlinkSync(filePath + "/" + singleScopeData[j]);
                                            } 
                                            catch (error) 
                                            {
                                                res.send({ status:"Error",message: "Check the path or the file" });
                                            }
                                        }
                    } 
                    else
                        {
                                        try 
                                        {
                        
                                             fs.unlinkSync(filePath + "/" + items[i].documents);
                                        } 
                                        catch (error) 
                                        {
                                            res.send({ status:"Error",message: "Check the path or the file" });
                                        }
                        }
            }
            res.send({ status:"Deleted",message: "Files are Deleted" });
}


