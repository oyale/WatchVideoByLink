const streamVideo = require("../../backend/scripts/streamVideo");
const { v4: uuidv4 } = require("uuid");
const ffprobe_path = "./ffprobe.exe";
const ffmpeg_path = "./ffmpeg.exe";
const untrunc_path = "untrunc.exe";
const working_video_path = "./media/working-video/video.mp4";

beforeAll(() => {    
    streamVideo.update_user_settings_path("__tests__/data/user-settings.test.json");
    streamVideo.update_data_videos_path("__tests__/data/data-videos.test.json");
    streamVideo.update_available_videos_path("__tests__/data/available-videos.test.json");
    streamVideo.update_current_download_videos_path("__tests__/data/current-download-videos.test.json"); 
});

afterAll(() => {    
    streamVideo.update_user_settings_path("data/user-settings.json");
    streamVideo.update_data_videos_path("data/data-videos.json");
    streamVideo.update_available_videos_path("data/available-videos.json");
    streamVideo.update_current_download_videos_path("data/current-download-videos.json"); 
}); 

describe("update_user_settings_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_user_settings_path("__tests__/data/user-settings.test.json");
    });

    it("invalid path", () =>  {
        const updated = streamVideo.update_user_settings_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = streamVideo.update_user_settings_path("__tests__/backend/streamVideo.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("userSettings updated", () =>  {
        const updated = streamVideo.update_user_settings_path("__tests__/data/user-settings.test.json");
        expect(updated).toBe("userSettings updated");  
    }); 
}); 

describe("update_data_videos_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_data_videos_path("__tests__/data/data-videos.test.json");
    });

    it("invalid path", () =>  {
        const updated = streamVideo.update_data_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = streamVideo.update_data_videos_path("__tests__/backend/streamVideo.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("videoData updated", () =>  {
        const updated = streamVideo.update_data_videos_path("__tests__/data/data-videos.test.json");
        expect(updated).toBe("videoData updated");  
    }); 
}); 

describe("update_available_videos_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_available_videos_path("__tests__/data/available-videos.test.json");
    });

    it("invalid path", () =>  {
        const updated = streamVideo.update_available_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = streamVideo.update_available_videos_path("__tests__/backend/streamVideo.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("availableVideos updated", () =>  {
        const updated = streamVideo.update_available_videos_path("__tests__/data/available-videos.test.json");
        expect(updated).toBe("availableVideos updated");  
    }); 
}); 

describe("update_current_download_videos_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_current_download_videos_path("__tests__/data/current-download-videos.test.json");
    });

    it("invalid path", () =>  {
        const updated = streamVideo.update_current_download_videos_path();
        expect(updated).toBe("invalid path");  
    });

    it("input path not json", () =>  {
        const updated = streamVideo.update_current_download_videos_path("__tests__/backend/streamVideo.test.js");
        expect(updated).toBe("input path not json");  
    }); 

    it("currentDownloadVideos updated", () =>  {
        const updated = streamVideo.update_current_download_videos_path("__tests__/data/current-download-videos.test.json");
        expect(updated).toBe("currentDownloadVideos updated");  
    }); 
}); 

describe("update_ffprobe_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_ffprobe_path(ffprobe_path);
    });

    it("update", () =>  {
        const updated = streamVideo.update_ffprobe_path("yaya");
        expect(updated).toBe("yaya");  
    }); 
}); 

describe("update_ffmpeg_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_ffmpeg_path(ffmpeg_path);
    });

    it("update", () =>  {
        const updated = streamVideo.update_ffmpeg_path("test");
        expect(updated).toBe("test");  
    }); 
}); 

describe("update_untrunc_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_untrunc_path(untrunc_path);
    });

    it("update", () =>  {
        const updated = streamVideo.update_untrunc_path("test");
        expect(updated).toBe("test");  
    }); 
}); 

describe("update_working_video_path", () =>  {  
    afterAll(() => { 
        streamVideo.update_working_video_path(working_video_path);
    });

    it("update", () =>  {
        const updated = streamVideo.update_working_video_path("test");
        expect(updated).toBe("test");  
    }); 
}); 

describe("getAllVideoData", () =>  {  
    it("JSON Object", () =>  {
        const getAllVideoData = streamVideo.getAllVideoData();
        expect.objectContaining(getAllVideoData);
        expect(getAllVideoData).toMatchObject({});
    }); 
}); 

describe("resetVideoData", () =>  {   
    it("reset", () =>  {
        const resetVideoData = streamVideo.resetVideoData();
        expect(resetVideoData).toBe("resetVideoData"); 
        const getAllVideoData = streamVideo.getAllVideoData();
        expect(Object.keys(getAllVideoData).length).toBe(0); 
        expect.objectContaining(getAllVideoData);
        expect(getAllVideoData).toMatchObject({});
    }); 
}); 

describe("findVideosByID", () =>  {
    const id = uuidv4();
    beforeAll(() => {       
        streamVideo.updateVideoDataByID(id, {
            "video": { 
                "download": "completed"
            },
            "thumbnail": { 
                "download": "completed"
            }
        });
    });

    afterAll(() => { 
        streamVideo.resetVideoData();
    });

    it("Avaiable Video Data", () =>  {
        const findVideosByID = streamVideo.findVideosByID(id);
        expect(findVideosByID).toBeDefined(); 
        expect(findVideosByID.video.download).toBe("completed"); 
        expect(findVideosByID.thumbnail.download).toBe("completed"); 
        streamVideo.deleteVideoDataByID(id);
    });

    it("UnAvaiable Video Data", () =>  {
        const findVideosByID = streamVideo.findVideosByID();
        expect(findVideosByID).toBeUndefined();
    });
}); 

