const basic = require("./basics");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.document = dom.window.document; 

const container = document.createElement("section");

describe("inputType", () =>  {    
    it("valid tagname", () =>  { 
        const input = basic.inputType(container);   
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");     
    }); 
    
    it("valid tagname type", () =>  { 
        const input = basic.inputType(container, "text"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");  
    }); 
    
    it("valid tagname type id", () =>  { 
        const input = basic.inputType(container, "text", "id"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");   
        expect(input.id).toBe("id");  
    }); 
    
    it("valid tagname type id class", () =>  { 
        const input = basic.inputType(container, "text", "id", "class"); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");   
        expect(input.classList[0]).toBe("class");  
    }); 
    
    it("valid tagname type id class required", () =>  { 
        const input = basic.inputType(container, "text", "id", "class", true); 
        expect(input).toBeDefined();
        expect(input.tagName).toBe("INPUT");  
        expect(input.type).toBe("text");   
        expect(input.classList[0]).toBe("class");  
        expect(input.required).toBe(true);  
    }); 

    it("inputType didnt work", () =>  { 
        const input = basic.inputType(); 
        expect(input).toBeDefined();
        expect(input).toBe("inputType didnt work");  
    }); 
}); 