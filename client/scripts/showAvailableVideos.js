import * as basic from "../scripts/basics.js";
import * as folder from "./folder.js";
import * as folderPath from "./folderPath.js";
import * as currentVideoDownloads from "../scripts/currentVideoDownloads.js";

// try to fetch for all-available-video-data is successful send data to eachAvailableVideoDetails function else show error msg
export async function loadVideoDetails() {
  try {
    const response = await fetch("../all-available-video-data");
    if (response.ok) {
      const availablevideoDetails = await response.json(); 
      basic.setNewAvailablevideoDetails(availablevideoDetails);
      const searchBarContainer = basic.createSection(basic.websiteContentContainer(), "section", "searchBarContainer", "searchBarContainer"); 
      searchBar(searchBarContainer); 
      const pathContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer pathContainer", "pathContainer"); 
      folderPath.homepagePath(pathContainer);
      eachAvailableVideoDetails(availablevideoDetails, searchBarContainer); 
      return "Video details loaded";
    } else {
      return "Failed to load video details";
    }
  } catch (error) { // when an error occurs
    // if responseErrorAvailableVideo id dosent exist
    if (!document.getElementById("responseErrorAvailableVideo")) {
      // show error msg
      const responseError = basic.createSection(basic.websiteContentContainer(), "section", "responseErrorAvailableVideo", "responseErrorAvailableVideo");
      basic.createSection(responseError, "h1", undefined, undefined,  "Error Connection Refused.");
    }
    return "Fetch Request Failed";
  }
}

// if there is available videoDetails then get each video Details and send the data to showDetails
// if there are no videoDetails then show  noAvailableVideos msg
export function eachAvailableVideoDetails(videoDetails, searchBarContainer) {
  try {
    if (typeof videoDetails == "object") {
      if (Object.keys(videoDetails).length == 0) { // no available videos
        if (document.getElementById("searchBar")) {
          document.getElementById("searchBar").remove(); 
        }
        const noAvailableVideosContainer = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer");
        basic.createSection(noAvailableVideosContainer, "h1", "noAvailableVideosHeader", undefined,  "There has been no recorded/downloaded videos.");
        return "no available videos";
      } else {
        let savedVideosThumbnailContainer; 
        if (document.getElementById("savedVideosThumbnailContainer")) { 
          document.getElementById("savedVideosThumbnailContainer").innerHTML = "";
          savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
        } else { 
          savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
        }
        if(basic.getSearchableVideoDataArray().length !== 0){ 
          basic.resetSearchableVideoDataArray();
        } 
        // createFolderButton 
        const createFolderButton = basic.createLink(searchBarContainer, "javascript:;", undefined, "button category-link", "Create Folder"); 
        createFolderButton.onclick = function(e){
          e.preventDefault(); 
          folder.createFolderOnClick();
        };
        folder.resetInsideFolderID();
        dragDropAvailableVideoDetails(savedVideosThumbnailContainer);
        displayVideoDetails(savedVideosThumbnailContainer, videoDetails);
        return "available videos";
      }
    } else {
      return "input not an object";
    }
  } catch (error) {
    return error;
  }
}

// display folder or video details to client
export function displayVideoDetails(savedVideosThumbnailContainer, videoDetails) { 
  basic.resetSearchableVideoDataArray();
  Object.keys(videoDetails).reverse().forEach(function(videoInfo_ID) {
    if (videoInfo_ID.includes("folder-")) {  
      basic.pushDataToSearchableVideoDataArray(videoDetails[videoInfo_ID]);
      showFolderDetails(savedVideosThumbnailContainer, videoInfo_ID, videoDetails[videoInfo_ID]);
    } else {
      if (videoDetails[videoInfo_ID].hasOwnProperty("info")) {  // eslint-disable-line
        // add video details into searchableVideoDataArray array 
        videoDetails[videoInfo_ID]["info"]["id"] = videoInfo_ID; 
        basic.pushDataToSearchableVideoDataArray(videoDetails[videoInfo_ID]);
        // display video details
        showDetails(savedVideosThumbnailContainer, videoInfo_ID, videoDetails[videoInfo_ID]);
      } 
    }
  });
}

