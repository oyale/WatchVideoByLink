const showAvailableVideos = require("./showAvailableVideos");  
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.window = dom.window; 
global.document = dom.window.document;   

let spy, mockHTML, mockHead, mockFavicon, mockArticle; 
beforeAll(() => {
    spy = jest.spyOn(document, "getElementById");
    mockHTML = document.createElement("html"); 
    mockHead = document.createElement("head"); 
    mockHTML.appendChild(mockHead);
    mockFavicon = document.createElement("link");
    mockFavicon.id = "favicon";
    mockFavicon.rel = "icon";
    mockFavicon.href = "../favicon.ico";
    mockFavicon.type = "image/png"; 
    mockHead.appendChild(mockFavicon);
    mockArticle = document.createElement("article");
    mockArticle.id = "websiteContentContainer"; 
    mockHTML.appendChild(mockArticle);
    spy.mockReturnValue(mockHTML); 
});

describe("searchBar", () =>  {   
    it("searchBar exits", () =>  { 
        const searchBar = showAvailableVideos.searchBar();   
        expect(searchBar).toBeDefined();       
        expect(searchBar).toBe("searchBar");     
    });   
}); 

describe("pageLoaded", () =>  {   
    it("pageLoaded exits", () =>  { 
        const pageLoaded = showAvailableVideos.pageLoaded();   
        expect(pageLoaded).toBeDefined();       
        expect(pageLoaded).toBe("pageLoaded");     
    });   
}); 
