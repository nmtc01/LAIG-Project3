//global 

var response;

class MyPrologInterface{
    constructor(/*scene*/){
        //super(scene);
        this.port = 8081;
    }
    /**
     * Methods:
        • all that are necessary to request data to prolog
        • all that are necessary to parse responses and accommodate in game data structures (centralized in GameOrchestrator)
    /**
     * initilizes prolog localhost server
     */
    initGame(){  
        this.getPrologRequest('init');
        console.log(response);
        return response;
    }
    /**
    * 
    */
    getBoard(){
        //todo
    }
    /**
     * 
     */
    getPlayerPlaying(){
        //todo
    }
    /**
     * 
     */
    getValidMoves(){
        //todo
    }
    /**
     * 
     */
    move(){
        //todo
    }
    /**
     * 
     */
    setBoard(){
        //todo
    }
    /**
     * 
     */
    checkWin(){
        //todo
    }
    /**
     * get request using string
     * @param {*} requestString 
     */
    getPrologRequest(requestString){
        let request = new XMLHttpRequest(this);
        request.addEventListener("load",this.parseStartPrologReply); 
        request.addEventListener("error",this.startPrologGameError);
        request.open('GET', 'http://localhost:'+this.port+'/'+requestString,false);  //todo check if this flag doesnt cereate problems
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"); 
        request.send();
    }
    /**
     * 
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
        response = responseArray;
    }
    /**
     * 
     */
    parseStartPrologError(){
        console.log('ERROR')
    }
}

//Utils

function textStringToArray(string,bool){ //todo check this bool
    let len = string.length;
    let str = string.substring(1,len); //delete first bracket

    let count  = 0; 
    let aux="";
    let ret =[ ];  
    //get inner objects
    for(let i= 0; i< str.length; i++){
        switch(str[i]){
            case '[': 
                count++; 
                aux+=str[i];
            break; 
            case ']':
                count--; 
                aux+=str[i]; 
            break; 
            default:
                aux+=str[i];
            break;
        }
       if(count == 0){
           ret.push(aux);
           aux = "";
       }
    }
    return ret;
    
}