// load video details to user which include thumbnail image, video id as title and option menu
export function showDetails(savedVideosThumbnailContainer, videoInfo_ID, videoDetails) {
  try {
    if (savedVideosThumbnailContainer === undefined) {
      return "savedVideosThumbnailContainer undefined";
    } else if (typeof videoInfo_ID !== "string") {  
      return "videoInfo_ID not string";
    } else if (videoDetails === undefined) {
      return "invalid videoDetails";
    } else {
      let videoSrc, videoType;
      try {
        if (videoDetails.info.videoLink.compressdSrc !== undefined && videoDetails.info.videoLink.compressedType !== undefined) {
          videoSrc = videoDetails.info.videoLink.compressdSrc; // compressed src
          videoType = videoDetails.info.videoLink.compressedType; // video/webm
        } else {
          videoSrc = videoDetails.info.videoLink.src; // original src
          videoType = videoDetails.info.videoLink.type; // video/mp4
        }
      } catch (error) {
        videoSrc = videoDetails.info.videoLink.src; // original src
        videoType = videoDetails.info.videoLink.type; // video/mp4
      }
      let video_name = videoDetails.info.title;
      const numberOfThumbnails = Object.keys(videoDetails.info.thumbnailLink).length;
      const mainThumbnail = `${window.location.origin}${videoDetails.info.thumbnailLink[1]}`;
      const linkContainer = basic.createLink(savedVideosThumbnailContainer, `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`, videoInfo_ID, "videoThumbnailContainer");
      linkContainer.draggable = true;
      const thumbnailContainer = basic.createSection(linkContainer, "section", `${videoInfo_ID}-container`);
      const imageContainer = basic.createSection(thumbnailContainer, "section", "thumbnail-image-container",  `${videoInfo_ID}-image-container`);
      const thumbnail = basic.appendImg(imageContainer, mainThumbnail, undefined, undefined, `${videoInfo_ID}-img`, "thumbnail-image", videoInfo_ID);
      thumbnail.draggable = false;
      // menu options
      const option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-bars", `${videoInfo_ID}-menu`);
      option_menu.onmouseenter = () => {
        linkContainer.draggable = false;
      };
      option_menu.onmouseleave = () => {
        linkContainer.draggable = true;
      };
      option_menu.title = "menu";
      option_menu.onclick = function(e){
        e.preventDefault();
        optionMenuOnClick(savedVideosThumbnailContainer, videoSrc, videoType, videoInfo_ID, video_name, option_menu, linkContainer, thumbnailContainer, thumbnailTitleContainer);
      };
      // video title container - if user want to be redirected to video player even if menu is active when onclick
      const thumbnailTitleContainer = basic.createLink(thumbnailContainer, `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`, `${videoInfo_ID}-title-container`, "thumbnailTitleContainer");
      basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
      
      let loopTroughThumbnails, mainThumbnailNumber = 1;
      thumbnail.addEventListener("mouseover", ( ) => { 
        if (typeof loopTroughThumbnails != "number"){
          loopTroughThumbnails = setInterval( () => {
            if (linkContainer.classList.contains("dragging")) { 
              clearInterval(loopTroughThumbnails);
              if (typeof loopTroughThumbnails == "number"){
                loopTroughThumbnails = undefined;
              }
              mainThumbnailNumber = 1;
              thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
            } else { 
              if (mainThumbnailNumber == numberOfThumbnails) {
                thumbnail.src =  mainThumbnail;
                mainThumbnailNumber = 1;
              } else {
                mainThumbnailNumber = mainThumbnailNumber + 1;
                thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
              }
            }
          }, 500); 
        }
      });
    
      thumbnail.addEventListener("mouseout", ( ) => {
       clearInterval(loopTroughThumbnails);
       if (typeof loopTroughThumbnails == "number"){
        loopTroughThumbnails = undefined;
       }
       mainThumbnailNumber = 1;
       thumbnail.src =  `${window.location.origin}${videoDetails.info.thumbnailLink[mainThumbnailNumber]}`;
      });
      return "showDetails";
    }
  } catch (error) { 
    return "showDetails didnt work";
  } 
}

// load folder details to user 
export function showFolderDetails(savedVideosThumbnailContainer, folderInfoID, videoDetails) {
  let folder_name = videoDetails.info.title;
  videoDetails["info"]["id"] = folderInfoID;
  basic.pushDataToSearchableVideoDataArray(videoDetails[folderInfoID]); 
  
  const folderContainerLink = basic.createLink(savedVideosThumbnailContainer, undefined, folderInfoID, "folderContainer"); 
  folderContainerLink.draggable = true; 
  folderContainerLink.onclick = function(e){
    e.preventDefault();  
    folderOnClick(savedVideosThumbnailContainer, videoDetails);
  };

  folderContainerLink.onmouseenter = function(e){
    e.preventDefault();
    folderContainerLink.style.cursor = "pointer";
    folderTitleContainer.style["text-decoration"] = "underline";
  };
  
  folderContainerLink.onmouseleave = function(e){
    e.preventDefault();
    folderContainerLink.style.cursor = "default";
    folderTitleContainer.style["text-decoration"] = "none";
  };

  const folderContainer = basic.createSection(folderContainerLink, "section");
  basic.createSection(folderContainer, "section", "folder-image-container fa fa-folder", `${folderInfoID}-image-container`);
  const folderTitleContainer = basic.createLink(folderContainer, undefined, `${folderInfoID}-title-container`, "folderTitleContainer");
  basic.createSection(folderTitleContainer, "h1", undefined, `${folderInfoID}-title`, folder_name);   

  return "showFolderDetails";
}