describe("updateVideoDataByID", () =>  { 
    afterAll(() => {  
        streamVideo.resetVideoData();
    });

    it("Update Video Data", () =>  {
        const id = uuidv4();
        const updateVideoDataByID = streamVideo.updateVideoDataByID(id, {
            "video": { 
                "download": "completed"
            },
            "thumbnail": { 
                "download": "completed"
            }
        });
        expect(updateVideoDataByID).toBeDefined(); 
        expect(updateVideoDataByID.video.download).toBe("completed"); 
        expect(updateVideoDataByID.thumbnail.download).toBe("completed"); 
        streamVideo.deleteVideoDataByID(id);
    });
}); 

describe("deleteVideoDataByID", () =>  { 
    const id_1 = uuidv4();
    beforeAll(() => {       
        streamVideo.updateVideoDataByID(id_1, {
            "video": { 
                "download": "completed"
            },
            "thumbnail": { 
                "download": "completed"
            }
        });
    });

    afterAll(() => {  
        streamVideo.resetVideoData();
    });

    it("Delete Video Data", () =>  {
        const deleteVideoDataByID = streamVideo.deleteVideoDataByID(id_1);
        expect(deleteVideoDataByID).toBe(`Deleted ${id_1}`);   
    });

    it("VideoID Unavaiable", () =>  {
        const id_2 = uuidv4();
        const deleteVideoDataByID = streamVideo.deleteVideoDataByID(id_2);
        expect(deleteVideoDataByID).toBe(`${id_2} Unavaiable`);   
    });
}); 

describe("getAllAvailableVideos", () =>  {  
    it("JSON Object", () =>  {
        const getAllAvailableVideos = streamVideo.getAllAvailableVideos();
        expect(getAllAvailableVideos).toBeDefined();   
        expect.objectContaining(getAllAvailableVideos);
    }); 
}); 

describe("resetAvailableVideos", () =>  {  
    it("reset", () =>  {
        const resetAvailableVideos = streamVideo.resetAvailableVideos();
        expect(resetAvailableVideos).toBe("resetAvailableVideos"); 
        const getAllAvailableVideos = streamVideo.getAllAvailableVideos();
        expect(Object.keys(getAllAvailableVideos).length).toBe(0); 
        expect(getAllAvailableVideos).toMatchObject({});
    }); 
}); 

