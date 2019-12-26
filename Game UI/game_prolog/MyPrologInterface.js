class MyPrologInterface{
    constructor(){

    }
    /**
     * Methods:
        • all that are necessary to request data to prolog
        • all that are necessary to parse responses and accommodate in game data structures (centralized in GameOrchestrator)
     
        Request send example:
        
        let requestString = 'playFieldsOfAction('+list+')’; let request = new MyXMLHttpRequest(this);
        request.addEventListener("load", this.parseStartPrologReply); request.addEventListener("error",this.startPrologGameError);
        request.open('GET', 'http://localhost:'+PORT+'/'+requestString, true); request.setRequestHeader("Content-type", "application/x-www-form-
        urlencoded; charset=UTF-8"); request.send();
     
     
        */
    parseStartPrologReply() {
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        // the answer here is: [Board,CurrentPlayer,WhiteScore,BlackScore]
        let responseArray = textStringToArray(this.responseText,true);
        // do something with responseArray[0]; 
        // do something with responseArray[1]; 
        // do something with responseArray[2]; 
        // do something with responseArray[3];
    }
}