// when folder element is click on 
function folderOnClick(savedVideosThumbnailContainer, videoDetails) {
  document.getElementById("searchBar").value = ""; 
  savedVideosThumbnailContainer.remove();
  savedVideosThumbnailContainer = basic.createSection(basic.websiteContentContainer(), "section", "dragDropContainer savedVideosThumbnailContainer", "savedVideosThumbnailContainer");
  folder.pushNewFolderIDToFolderIDPath(videoDetails.info.id); 
  
  folderPath.breakPath(document.getElementById("pathContainer"), videoDetails.info.id);
  folderPath.folderPath(savedVideosThumbnailContainer, document.getElementById("pathContainer"), videoDetails.info.id, videoDetails.info.title); 

  const availableVideosFolderIDPath = folder.getAvailableVideoDetailsByFolderPath(folder.getFolderIDPath());   
  dragDropAvailableVideoDetails(savedVideosThumbnailContainer);
  displayVideoDetails(savedVideosThumbnailContainer, availableVideosFolderIDPath);
}

// rearange available videos by drag and drop
export function dragDropAvailableVideoDetails(section){
  let dragEl, target, prevtarget;
  const dragDropContainers = document.querySelectorAll(".dragDropContainer");
  if (section === undefined) {
    return "section undefined";
  } else { 
    section.addEventListener("dragstart", function(e){      
      dragEl = e.target; 
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("Text", dragEl.textContent);
      dragDropContainers.forEach(container => {  
        container.addEventListener("dragover", _onDragOver, false);  
        container.addEventListener("dragend", _onDragEnd, false);  
      });
      dragEl.classList.add("dragging");
    });
    return "dragDropAvailableVideoDetails";
  }
  
  function _onDragOver(e){
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (e.target.id.includes("-img")) { 
      target = document.getElementById(e.target.id.replace("-img",""));  
    } else if (e.target.id.includes("-menu")) { 
      target = document.getElementById(e.target.id.replace("-menu",""));  
    } else if (e.target.id.includes("-image-container")) { 
      target = document.getElementById(e.target.id.replace("-image-container",""));  
    } else if (e.target.id.includes("-title")) { 
      target = document.getElementById(e.target.id.replace("-title",""));   
    } else { 
      target = e.target; 
    }
    if(target.nodeName == "A" || e.target.id.includes("path-folder-")){
      if (prevtarget !== undefined) { 
        if ((folder.getFolderIDPath().length == 0 && target.id == "path-folder-main") ||
          (folder.getFolderIDPath()[folder.getFolderIDPath().length - 1] === target.id.replace("path-","")) ||
          (prevtarget.id !== target.id)
        ) {   
          prevtarget.classList.remove("dragging-target"); 
        } else {  
          target.classList.add("dragging-target"); 
        }   
        prevtarget = target;
      } else  {
        prevtarget = target;
      }
    } else  {
      prevtarget.classList.remove("dragging-target"); 
    }
  } 

  function _onDragEnd(e){
    e.preventDefault();
    dragEl.classList.remove("dragging");
    target.classList.remove("dragging-target"); 
    prevtarget.classList.remove("dragging-target"); 
    dragDropContainers.forEach(container => {  
      container.removeEventListener("dragover", _onDragOver, false);
      container.removeEventListener("dragend", _onDragEnd, false);
    });     
    
    if (
        (target && target !== dragEl && target.id.includes("path-folder-")) === true &&
        (folder.getFolderIDPath().length == 0 && target.id == "path-folder-main") === false &&
        (folder.getFolderIDPath()[folder.getFolderIDPath().length - 1] === target.id.replace("path-","")) === false
      ) {  
      folder.inputSelectedIDOutOfFolderID(dragEl.id, target.id.replace("path-",""));
      document.getElementById(dragEl.id).remove();
    } else if( target && target !== dragEl && target.nodeName == "A"){
      if (target.id.includes("folder-") && document.getElementById(dragEl.id)) { 
        document.getElementById(dragEl.id).remove();
        folder.inputSelectedIDIntoFolderID(dragEl.id, target.id);
      } else { 
        if ([...section.children].indexOf(dragEl) > [...section.children].indexOf(target)) { 
          section.insertBefore(dragEl, target); 
        } else { 
          section.insertBefore(dragEl, target.nextSibling);  
        }
        basic.searchableVideoDataArray_move(dragEl.id, target.id);
        updateRearangedAvailableVideoDetails(dragEl.id, target.id);
      }
    }    
  }
}