describe("findAvailableVideosByID", () =>  {    
    const id = uuidv4();
    beforeAll(() => {       
        streamVideo.updateAvailableVideosByID(id, {
            "info": {
                "title": "test",
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
    }); 

    afterAll(() => { 
        streamVideo.resetAvailableVideos();
    });

    it("Avaiable Video Data", () =>  {
        const findAvailableVideosByID = streamVideo.findAvailableVideosByID(id);
        expect(findAvailableVideosByID).toBeDefined(); 
        expect(findAvailableVideosByID.info.title).toBe("test"); 
        expect(findAvailableVideosByID.info.videoLink.src).toBe(`/video/${id}`); 
        expect(findAvailableVideosByID.info.thumbnailLink["1"]).toBe(`/thumbnail/${id}/1`); 
    });

    it("UnAvaiable Video Data", () =>  {
        const findAvailableVideosByID = streamVideo.findAvailableVideosByID();
        expect(findAvailableVideosByID).toBeUndefined();
    }); 
}); 

describe("updateAvailableVideosByID", () =>  {     
    afterAll(() => {  
        streamVideo.resetAvailableVideos();
    });

    it("Update Video Data", () =>  {
        const id = uuidv4();
        const updateAvailableVideosByID = streamVideo.updateAvailableVideosByID(id, {
            "info": {
                "title": "test",
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
        expect(updateAvailableVideosByID).toBeDefined(); 
        expect(updateAvailableVideosByID.info.title).toBe("test"); 
        expect(updateAvailableVideosByID.info.videoLink.src).toBe(`/video/${id}`); 
        expect(updateAvailableVideosByID.info.thumbnailLink["1"]).toBe(`/thumbnail/${id}/1`); 
    });
}); 

describe("deleteAvailableVideosByID", () =>  {   
    const id_1 = uuidv4();
    beforeAll(() => {       
        streamVideo.updateAvailableVideosByID(id_1, {
            "info": {
                "title": "test",
                "videoLink": {
                    "src": `/video/${id_1}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id_1}/1`,
                    "2": `/thumbnail/${id_1}/2`,
                    "3": `/thumbnail/${id_1}/3`,
                    "4": `/thumbnail/${id_1}/4`,
                    "5": `/thumbnail/${id_1}/5`,
                    "6": `/thumbnail/${id_1}/6`,
                    "7": `/thumbnail/${id_1}/7`,
                    "8": `/thumbnail/${id_1}/8`
                }
            }
        });
    });

    afterAll(() => {  
        streamVideo.resetVideoData();
    });

    it("Delete Video Data", () =>  {
        const deleteVideoDataByID = streamVideo.deleteAvailableVideosByID(id_1);
        expect(deleteVideoDataByID).toBe(`Deleted ${id_1}`);   
    });

    it("VideoID Unavaiable", () =>  {
        const id_2 = uuidv4();
        const deleteVideoDataByID = streamVideo.deleteAvailableVideosByID(id_2);
        expect(deleteVideoDataByID).toBe(`${id_2} Unavaiable`);   
    });  
}); 

describe("currentDownloads", () =>  {  
    it("JSON Object", () =>  {
        const currentDownloads = streamVideo.currentDownloads();
        expect(currentDownloads).toBeDefined();   
        expect.objectContaining(currentDownloads);
    }); 
}); 

describe("resetCurrentDownloadVideos", () =>  {  
    it("reset", () =>  {
        const resetCurrentDownloadVideos = streamVideo.resetCurrentDownloadVideos();
        expect(resetCurrentDownloadVideos).toBe("resetCurrentDownloadVideos"); 
        const currentDownloads = streamVideo.currentDownloads();
        expect(Object.keys(currentDownloads).length).toBe(0); 
        expect(currentDownloads).toMatchObject({});
    }); 
}); 

describe("findCurrentDownloadByID", () =>  {
    const id = uuidv4();
    beforeAll(() => {       
        streamVideo.updateCurrentDownloadByID(id, {
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
                "download-status": "20.00%"
            }
        });
    });

    afterAll(() => { 
        streamVideo.resetCurrentDownloadVideos();
    });

    it("Avaiable: Current Video Download Data", () =>  {
        const findCurrentDownloadByID = streamVideo.findCurrentDownloadByID(id);
        expect(findCurrentDownloadByID).toBeDefined(); 
        expect(findCurrentDownloadByID.video["download-status"]).toBe("completed"); 
        expect(findCurrentDownloadByID.thumbnail["download-status"]).toBe("20.00%"); 
        streamVideo.deleteCurrentDownloadByID(id);
    });

    it("UnAvaiable: Current Video Download Data", () =>  {
        const findCurrentDownloadByID = streamVideo.findCurrentDownloadByID();
        expect(findCurrentDownloadByID).toBeUndefined();
    });
});

describe("updateCurrentDownloadByID", () =>  { 
    const id = uuidv4();
    afterAll(() => { 
        streamVideo.resetCurrentDownloadVideos();
    });

    it("Update Video Data", () =>  {
        const updateCurrentDownloadByID = streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "unfinished download"
            },
            "thumbnail": {
                "download-status": "waiting for video"
            }
        });
        expect(updateCurrentDownloadByID).toBeDefined(); 
        expect(updateCurrentDownloadByID.video["download-status"]).toBe("unfinished download"); 
        expect(updateCurrentDownloadByID.thumbnail["download-status"]).toBe("waiting for video"); 
        streamVideo.deleteCurrentDownloadByID(id);
    });
}); 

describe("deleteCurrentDownloadByID", () =>  { 
    const id_1 = uuidv4();
    beforeAll(() => {       
        streamVideo.updateCurrentDownloadByID(id_1, { 
            "video": {
                "download-status": "unfinished download"
            },
            "thumbnail": {
                "download-status": "waiting for video"
            }
        });
    });

    afterAll(() => { 
        streamVideo.resetCurrentDownloadVideos();
    });

    it("Delete Video Data", () =>  {
        const deleteCurrentDownloadByID = streamVideo.deleteCurrentDownloadByID(id_1);
        expect(deleteCurrentDownloadByID).toBe(`Deleted ${id_1}`);   
    });  

    it("VideoID Unavaiable", () =>  {
        const id_2 = uuidv4();
        const deleteCurrentDownloadByID = streamVideo.deleteCurrentDownloadByID(id_2);
        expect(deleteCurrentDownloadByID).toBe(`${id_2} Unavaiable`);   
    });
}); 

describe("cheackForAvailabeUnFinishedVideoDownloads", () =>  {    
    afterAll(() => { 
        streamVideo.resetCurrentDownloadVideos();
    });

    it("video unavailable", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, {  
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined(); 
        streamVideo.deleteCurrentDownloadByID(id);   
    }); 

    it("video - starting stream download", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "starting stream download"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();   
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video - starting full video download", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "starting full video download"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();  
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video - starting trim video download", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "starting trim video download"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();   
        streamVideo.deleteCurrentDownloadByID(id);
    });

    it("video - starting uploaded video download", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "starting uploaded video download"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();    
        streamVideo.deleteCurrentDownloadByID(id);
    });

    it("video - 0.00%", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "0.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();    

        streamVideo.deleteCurrentDownloadByID(id);
    });
 
    it("video - untrunc is unavailable", () =>  {   
        const id = uuidv4();
        streamVideo.update_untrunc_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "20.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("untrunc unavailable");   
   
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_untrunc_path(untrunc_path);
    }); 
 
    it("video - working-video/video.mp4 is unavailable", () =>  {  
        const id = uuidv4();
        streamVideo.update_working_video_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "20.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("working video for untrunc is unavailable");   
   
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_working_video_path(working_video_path);
    }); 
    
    it("video - unfinnished", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "20.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("unfinished download");   
   
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("thumbnail false compression false - unavailable ffmpeg & ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");
        streamVideo.update_ffprobe_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.thumbnail["download-status"]).toBe("ffmpeg and ffprobe unavailable");   
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);
        streamVideo.update_ffprobe_path(ffprobe_path);
    }); 

    it("thumbnail false compression false - unavailable ffmpeg", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.thumbnail["download-status"]).toBe("ffmpeg unavailable");   
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);
    }); 

    it("thumbnail false compression false - unavailable ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffprobe_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.thumbnail["download-status"]).toBe("ffprobe unavailable");   
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffprobe_path(ffprobe_path);
    }); 

    it("thumbnail false compression false - update thumbanil unfinnished", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("unfinished download");   
   
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("thumbnail false compression true - compression completed - unavailable ffmpeg & ffprobe", () =>  {  
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");
        streamVideo.update_ffprobe_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg and ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);
        streamVideo.update_ffprobe_path(ffprobe_path);
    }); 

    it("thumbnail false compression true - compression unfinnised - unavailable ffmpeg & ffprobe", () =>  {  
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");
        streamVideo.update_ffprobe_path("");
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffmpeg and ffprobe unavailable");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg and ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);
        streamVideo.update_ffprobe_path(ffprobe_path);
    }); 

    it("thumbnail false compression true - compression completed - unavailable ffmpeg", () =>  {  
        const id = uuidv4();
        streamVideo.update_ffmpeg_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path); 
    }); 

    it("thumbnail false compression true - compression unfinnised - unavailable ffmpeg", () =>  {  
        const id = uuidv4();
        streamVideo.update_ffmpeg_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffmpeg unavailable");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path); 
    });  

    it("thumbnail false compression true - compression completed - unavailable ffprobe", () =>  {  
        const id = uuidv4();
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffprobe_path); 
    }); 

    it("thumbnail false compression true - compression unfinnised - unavailable ffprobe", () =>  {  
        const id = uuidv4();
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
                "download-status": "20.00%"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffprobe unavailable");
        expect(check.thumbnail["download-status"]).toBe("ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffprobe_path(ffprobe_path); 
    });   

    it("thumbnail false compression true - compression completed", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "completed"
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("unfinished download");   
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("thumbnail false compression true - compression unfinnished", () =>  {  
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("unfinished download");
        expect(check.thumbnail["download-status"]).toBe("unfinished download");   
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("thumbnail true compression false - unavailable ffmpeg & ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path(""); 
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed");   
        expect(check.thumbnail["download-status"]).toBe("ffmpeg and ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path); 
        streamVideo.update_ffprobe_path(ffprobe_path);     
    }); 

    it("thumbnail true compression false - unavailable ffmpeg", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");  
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed");   
        expect(check.thumbnail["download-status"]).toBe("ffmpeg unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);     
    }); 

    it("thumbnail true compression false - unavailable ffprobe", () =>  {   
        const id = uuidv4(); 
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed");   
        expect(check.thumbnail["download-status"]).toBe("ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id); 
        streamVideo.update_ffprobe_path(ffprobe_path);
    }); 

    it("thumbnail true compression false - thumbnail completed", () =>  {   
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
              "download-status": "completed"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();  
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("thumbnail true compression false - thumbnail unfinnished", () =>  {   
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "thumbnail": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.thumbnail["download-status"]).toBe("unfinished download");   
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("thumbnail && compression true - thumbnail completed compression not completed - unavailable ffmpeg & ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path(""); 
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20%"  
            },
            "thumbnail": {
              "download-status": "completed"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffmpeg and ffprobe unavailable");
        expect(check.thumbnail["download-status"]).toBe("completed");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path); 
        streamVideo.update_ffprobe_path(ffprobe_path);    
    }); 

    it("thumbnail && compression true - thumbnail completed not compression completed - unavailable ffmpeg & ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path(""); 
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "completed"  
            },
            "thumbnail": {
              "download-status": "20%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg and ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path); 
        streamVideo.update_ffprobe_path(ffprobe_path);    
    }); 
    
    it("thumbnail && compression true - thumbnail compression not completed - unavailable ffmpeg & ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path(""); 
        streamVideo.update_ffprobe_path(""); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20%" 
            },
            "thumbnail": {
              "download-status": "20%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffmpeg and ffprobe unavailable");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg and ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path); 
        streamVideo.update_ffprobe_path(ffprobe_path);    
    }); 

    it("thumbnail && compression true - thumbnail completed compression not completed - unavailable ffmpeg", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");  
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20%"  
            },
            "thumbnail": {
              "download-status": "completed"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffmpeg unavailable");
        expect(check.thumbnail["download-status"]).toBe("completed");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);    
    }); 

    it("thumbnail && compression true - thumbnail completed not compression completed - unavailable ffmpeg", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");  
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "completed"  
            },
            "thumbnail": {
              "download-status": "20%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);    
    }); 
    
    it("thumbnail && compression true - thumbnail compression not completed - unavailable ffmpeg", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffmpeg_path("");   
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20%" 
            },
            "thumbnail": {
              "download-status": "20%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffmpeg unavailable");
        expect(check.thumbnail["download-status"]).toBe("ffmpeg unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffmpeg_path(ffmpeg_path);   
    }); 

    it("thumbnail && compression true - thumbnail completed compression not completed - unavailable ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffprobe_path("");  
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20%"  
            },
            "thumbnail": {
              "download-status": "completed"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffprobe unavailable");
        expect(check.thumbnail["download-status"]).toBe("completed");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffprobe_path(ffprobe_path);    
    }); 

    it("thumbnail && compression true - thumbnail completed not compression completed - unavailable ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffprobe_path("");  
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "completed"  
            },
            "thumbnail": {
              "download-status": "20%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");
        expect(check.thumbnail["download-status"]).toBe("ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffprobe_path(ffprobe_path);    
    }); 
    
    it("thumbnail && compression true - thumbnail compression not completed - unavailable ffprobe", () =>  {   
        const id = uuidv4();
        streamVideo.update_ffprobe_path("");   
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20%" 
            },
            "thumbnail": {
              "download-status": "20%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeDefined();   
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("ffprobe unavailable");
        expect(check.thumbnail["download-status"]).toBe("ffprobe unavailable");      
        streamVideo.deleteCurrentDownloadByID(id);
        streamVideo.update_ffprobe_path(ffprobe_path);   
    });    

    it("thumbnail && compression true - thumbnail compression completed", () =>  {   
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "completed"  
            },
            "thumbnail": {
              "download-status": "completed"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined();   
    });
        
    it("thumbnail && compression true - thumbnail completed compression unfinnished", () =>  {   
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20.00%"  
            },
            "thumbnail": {
              "download-status": "completed"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("unfinished download");   
        expect(check.thumbnail["download-status"]).toBe("completed");   
        streamVideo.deleteCurrentDownloadByID(id);
    });
        
    it("thumbnail && compression true - thumbnail unfinnished compression completed", () =>  {   
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "completed"  
            },
            "thumbnail": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("completed");   
        expect(check.thumbnail["download-status"]).toBe("unfinished download");   
        streamVideo.deleteCurrentDownloadByID(id);
    });
    
    it("thumbnail && compression true - thumbnail compression unfinnished", () =>  {   
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, { 
            "video": {
                "download-status": "completed"
            },
            "compression": {
              "download-status": "20.00%"    
            },
            "thumbnail": {
              "download-status": "20.00%"  
            }
        });
        streamVideo.cheackForAvailabeUnFinishedVideoDownloads();
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check.video["download-status"]).toBe("completed"); 
        expect(check.compression["download-status"]).toBe("unfinished download");   
        expect(check.thumbnail["download-status"]).toBe("unfinished download");   
        streamVideo.deleteCurrentDownloadByID(id);
    });
}); 
 
