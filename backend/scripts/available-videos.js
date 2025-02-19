"use strict"; 
const path = require("path");
const FileSystem = require("fs"); 
const { v4: uuidv4 } = require("uuid");

let available_videos_path = "data/available-videos.json";
const available_videos  = FileSystem.readFileSync(available_videos_path);
let availableVideos = JSON.parse(available_videos);

// check validity of json path
function update_json_path_validity(newPath) {
    if (FileSystem.existsSync(newPath)) {
      try {
        if (path.extname(newPath) === ".json") { 
          return "valid path";
        } else {
          return "input path not json"; 
        }
      } catch (error) {
        return error;
      }
    } else {
      return "invalid path";
    }
}

// updated available videos path
function update_available_videos_path(newPath){ 
    if (update_json_path_validity(newPath) == "valid path") {
        const available_videos  = FileSystem.readFileSync(newPath);
        availableVideos = JSON.parse(available_videos);  
        available_videos_path = newPath; 
        return "availableVideos updated";
    } 
} 

// returns availableVideos data
function getAvailableVideos(path_array){
    if (path_array !== undefined) {
      if (path_array.length !== 0) {
        let dataPath = "availableVideos";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
                return eval(dataPath)[path_array[i]];
            } else  { 
                dataPath += `[path_array[${i}]]`;
            }
        } 
      } else {
        return "invalid array path";
      }
    } else  { 
      return availableVideos;
    } 
}

// return available Videos to its inital state
function resetAvailableVideos(){
    availableVideos = {}; 
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideo);
    return "resetAvailableVideos";
}

function updateAvailableVideoData(path_array, data) { 
    if (path_array.length !== 0 || path_array !== undefined) { 
        let dataPath = "availableVideos";
        for (let i = 0; i < path_array.length; i++) { 
            if (i == path_array.length - 1) { 
                eval(dataPath)[path_array[i]] = data;
            } else  { 
                dataPath += `[path_array[${i}]]`;
            }
        } 
        const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync(available_videos_path, newAvailableVideo);
    }  
} 

// get available video details by folder path by string
function availableVideosfolderPath_String(folderIDPath) {
  let folderPathString = "";
  for (let i = 0; i < folderIDPath.length; i++) {  
    if (i === 0) {
      folderPathString = folderPathString.concat("availableVideos[\"",folderIDPath[i],"\"].content");
    } else {
      folderPathString = folderPathString.concat("[\"",folderIDPath[i],"\"].content");
    } 
  }  
  return folderPathString;
}

// get available video details by folder path by array
function availableVideosfolderPath_Array(folderIDPath) {
  let folderPathString = [];
  for (let i = 0; i < folderIDPath.length; i++) {  
    folderPathString.push(folderIDPath[i], "content");
  }  
  return folderPathString;
}

// change title of video  
async function changeTitle(videoID, newVideoTitle, folderIDPath) { 
  if (folderIDPath === undefined || folderIDPath.length === 0) { 
    // check if videoid is valid
    const videoDetails = await getAvailableVideos([videoID]);
    // if video dosent exist redirect to home page
    if (videoDetails !== "invalid array path" && 
      newVideoTitle !== undefined &&
      typeof newVideoTitle == "string") { 
      try { 
        availableVideos[videoID]["info"]["title"] = newVideoTitle;  
        const newAvailableVideos = JSON.stringify(availableVideos, null, 2);
        FileSystem.writeFileSync(available_videos_path, newAvailableVideos);  
        return {
          "message": "video-title-changed",
          "availableVideos": availableVideos
        };
      } catch (e) { 
        return {
          "message": "failed-to-change-video-title"
        };  
      }
    } else  { 
      return {
        "message": "failed-to-change-video-title"
      };  
    }
  } else {  
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath);    
    eval(availableVideosFolderIDPath)[videoID]["info"]["title"] = newVideoTitle;  
    const newAvailableVideos = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideos);   
    return {
      "message": "video-title-changed",
      "availableVideos": availableVideos
    };
  } 
}

// create Folder at availableVideos
function createFolder(folderIDPath, folderTitle) { 
  const newfolderID = `folder-${uuidv4()}`;  
  if (folderIDPath === undefined || folderIDPath.length == 0) { 
    availableVideos[newfolderID] = {
      "info": {
        "title": folderTitle, 
        "inside-folder": "folder-main"
      },
      "content": {}
    };    
  }else { 
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath);  
    eval(availableVideosFolderIDPath)[newfolderID] = {
      "info": {
        "title": folderTitle, 
        "inside-folder": folderIDPath[[folderIDPath.length - 1] ]
      },
      "content": {}
    }; 
  }  
  const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
  FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
  return {
    "message": "folder-created",
    "folderID": newfolderID,
    "availableVideos": availableVideos
  };
}