// request to update selected available video details orientation
export async function updateRearangedAvailableVideoDetails(selectedID, targetID) {
  try {
      if (selectedID === undefined && targetID === undefined) {
        basic.notify("error", "selectedID & targetID undefined"); 
        return "selectedID & targetID undefined";
      } else if (selectedID === undefined) {
        basic.notify("error", "selectedID undefined"); 
        return "selectedID undefined";
      } else if (targetID === undefined) {
        basic.notify("error", "targetID undefined"); 
        return "targetID undefined";
      } else {
        const payload = {
          folderIDPath: folder.getFolderIDPath(),
          selectedID: selectedID,
          targetID: targetID
        }; 
        let requestResponse;
        const response = await fetch("../updateRearangedAvailableVideoDetails", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) { 
          requestResponse = await response.json();   
          if (requestResponse.message === "availableVideos updated successfully"){
            basic.notify("success", `Position updated: ${document.getElementById(`${selectedID}-title`).textContent}`);     
            const availablevideoDetails = requestResponse.availableVideos; 
            basic.setNewAvailablevideoDetails(availablevideoDetails);
            return "availableVideos updated successfully"; 
          } else if (requestResponse.message === `${selectedID} unavailable at availableVideos`) {
            basic.notify("error", `${selectedID} unavailable at availableVideos`); 
            return `${selectedID} unavailable at availableVideos`; 
          } else if (requestResponse.message === `${targetID} unavailable at availableVideos`) {
            basic.notify("error", `${targetID} unavailable at availableVideos`); 
            return `${targetID} unavailable at availableVideos`; 
          } else {        
            basic.notify("error",`${selectedID} && ${targetID} unavailable at availableVideos`); 
            return `${selectedID} && ${targetID} unavailable at availableVideos`;
          }
        } else {        
          basic.notify("error","Failed to update rearanged available video details"); 
          return "Failed to update rearanged available video details";
        }
      }
  } catch (error) {
    basic.notify("error","Failed to update rearanged available video details"); 
    return error;
  }
}