describe("completeUnfinnishedVideoDownload", () =>  {   
    afterAll(() => { 
        streamVideo.resetCurrentDownloadVideos();
    });

    it("video true, thumbnail true, compression true - download status: completed", () =>  {
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "completed"
            }
        });
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload(id);
        expect(completeUnfinnishedDownload).toBe("download status: completed");
        const check = streamVideo.findCurrentDownloadByID(id);
        expect(check).toBeUndefined(); 
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video true, thumbnail false, compression true - redownload thumbnails", () =>  {
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload(id);
        expect(completeUnfinnishedDownload).toBe("redownload thumbnails");
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video true, thumbnail true, compression false - redownload compression", () =>  {
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "unfinished download"
            },
            "thumbnail": { 
                "download-status": "completed"
            }
        });
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload(id);
        expect(completeUnfinnishedDownload).toBe("redownload compression"); 
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video true, thumbnail false, compression undefined - redownload thumbnails", () =>  {
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, {
            "video": { 
                "download-status": "completed"
            },
            "thumbnail": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload(id);
        expect(completeUnfinnishedDownload).toBe("redownload thumbnails"); 
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video true, thumbnail false, compression undefined - redownload thumbnails & compression", () =>  {
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, {
            "video": { 
                "download-status": "completed"
            },
            "compression": { 
                "download-status": "unfinished download"
            },
            "thumbnail": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload(id);
        expect(completeUnfinnishedDownload).toBe("redownload thumbnails & compression"); 
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("video false, thumbnail false, compression undefined - untrunc broke video", () =>  {
        const id = uuidv4(); 
        streamVideo.updateCurrentDownloadByID(id, {
            "video": { 
                "download-status": "unfinished download"
            }
        });
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload(id);
        expect(completeUnfinnishedDownload).toBe("untrunc broke video"); 
        streamVideo.deleteCurrentDownloadByID(id);
    }); 

    it("invalid current downloads id", () =>  {
        const completeUnfinnishedDownload = streamVideo.completeUnfinnishedVideoDownload();
        expect(completeUnfinnishedDownload).toBe("invalid current downloads id");  
    });
}); 