// input selected element id out of folder element at availableVideos
function inputSelectedIDOutOfFolderID(selectedID, folderID, folderIDPath) {  
  const fromFolderID = [...folderIDPath];
  const tooFolderID = [...folderIDPath];
  if (folderID == "folder-main") {
    tooFolderID.length = 0;
  } else {
    const fodlerIDIndex = tooFolderID.indexOf(folderID); 
    tooFolderID.splice(fodlerIDIndex+1, 9e9);  
    tooFolderID.length = fodlerIDIndex+1; 
  }  
  if (tooFolderID === undefined || tooFolderID.length == 0) {  
    const availableVideosFromFolderIDPath = availableVideosfolderPath_String(fromFolderID);     
    availableVideos[selectedID] = eval(availableVideosFromFolderIDPath)[selectedID]; 
    delete eval(availableVideosFromFolderIDPath)[selectedID]; 
    if (selectedID.includes("folder-")) { 
      availableVideos[selectedID].info["inside-folder"] = folderID; 
    }   
  }else {     
    const availableVideosFromFolderIDPath = availableVideosfolderPath_String(fromFolderID);  
    const availableVideosTooFolderIDPath = availableVideosfolderPath_String(tooFolderID); 
    eval(availableVideosTooFolderIDPath)[selectedID] = eval(availableVideosFromFolderIDPath)[selectedID]; 
    delete eval(availableVideosFromFolderIDPath)[selectedID]; 
    if (selectedID.includes("folder-")) { 
      eval(availableVideosTooFolderIDPath)[selectedID].info["inside-folder"] = folderID; 
    }  
  } 
  const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
  FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
  return {
    "message": "successfully-inputed-selected-out-of-folder",
    "availableVideos": availableVideos
  };
}

// input selected element into folder element at availableVideos
function inputSelectedIDIntoFolderID(selectedID, folderID, folderIDPath) {   
  if (folderIDPath === undefined || folderIDPath.length == 0) { 
    availableVideos[folderID].content[`${selectedID}`] = availableVideos[selectedID];
    delete availableVideos[selectedID]; 
    if (selectedID.includes("folder-")) {
      availableVideos[folderID].content[`${selectedID}`].info["inside-folder"] = folderID;
    }    
  }else {  
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath);
    eval(availableVideosFolderIDPath)[folderID].content[selectedID] = eval(availableVideosFolderIDPath)[selectedID]; 
    delete eval(availableVideosFolderIDPath)[selectedID]; 
    if (selectedID.includes("folder-")) {
      eval(availableVideosFolderIDPath)[folderID].content[selectedID].info["inside-folder"] = folderID;
    }    
  } 
  const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
  FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
  return {
    "message": "successfully-inputed-selected-into-folder",
    "availableVideos": availableVideos
  };
}

// move selected id data to before target id data at available video details
function moveSelectedIdBeforeTargetIdAtAvailableVideoDetails(selectedID, targetID, folderIDPath) {
  if (folderIDPath === undefined || folderIDPath.length == 0) { 
    const selectedIDIndex = Object.keys(availableVideos).indexOf(selectedID); 
    let targetIDIndex = Object.keys(availableVideos).indexOf(targetID);
    if (selectedIDIndex > targetIDIndex) { 
      targetIDIndex = targetIDIndex + 1;
    }
    // turn availableVideos into an array
    const availableVideosArray = Object.entries(availableVideos);    
    // remove `selectedIDIndex` item and store it
    const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
    // insert stored item into position `targetIDIndex`
    availableVideosArray.splice(targetIDIndex, 0, removedItem);
    // turn availableVideosArray back into an object
    availableVideos = Object.fromEntries(availableVideosArray);    
  } else { 
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath); 
    const selectedIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(selectedID); 
    let targetIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(targetID);
    if (selectedIDIndex > targetIDIndex) { 
      targetIDIndex = targetIDIndex + 1;
    }
    // turn availableVideos into an array
    const availableVideosArray = Object.entries(eval(availableVideosFolderIDPath));    
    // remove `selectedIDIndex` item and store it
    const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
    // insert stored item into position `targetIDIndex`
    availableVideosArray.splice(targetIDIndex, 0, removedItem);
    // turn availableVideosArray back into an object  
    eval(availableVideosFolderIDPath.slice(0, -8)).content = Object.fromEntries(availableVideosArray);  
  }
  const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
  FileSystem.writeFileSync(available_videos_path, newAvailableVideo);  
  return {
    "message": "availableVideos updated successfully",
    "availableVideos": availableVideos
  };
}