// on click option menu copy video link
export function optionMenuCopyOnClick(videoSrc, videoType, option_menu_copy) { 
  try {
    if (typeof videoSrc !== "string") {
      basic.notify("error","Copied Video Link: Invalid videoSrc");
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {
      basic.notify("error","Copied Video Link: Invalid videoType");
      return "videoType not string";
    } else {
      const tempCopyLink = document.createElement("textarea");
      document.body.appendChild(tempCopyLink);
      tempCopyLink.value = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
      tempCopyLink.select();
      document.execCommand("copy");
      document.body.removeChild(tempCopyLink);
      option_menu_copy.textContent = "Copied";
      basic.notify("success","Copied Video Link");
      return "optionMenuCopyOnClick";
    }
  } catch (error) {
    basic.notify("error","Copied Video Link: Failed to execute function properly");
    return "optionMenuCopyOnClick didnt work";
  }
}

// on click option menu
export function optionMenuOnClick(savedVideosThumbnailContainer, videoSrc, videoType, videoInfo_ID, video_name, option_menu, linkContainer, thumbnailContainer, thumbnailTitleContainer) {
  try { 
    if (savedVideosThumbnailContainer === undefined) {  
      return "savedVideosThumbnailContainer undefined";
    } else if (typeof videoSrc !== "string") {  
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {  
      return "videoType not string";
    } else if (typeof videoInfo_ID !== "string") {  
      return "videoInfo_ID not string";
    } else if (typeof video_name !== "string") {  
      return "video_name not string";
    } else if (option_menu === undefined) {  
      return "option_menu undefined";
    } else if (linkContainer === undefined) {  
      return "linkContainer undefined";
    } else if (thumbnailContainer === undefined) {  
      return "thumbnailContainer undefined";
    } else if (thumbnailTitleContainer === undefined) {  
      return "thumbnailTitleContainer undefined";
    } else {  
      option_menu.title = "";
      linkContainer.removeAttribute("href");
      option_menu.disabled = true;
      option_menu.classList = "thumbnail-option-menu";
      linkContainer.draggable = false;
      // option_menu_container
      const option_menu_container = basic.createSection(option_menu, "section", "thumbnail-options-container");
      // copy video link
      const option_menu_copy = basic.createSection(option_menu_container, "button", "button option-play", undefined, "Get shareable link");
      option_menu_copy.title = "Get shareable link";
      option_menu_copy.onclick = function(e){
        e.preventDefault();
        optionMenuCopyOnClick(videoSrc, videoType, option_menu_copy);
      };
      // check if video title is same as dispalyed by ${videoInfo_ID}-title id
      if (video_name !== document.getElementById(`${videoInfo_ID}-title`).textContent) { 
        video_name = document.getElementById(`${videoInfo_ID}-title`).textContent;
      }
      // update ${videoInfo_ID}-title id into input text box
      document.getElementById(`${videoInfo_ID}-title`).remove();
      const inputNewTitle = basic.createInput(document.getElementById(`${videoInfo_ID}-title-container`),"text", video_name, `${videoInfo_ID}-title`, "inputNewTitle");
      document.getElementById(`${videoInfo_ID}-title-container`).removeAttribute("href");
      inputNewTitle.onkeypress = function(e){ // on input new title key press
        if (!e) e = window.event;
        var keyCode = e.code || e.key;
        if (keyCode == "Enter"){ 
          video_name = inputNewTitle.value;
          changeVideoTitle(videoInfo_ID, video_name);
          inputNewTitle.blur();
          return false;
        }
      };
      // show video edit info menu
      const option_menu_edit = basic.createSection(option_menu_container, "button", "button option-delete", undefined, "Edit");
      option_menu_edit.title = "Edit";
      option_menu_edit.onclick = function(e){
        e.preventDefault();
        optionMenuEditOnClick(savedVideosThumbnailContainer, videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle);
      };
      // close video edit info menu
      const close_option_menu = basic.createSection(thumbnailContainer, "button", "thumbnail-option-menu fa fa-times");
      close_option_menu.title = "Close menu";
      close_option_menu.onclick = function(e){
        e.preventDefault();
        closeOptionMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle);
      };
      // if hovered removed over linkContainer, remove option_menu_container, close_option_menu
      const isHover = e => e.parentElement.querySelector(":hover") === e;
      const checkHoverFunction = function checkHover() {
        let hovered = isHover(linkContainer); 
        if (hovered !== checkHover.hovered) { 
          checkHover.hovered = hovered;  
          const checkIfInputActive = setInterval(function(){ 
              if (document.activeElement.id === `${videoInfo_ID}-title`) {
                hovered = checkHover.hovered; 
                inputNewTitle.onkeypress = function(e){
                  if (!e) e = window.event;
                  var keyCode = e.code || e.key;
                  if (keyCode == "Enter"){
                    video_name = inputNewTitle.value;
                    changeVideoTitle(videoInfo_ID, video_name);  
                    if (hovered  === false) {
                      document.getElementById(`${videoInfo_ID}-title`).remove();
                      basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
                      document.getElementById(`${videoInfo_ID}-title-container`).href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
                      option_menu.title = "menu";
                      linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
                      option_menu.classList = "thumbnail-option-menu fa fa-bars";
                      linkContainer.draggable = true;
                      option_menu.disabled = false;
                      option_menu_container.remove();
                      close_option_menu.remove();
                      document.removeEventListener("mousemove", checkHoverFunction);
                      clearInterval(checkIfInputActive);
                    } else {
                      inputNewTitle.blur();
                    }
                    return false;
                  }
                };
              } else{
                if (hovered === false) { 
                  if (video_name !== inputNewTitle.value) {
                    video_name = inputNewTitle.value;
                    changeVideoTitle(videoInfo_ID, video_name); 
                  }
                  document.getElementById(`${videoInfo_ID}-title`).remove();
                  basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
                  document.getElementById(`${videoInfo_ID}-title-container`).href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
                  option_menu.title = "menu";
                  linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
                  option_menu.classList = "thumbnail-option-menu fa fa-bars";
                  linkContainer.draggable = true;
                  option_menu.disabled = false;
                  option_menu_container.remove();
                  close_option_menu.remove();
                  document.removeEventListener("mousemove", checkHoverFunction);
                } 
                clearInterval(checkIfInputActive);
            }
          }, 50); 
        }
      };
      document.addEventListener("mousemove", checkHoverFunction);
      return "optionMenuOnClick";
    }
  } catch (error) { 
    return "optionMenuOnClick didnt work";
  }  
}

// on click option menu edit
export function optionMenuEditOnClick(savedVideosThumbnailContainer, videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, inputNewTitle) {
  try {
    if (savedVideosThumbnailContainer === undefined) {
      return "savedVideosThumbnailContainer undefined";
    } else if (typeof videoSrc !== "string") {  
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {  
      return "videoType not string";
    } else if (typeof videoInfo_ID !== "string") {  
      return "videoInfo_ID not string";
    } else if (typeof video_name !== "string") {  
      return "video_name not string";
    } else if (option_menu === undefined) {  
      return "option_menu undefined";
    } else if (option_menu_container === undefined) {  
      return "option_menu_container undefined";
    } else if (close_option_menu === undefined) {  
      return "close_option_menu undefined";
    } else if (linkContainer === undefined) {  
      return "linkContainer undefined";
    } else if (inputNewTitle === undefined) {  
      return "inputNewTitle undefined";
    } else {
      if(document.getElementById("download-status-container"))  { 
        document.getElementById("download-status-container").remove(); 
        currentVideoDownloads.stopAvailableVideoDownloadDetails();  
      }
      if (video_name !== inputNewTitle.value) {
        video_name = inputNewTitle.value;
        changeVideoTitle(videoInfo_ID, video_name); 
      }
      linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
      option_menu.classList = "thumbnail-option-menu fa fa-bars";
      option_menu_container.remove();
      close_option_menu.remove();
      document.body.style.overflow ="hidden";
      const video_edit_container = basic.createSection(document.body, "section", "video_edit_container", "video_edit_container");
      const video_edit_body = basic.createSection(video_edit_container, "section", "video-edit-body");
      backToViewAvailableVideoButton(video_edit_body, video_edit_container, option_menu, option_menu_container,close_option_menu);
      const video_edit_article = basic.createSection(video_edit_body, "article", "video-edit-article");
      const video_edit_form = basic.createSection(video_edit_article, "form");
    
      const video_edit_form_title = basic.createSection(video_edit_form, "section");
      basic.createSection(video_edit_form_title, "h2", "video-edit-form-title", undefined, "Edit mode");
    
      // Video title 
      const video_title_edit_settings_container = basic.createSection(video_edit_form, "section");
      const video_title_edit_settings_ul = basic.createSection(video_title_edit_settings_container, "ul");
      const video_title_edit_settings_li = basic.createSection(video_title_edit_settings_ul, "li", "videoTitleEditContainer");
    
      const video_title_edit_content_container = basic.createSection(video_title_edit_settings_li, "section");
      basic.createSection(video_title_edit_content_container, "strong", undefined, undefined, "Video Title");
      const video_title_edit_content_input = basic.inputType(video_title_edit_content_container, "text", undefined, "videoTitleEditInput", false);
      video_title_edit_content_input.placeholder = video_name;
    
      const video_title_edit_button_container = basic.createSection(video_title_edit_settings_li, "section", "videoTitleEditButtonContainer");
      const videoTitleEditButton = basic.createSection(video_title_edit_button_container, "button", "videoTitleEditButton", undefined, "Change video title");
    
      videoTitleEditButton.onclick = function(e){
        e.preventDefault();  
        document.body.style.removeProperty("overflow");
        video_edit_container.remove();
        if (document.getElementById(`${videoInfo_ID}-title`)) { 
          video_name = video_title_edit_content_input.value;
          changeVideoTitle(videoInfo_ID, video_name); 
        } else {
          basic.notify("error",`ID ${videoInfo_ID}-title is Missing`); 
        }
      };
    
      // Danger zone setting 
      const dangerZone_title_container = basic.createSection(video_edit_form, "section");
      basic.createSection(dangerZone_title_container, "h2", "dangerZone-title", undefined, "Danger Zone");
    
      const dangerZone_settingsContainer = basic.createSection(video_edit_form, "section", "dangerZone-settingsContainer");
      const dangerZone_settings_ul = basic.createSection(dangerZone_settingsContainer, "ul");
      const dangerZone_settings_li = basic.createSection(dangerZone_settings_ul, "li", "deleteVideoContainer");
    
      // Delete video 
      const deleteVideoContentContainer = basic.createSection(dangerZone_settings_li, "section");
      basic.createSection(deleteVideoContentContainer, "strong", undefined, undefined, "Delete this video");
      basic.createSection(deleteVideoContentContainer, "p", undefined, undefined, "Once you delete a video, there is no going back. Please be certain.");
    
      const deleteVideoButtonContainer = basic.createSection(dangerZone_settings_li, "section", "deleteVideoButtonContainer");
      const deleteVideoButton = basic.createSection(deleteVideoButtonContainer, "button", "deleteVideoButton", undefined, "Delete this video");
      deleteVideoButton.onclick = function(e){
        e.preventDefault();
        const confirmVideoDelete = confirm("Press OK to permanently delete video");
        if (confirmVideoDelete) {
          // remove container
          document.body.style.removeProperty("overflow");
          video_edit_container.remove();
          //delete data permanently
          deleteVideoDataPermanently(videoInfo_ID, savedVideosThumbnailContainer);
        }
      };
      return "optionMenuEditOnClick";
    }
  } catch (error) {
    return "optionMenuEditOnClick didnt work";
  }
}

// on click close option menu
export function closeOptionMenuOnClick(videoSrc, videoType, videoInfo_ID, video_name, option_menu, option_menu_container, close_option_menu, linkContainer, thumbnailTitleContainer, inputNewTitle) {
  try {
    if (typeof videoSrc !== "string") {  
      return "videoSrc not string";
    } else if (typeof videoType !== "string") {  
      return "videoType not string";
    } else if (typeof videoInfo_ID !== "string") {  
      return "videoInfo_ID not string";
    } else if (typeof video_name !== "string") {  
      return "video_name not string";
    } else if (option_menu === undefined) {  
      return "option_menu undefined";
    } else if (option_menu_container === undefined) {  
      return "option_menu_container undefined";
    } else if (close_option_menu === undefined) {  
      return "close_option_menu undefined";
    } else if (linkContainer === undefined) {  
      return "linkContainer undefined";
    } else if (thumbnailTitleContainer === undefined) {  
      return "thumbnailTitleContainer undefined";
    } else if (inputNewTitle === undefined) {  
      return "inputNewTitle undefined";
    } else {  
      if (video_name !== inputNewTitle.value) {
        video_name = inputNewTitle.value;
        changeVideoTitle(videoInfo_ID, video_name); 
      }
      document.getElementById(`${videoInfo_ID}-title`).remove();
      document.getElementById(`${videoInfo_ID}-title-container`).href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
      basic.createSection(thumbnailTitleContainer, "h1", undefined, `${videoInfo_ID}-title`, video_name);
      option_menu.title = "menu";
      linkContainer.href = `${window.location.origin}/?t=${videoType}?v=${window.location.origin}${videoSrc}`;
      option_menu.classList = "thumbnail-option-menu fa fa-bars";
      linkContainer.draggable = true;
      option_menu.disabled = false;
      option_menu_container.remove();
      close_option_menu.remove(); 
      return "closeOptionMenuOnClick"; 
    }
  } catch (error) {
    return "closeOptionMenuOnClick didnt work";
  }
}

// request to stop download video srteam
export async function changeVideoTitle(videoID, newVideoTitle) { 
  try {
    const payload = {
      videoID: videoID,
      newVideoTitle: newVideoTitle,
      folderIDPath: folder.getFolderIDPath()
    }; 

    const response = await fetch("../changeVideoTitle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let requestResponse;
    if (response.ok) {
      // get json data from response
      requestResponse = await response.json(); 
      if (requestResponse.message == "video-title-changed") { 
        const availablevideoDetails = requestResponse.availableVideos; 
        basic.setNewAvailablevideoDetails(availablevideoDetails);
        // find array id of searchableVideoDataArray by videoID
        const searchableArrayItemId = basic.getSearchableVideoDataArray().findIndex(x => x.info.id === videoID);
        if (searchableArrayItemId !== -1) {// change video title from old to new
          document.getElementById(`${videoID}-title`).innerHTML = newVideoTitle;
          basic.searchableVideoDataArray[searchableArrayItemId].info.title = newVideoTitle;
          basic.notify("success",`Video Title Changed: ${newVideoTitle}`);
          return "Video Title Changed";
        } else {
          basic.notify("error", "Video Data ID Unavailable");
          return "searchable video data array id unavailable";
        }
      } else {
        basic.notify("error","Failed to Change Video Title"); 
        return "Failed to Change Video Title";
      }
    } else {
      basic.notify("error","Failed to Change Video Title"); 
      return "Failed to Change Video Title";
    } 
  } catch (error) {
    basic.notify("error","Failed fetch: Change Video Title");  
    return error;
  }
}

// close edit menu button
export function backToViewAvailableVideoButton(video_edit_body, video_edit_container, option_menu) {
  try {
    if (video_edit_body == undefined || video_edit_container == undefined || option_menu == undefined ) {  
      return "backToViewAvailableVideoButton didnt work";
    } else {
      const backToMainVideoButton = document.createElement("button");
      option_menu.title = "menu";
      backToMainVideoButton.title = "Close Edit mode";
      backToMainVideoButton.className =  "backToViewAvailableVideoButton fa fa-times";
      backToMainVideoButton.onclick = function(){
        document.body.style.removeProperty("overflow");
        video_edit_container.remove();
      };
      video_edit_body.appendChild(backToMainVideoButton);
      return backToMainVideoButton; 
    }
  } catch (error) {
    return "backToViewAvailableVideoButton didnt work";
  }
}

// send request to server to delete video and all video data permently from the system
export async function deleteVideoDataPermanently(videoID, savedVideosThumbnailContainer) {
  try { 
    const payload = {
      id: videoID,
      folderIDPath: folder.getFolderIDPath()
    };  
    const response = await fetch("../delete-video-data-permanently", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }); 
    let deleteVideoStatus;
    if (response.ok) { 
      deleteVideoStatus = await response.json();
      if (deleteVideoStatus == `video-id-${videoID}-data-permanently-deleted`) {
        //remove video from /saved/videos
        document.getElementById(videoID).remove();
        // delete searchable array item 
        const searchableArrayItemId = basic.getSearchableVideoDataArray().findIndex(x => x.info.id === videoID);
        basic.deleteIDFromSearchableVideoDataArray(searchableArrayItemId);
        // update Available Videos Container if no availabe videos
        if (savedVideosThumbnailContainer.childElementCount == 0) {
          if(basic.getSearchableVideoDataArray().length == 0 ){
            savedVideosThumbnailContainer.remove();
            if (document.getElementById("searchBar")) {
              document.getElementById("searchBar").remove(); 
            }
            const noAvailableVideosContainer = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer");
            basic.createSection(noAvailableVideosContainer, "h1", "noAvailableVideosHeader", undefined,  "There has been no recorded/downloaded videos.");
          } else {
            const noSearchableVideoData = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer", "noSearchableVideoData");
            basic.createSection(noSearchableVideoData, "h1", "noAvailableVideosHeader", undefined,  "No results found: Try different keywords");
          }
        }
        basic.notify("success",`Deleted: ${videoID}`);
        return `video-id-${videoID}-data-permanently-deleted`;
      } else {
        basic.notify("error",`Failed Delete: ${videoID}`);
        return `video-id-${videoID}-data-failed-to-permanently-deleted`;
      }  
    } else { 
      basic.notify("error","Failed Fetch: Video Deletion");
      return "Failed to Complete Request";
    } 
  } catch (error) {  
    basic.notify("error","Failed Fetch: Video Deletion");
    return error;
  }
}

// find video by filtering trough each available video by textinput
export function searchBar(container){
  // create search input
  const searchBar = basic.inputType(container, "text", "searchBar", "searchBar", true);
  searchBar.name = "searchBar";
  searchBar.placeholder="Type to search";
  // filters trough video data by name at every key press
  searchBar.addEventListener("keyup", (e) => { 
    const searchString = e.target.value;
    searchBarKeyUp(searchString);
  });
  return "searchBar";
}

// filters trough video data by searchString input
export function searchBarKeyUp(searchString) { 
  if (typeof searchString == "string") {
    const savedVideosThumbnailContainer = document.getElementById("savedVideosThumbnailContainer");
    const noSearchableVideoData = document.getElementById("noSearchableVideoData");
    // check from searchableVideoDataArray if any video data title matches input string
    const filteredsearchableVideoData = basic.getSearchableVideoDataArray().filter((video) => {
      return (
        video.info.title.toLowerCase().includes(searchString.toLowerCase())
      );
    }); 
    // clear savedVideosThumbnailContainer
    savedVideosThumbnailContainer.innerHTML = ""; 
    // check if inputed key phrase available data is avaiable or not to either display data or state the problem
    if (filteredsearchableVideoData.length == 0) {
      //  check if filtered available data is avaiable or not to show the correct msg
      if (basic.getSearchableVideoDataArray().length == 0) {
        if (savedVideosThumbnailContainer) {      
          const noAvailableVideosContainer = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer");
          basic.createSection(noAvailableVideosContainer, "h1", "noAvailableVideosHeader", undefined,  "There has been no recorded/downloaded videos.");
        } 
        return "no avaiable video data";
      } else { 
        if (!noSearchableVideoData) {
          const noSearchableVideoData = basic.createSection(basic.websiteContentContainer(), "section", "noAvailableVideosContainer", "noSearchableVideoData");
          basic.createSection(noSearchableVideoData, "h1", "noAvailableVideosHeader", undefined,  "No results found: Try different keywords");
        }  
        return "key phrase unavailable";
      }
    } else {
      //  remove noSearchableVideoDatacontaier if exits
      if(noSearchableVideoData){ 
        noSearchableVideoData.remove();
      }
      // display filterd details to client
      filteredsearchableVideoData.forEach(function(data) {   
        if (data.info.id.includes("folder-")) {
          showFolderDetails(savedVideosThumbnailContainer, data.info.id, data);
        } else { 
          showDetails(savedVideosThumbnailContainer, data.info.id, data);
        } 
      });
      return "Display filterd avaiable video data";
    } 
  } else {
    return "searchString not string";
  }
}

// load pageLoaded to html page when requested
export function pageLoaded() {
  loadVideoDetails();
  return "pageLoaded";
}