describe("updateVideoPlayerVolume", () =>  {
    afterAll(() => { 
        streamVideo.updateVideoPlayerVolume(1, false);
    });

    it("updated-video-player-volume", () =>  {   
        const updateVolume = streamVideo.updateVideoPlayerVolume(0.1, true);
        expect(updateVolume).toBe("updated-video-player-volume");
    }); 

    it("muted-invaid", () =>  {   
        const updateVolume = streamVideo.updateVideoPlayerVolume(0.1, undefined);
        expect(updateVolume).toBe("muted-invaid");
    }); 

    it("volume-invaid", () =>  {   
        const updateVolume = streamVideo.updateVideoPlayerVolume(undefined, false);
        expect(updateVolume).toBe("volume-invaid");
    }); 

    it("volume-muted-invaid", () =>  {   
        const updateVolume = streamVideo.updateVideoPlayerVolume(undefined, undefined);
        expect(updateVolume).toBe("volume-muted-invaid");
    }); 
}); 

describe("getVideoPlayerSettings", () =>  {
    it("JSON Object", () =>  {
        const videoPlayerSettings = streamVideo.getVideoPlayerSettings();
        expect(videoPlayerSettings).toBeDefined();   
        expect.objectContaining(videoPlayerSettings);
    }); 

    it("Available - volume, muted, chromecast", () =>  {
        const videoPlayerSettings = streamVideo.getVideoPlayerSettings();
        expect(videoPlayerSettings.volume).toBeDefined();    
        expect(videoPlayerSettings.muted).toBeDefined();  
        expect(videoPlayerSettings.chromecast).toBeDefined();     
    }); 
}); 