// move selected id data to after target id data at available video details
function moveSelectedIdAfterTargetIdAtAvailableVideoDetails(selectedID, targetID, folderIDPath) {
  if (folderIDPath === undefined || folderIDPath.length == 0) {  
    const selectedIDIndex = Object.keys(availableVideos).indexOf(selectedID); 
    let targetIDIndex = Object.keys(availableVideos).indexOf(targetID);    
    if (targetIDIndex > selectedIDIndex) { 
      targetIDIndex = targetIDIndex - 1;
    }
    // turn availableVideos into an array
    const availableVideosArray = Object.entries(availableVideos);    
    // remove `selectedIDIndex` item and store it
    const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
    // insert stored item into position `targetIDIndex`
    availableVideosArray.splice(targetIDIndex, 0, removedItem);
    // turn availableVideosArray back into an object
    availableVideos = Object.fromEntries(availableVideosArray);    
  } else { 
    const availableVideosFolderIDPath = availableVideosfolderPath_String(folderIDPath); 
    const selectedIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(selectedID); 
    let targetIDIndex = Object.keys(eval(availableVideosFolderIDPath)).indexOf(targetID);  
    if (targetIDIndex > selectedIDIndex) { 
      targetIDIndex = targetIDIndex - 1;
    }
    // turn availableVideos into an array
    const availableVideosArray = Object.entries(eval(availableVideosFolderIDPath));    
    // remove `selectedIDIndex` item and store it
    const removedItem = availableVideosArray.splice(selectedIDIndex, 1)[0];
    // insert stored item into position `targetIDIndex`
    availableVideosArray.splice(targetIDIndex, 0, removedItem);
    // turn availableVideosArray back into an object  
    eval(availableVideosFolderIDPath.slice(0, -8)).content = Object.fromEntries(availableVideosArray);  
  }
  const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
  FileSystem.writeFileSync(available_videos_path, newAvailableVideo);  
  return {
    "message": "availableVideos updated successfully",
    "availableVideos": availableVideos
  };
}

// delete availableVideos from server if exist  
function deleteSpecifiedAvailableVideosData(fileName, path_array) {  
  try { 
    if (fileName !== undefined) {
      if (path_array instanceof Array) { 
        if (path_array.length !== 0) {
          deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, path_array);
        } else {
          deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName);
        }
      } else {   
        deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName);
      }   
    } else  {
      return "invalid fileName";
    } 
  } catch (error) {
    return error;
  }
}

// delete availableVideos data by fileName from provided path 
function deleteSpecifiedAvailableVideosDataWithProvidedPath(fileName, path_array) {
  if (getAvailableVideos([...path_array, fileName]) !== "invalid array path") {
    let dataPath = "availableVideos";
    for (let i = 0; i < path_array.length; i++) { 
        if (i == path_array.length - 1) { 
          delete eval(dataPath)[path_array[i]][fileName];
        } else  { 
          dataPath += `[path_array[${i}]]`;
        }
    } 
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
    return `${fileName} deleted`;
  } else {
    return "invalid array path";
  } 
}

// delete availableVideos data by fileName from main directory
function deleteSpecifiedAvailableVideosDataWithoutProvidedPath(fileName) {
  if (getAvailableVideos([fileName]) !== "invalid array path") {
    delete availableVideos[fileName]; 
    const newAvailableVideo = JSON.stringify(availableVideos, null, 2);
    FileSystem.writeFileSync(available_videos_path, newAvailableVideo); 
    return `${fileName} deleted`;
  } else  {
    return "invalid array path";
  }  
}

module.exports = { // export modules 
    update_available_videos_path,
    getAvailableVideos,
    resetAvailableVideos,
    updateAvailableVideoData,
    availableVideosfolderPath_String,
    availableVideosfolderPath_Array,
    changeTitle,
    createFolder,
    inputSelectedIDOutOfFolderID,
    inputSelectedIDIntoFolderID,
    moveSelectedIdBeforeTargetIdAtAvailableVideoDetails,
    moveSelectedIdAfterTargetIdAtAvailableVideoDetails,
    deleteSpecifiedAvailableVideosData,
    deleteSpecifiedAvailableVideosDataWithProvidedPath,
    deleteSpecifiedAvailableVideosDataWithoutProvidedPath
};