describe("stopDownloadVideoStream", () =>  { 
    const id = uuidv4();
    beforeAll(() => {   
        streamVideo.updateVideoDataByID(id, {
            "video": { 
                "download": "20.00%"
            },
            compression : { 
              "download-status" : "waiting for video"
            },
            thumbnail : { 
              "download-status" : "waiting for video"
            } 
        });
    });

    afterAll(() => {  
        streamVideo.resetVideoData();
    });

    it("valid id", async () =>  {
        const stopDownload = await streamVideo.stopDownloadVideoStream(id);
        expect(stopDownload).toBe("stoped video stream download");   
    }); 

    it("invalid id", async () =>  {
        const stopDownload = await streamVideo.stopDownloadVideoStream();
        expect(stopDownload).toBe("videoDetails dosnet exists");   
    }); 
}); 

describe("checkIfVideoSrcOriginalPathExits", () =>  {   
    afterAll(() => {  
        streamVideo.resetVideoData();
    });

    it("video valid id and data", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "video": {
                "originalVideoSrc" : "videoSrc",
                "originalVideoType" : "videoType",
                "path": "videoFilePath",
                "videoType" : "video/mp4",
                "download" : "completed",
              },
              "compression" : {
                "path": "compressionFilePath",
                "videoType": "video/webm",
                "download": "completed"
              },
              "thumbnail": {
                "path": {},
                "download": "completed"
              }
          });
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/video/${id}`);
        expect(stopDownload).toBe("videoFilePath");
    }); 

    it("video valid id invalid data", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, { 
          });
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/video/${id}`);
        expect(stopDownload).toBe(`http://localhost:8080/video/${id}`);
    }); 

    it("video invalid id", async () =>  { 
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits("http://localhost:8080/video/invalid");
        expect(stopDownload).toBe("http://localhost:8080/video/invalid");
    }); 

    it("compressed valid id and valid data", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "video": {
                "originalVideoSrc" : "videoSrc",
                "originalVideoType" : "videoType",
                "path": "videoFilePath",
                "videoType" : "video/mp4",
                "download" : "completed",
              },
              "compression" : {
                "path": "compressionFilePath",
                "videoType": "video/webm",
                "download": "completed"
              },
              "thumbnail": {
                "path": {},
                "download": "completed"
              }
          });
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/compressed/${id}`);
        expect(stopDownload).toBe("videoFilePath");
    }); 

    it("compression valid id invalid data", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, { 
          });
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits(`http://localhost:8080/compressed/${id}`);
        expect(stopDownload).toBe(`http://localhost:8080/compressed/${id}`);
    }); 

    it("compression invalid id", async () =>  { 
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits("http://localhost:8080/compressed/invalid");
        expect(stopDownload).toBe("http://localhost:8080/compressed/invalid");
    }); 

    it("Video src doesn't contain video or compression", async () =>  {
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits("URL");
        expect(stopDownload).toBe("URL");
    });  
    
    it("no input", async () =>  {
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits();
        expect(stopDownload).toBe(undefined);
    });  
        
    it("undefined input", async () =>  {
        const stopDownload = await streamVideo.checkIfVideoSrcOriginalPathExits(undefined);
        expect(stopDownload).toBe(undefined);
    });  
}); 

describe("updateCompressVideoDownload", () =>  { 
    afterAll(() => {  
        streamVideo.updateCompressVideoDownload("downloadVideoStream", true);
        streamVideo.updateCompressVideoDownload("downloadVideo", true);
        streamVideo.updateCompressVideoDownload("trimVideo", true);
        streamVideo.updateCompressVideoDownload("downloadUploadedVideo", true);
    });

    it("update downloadVideoStream true", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadVideoStream", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideoStream updated");
    }); 
     
    it("update downloadVideoStream false", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadVideoStream", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideoStream updated");
    });  

    it("update downloadVideo true", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideo updated");
    });    

    it("update downloadVideo false", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadVideo updated");
    });    

    it("update trimVideo true", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("trimVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download trimVideo updated");
    }); 

    it("update trimVideo false", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("trimVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download trimVideo updated");
    }); 

    it("update downloadUploadedVideo true", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadUploadedVideo", true);
        expect(updateCompressVideoDownload).toBe("compress video download downloadUploadedVideo updated");
    });    

    it("update downloadUploadedVideo false", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadUploadedVideo", false);
        expect(updateCompressVideoDownload).toBe("compress video download downloadUploadedVideo updated");
    });  

    it("invalid bool", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("downloadUploadedVideo", "test");
        expect(updateCompressVideoDownload).toBe("invalid bool");
    });  
    
    it("invalid download type", () =>  {
        const updateCompressVideoDownload = streamVideo.updateCompressVideoDownload("test", true);
        expect(updateCompressVideoDownload).toBe("invalid download type");
    });  
}); 

describe("checkIfVideoCompress", () =>  {   
    afterAll(() => {  
        streamVideo.updateCompressVideoDownload("downloadVideoStream", true);
        streamVideo.updateCompressVideoDownload("downloadVideo", true);
        streamVideo.updateCompressVideoDownload("trimVideo", true);
        streamVideo.updateCompressVideoDownload("downloadUploadedVideo", true);
    });

    it("downloadVideoStream true", () =>  {
        streamVideo.updateCompressVideoDownload("downloadVideoStream", true);
        const videoCompress = streamVideo.checkIfVideoCompress("downloadVideoStream");
        expect(videoCompress).toBe(true);
    });  

    it("downloadVideoStream false", () =>  {
        streamVideo.updateCompressVideoDownload("downloadVideoStream", false);
        const videoCompress = streamVideo.checkIfVideoCompress("downloadVideoStream");
        expect(videoCompress).toBe(false);
    }); 

    it("downloadVideo true", () =>  {
        streamVideo.updateCompressVideoDownload("downloadVideoStream", true);
        const videoCompress = streamVideo.checkIfVideoCompress("downloadVideoStream");
        expect(videoCompress).toBe(true);
    });    
    
    it("downloadVideo false", () =>  {
        streamVideo.updateCompressVideoDownload("downloadVideo", false);
        const videoCompress = streamVideo.checkIfVideoCompress("downloadVideo");
        expect(videoCompress).toBe(false);
    }); 

    it("trimVideo true", () =>  {
        streamVideo.updateCompressVideoDownload("trimVideo", true);
        const videoCompress = streamVideo.checkIfVideoCompress("trimVideo");
        expect(videoCompress).toBe(true);
    }); 

    it("trimVideo false", () =>  {
        streamVideo.updateCompressVideoDownload("trimVideo", false);
        const videoCompress = streamVideo.checkIfVideoCompress("trimVideo");
        expect(videoCompress).toBe(false);
    }); 

    it("downloadUploadedVideo true", () =>  {
        streamVideo.updateCompressVideoDownload("downloadUploadedVideo", true);
        const videoCompress = streamVideo.checkIfVideoCompress("downloadUploadedVideo");
        expect(videoCompress).toBe(true);
    });    

    it("downloadUploadedVideo false", () =>  {
        streamVideo.updateCompressVideoDownload("downloadUploadedVideo", false);
        const videoCompress = streamVideo.checkIfVideoCompress("downloadUploadedVideo");
        expect(videoCompress).toBe(false);
    });    
}); 

describe("stopCommpressedVideoDownload", () =>  {    
    afterAll(() => { 
        streamVideo.resetCurrentDownloadVideos();
        streamVideo.resetVideoData();
    });

    it("videoDataCompression downloading, currentDownload unavailable", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "compression" : {
              "download": 20.00
            }
        }); 

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(true);
    }); 

    it("currentDownloadCompression downloading, videoData unavailable", async () =>  {
        const id = uuidv4();
        streamVideo.updateCurrentDownloadByID(id, {
            "compression" : {
                "download-status": "20.00%"
            }
        });
        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(true);
    }); 
        
    it("currentDownloadCompression downloading, videoDataCompression downloading", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
              "compression" : {
                "download": 20.00
              }
        });
         
        streamVideo.updateCurrentDownloadByID(id, {
            "compression" : {
                "download-status": "20.00%"
            }
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(true);
    }); 
       
    it("currentDownloadCompression completed, videoDataCompression completed", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "compression" : {
              "download": "completed"
            }
        }); 
         
        streamVideo.updateCurrentDownloadByID(id, {
            "compression" : {
                "download-status": "completed"
            }
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(false);
    }); 
             
    it("currentDownloadCompression downloading, videoDataCompression completed", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "compression" : {
              "download": "completed"
            }
        }); 
         
        streamVideo.updateCurrentDownloadByID(id, {
            "compression" : {
                "download-status": "99.99%"
            }
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(false);
    }); 
              
    it("currentDownloadCompression completed, videoDataCompression downloading", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "compression" : {
              "download": 99.99
            }
        }); 
         
        streamVideo.updateCurrentDownloadByID(id, {
            "compression" : {
                "download-status": "completed"
            }
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(false);
    }); 

    it("currentDownloadCompression downloading, videoDataCompression unavailable", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, { 
        });
         
        streamVideo.updateCurrentDownloadByID(id, {
            "compression" : {
                "download-status": "20.00%"
            }
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(true);
    }); 
    
    it("currentDownloadCompression unavailable, videoDataCompression downloading", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
            "compression" : {
              "download": 20.00
            }
        }); 
    
        streamVideo.updateCurrentDownloadByID(id, {
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(true);
    });   
    
    it("currentDownloadCompression unavailable, videoDataCompression unavailable", async () =>  {
        const id = uuidv4();
        streamVideo.updateVideoDataByID(id, {
        }); 
    
        streamVideo.updateCurrentDownloadByID(id, {
        });

        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload(id);
        expect(stopCommpressedVideoDownload).toBe(false);
    }); 
    
    it("currentDownload, videoData unavailable", async () =>  {
        const stopCommpressedVideoDownload = await streamVideo.stopCommpressedVideoDownload("test");
        expect(stopCommpressedVideoDownload).toBe(false);
    }); 
});

describe("updateRearangedAvailableVideoDetails", () =>  {  
    const selectedID = uuidv4();
    const targetID = uuidv4();
    beforeAll(() => {       
        streamVideo.updateAvailableVideosByID(selectedID, {
            "info": {
                "title": "test",
                "videoLink": {
                    "src": `/video/${selectedID}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${selectedID}/1`,
                    "2": `/thumbnail/${selectedID}/2`,
                    "3": `/thumbnail/${selectedID}/3`,
                    "4": `/thumbnail/${selectedID}/4`,
                    "5": `/thumbnail/${selectedID}/5`,
                    "6": `/thumbnail/${selectedID}/6`,
                    "7": `/thumbnail/${selectedID}/7`,
                    "8": `/thumbnail/${selectedID}/8`
                }
            }
        });
        streamVideo.updateAvailableVideosByID(targetID, {
            "info": {
                "title": "test",
                "videoLink": {
                    "src": `/video/${targetID}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${targetID}/1`,
                    "2": `/thumbnail/${targetID}/2`,
                    "3": `/thumbnail/${targetID}/3`,
                    "4": `/thumbnail/${targetID}/4`,
                    "5": `/thumbnail/${targetID}/5`,
                    "6": `/thumbnail/${targetID}/6`,
                    "7": `/thumbnail/${targetID}/7`,
                    "8": `/thumbnail/${targetID}/8`
                }
            }
        });
    });  

    afterAll(() => {  
        streamVideo.resetAvailableVideos();
    });
    
    it("selectedID && targetID unavailable at availableVideos", async () =>  {
        const updateRearangedAvailableVideoDetails = await streamVideo.updateRearangedAvailableVideoDetails("unavailableID1", "unavailableID2");
        expect(updateRearangedAvailableVideoDetails).toBe("unavailableID1 && unavailableID2 unavailable at availableVideos");
    }); 
    
    it("selectedID unavailable at availableVideos", async () =>  {
        const updateRearangedAvailableVideoDetails = await streamVideo.updateRearangedAvailableVideoDetails("unavailableID", targetID);
        expect(updateRearangedAvailableVideoDetails).toBe("unavailableID unavailable at availableVideos");
    }); 

    it("targetID unavailable at availableVideos", async () =>  {
        const updateRearangedAvailableVideoDetails = await streamVideo.updateRearangedAvailableVideoDetails(selectedID, "unavailableID");
        expect(updateRearangedAvailableVideoDetails).toBe("unavailableID unavailable at availableVideos");
    }); 

    it("availableVideos updated successfully", async () =>  {
        const updateRearangedAvailableVideoDetails = await streamVideo.updateRearangedAvailableVideoDetails(selectedID, targetID);
        expect(updateRearangedAvailableVideoDetails).toBe("availableVideos updated successfully");
    }); 
}); 

describe("changeVideoTitle", () =>  {    
    const id = uuidv4();
    beforeAll(() => {       
        streamVideo.updateAvailableVideosByID(id, {
            "info": {
                "title": "test",
                "videoLink": {
                    "src": `/video/${id}`,
                    "type": "video/mp4"
                },
                "thumbnailLink": {
                    "1": `/thumbnail/${id}/1`,
                    "2": `/thumbnail/${id}/2`,
                    "3": `/thumbnail/${id}/3`,
                    "4": `/thumbnail/${id}/4`,
                    "5": `/thumbnail/${id}/5`,
                    "6": `/thumbnail/${id}/6`,
                    "7": `/thumbnail/${id}/7`,
                    "8": `/thumbnail/${id}/8`
                }
            }
        });
    }); 

    afterAll(() => {  
        streamVideo.resetAvailableVideos();
    });

    it("valid", async () =>  {
        const videoCompress = await streamVideo.changeVideoTitle(id, "new video title");
        expect(videoCompress).toBe("video-title-changed");
        const findAvailableVideosByID = streamVideo.findAvailableVideosByID(id);
        expect(findAvailableVideosByID.info.title).toBe("new video title"); 
    });  

    
    it("invalid newVideoTitle", async () =>  {
        const videoCompress = await streamVideo.changeVideoTitle(id);
        expect(videoCompress).toBe("failed-to-change-video-title");
        const findAvailableVideosByID = streamVideo.findAvailableVideosByID(id);
        expect(findAvailableVideosByID.info.title).toBe("new video title");
    });  

    it("invalid id", async () =>  {
        const videoCompress = await streamVideo.changeVideoTitle("test");
        expect(videoCompress).toBe("failed-to-change-video-title");
    });  
}); 
