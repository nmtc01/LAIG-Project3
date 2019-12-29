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
        this.getPrologRequest('init','board');
        return response;
    }
    /**
     * 
     */
    getValidMoves(Board,Player){
        let strBoard = convertBoardToString(Board);
        console.log('get_valid_moves('+strBoard+','+Player+')');
        this.getPrologRequest('get_valid_moves('+strBoard+','+Player+')','valid_moves')
        return response;
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
    checkWin(){
        //todo
    }
    /**
     * get request using string
     * @param {*} requestString 
     */
    getPrologRequest(requestString,type){
        let request = new XMLHttpRequest(this);
        switch(type){
            case 'board': 
                request.addEventListener("load",this.parseBoardPrologReply); 
            break ; 
            case 'valid_moves':
                request.addEventListener("load",this.parseValidMovesPrologReply); 
            break; 
        }
        request.addEventListener("error",this.startPrologGameError);
        request.open('GET', 'http://localhost:'+this.port+'/'+requestString,false);  //todo check if this flag doesnt cereate problems
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"); 
        request.send();
    }
    /**
     * 
     */
    parseBoardPrologReply() {
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        let responseArray = textStringToArray(this.responseText);
        console.log(responseArray)
        response = responseArray;
    }

    parseValidMovesPrologReply() {
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        let responseArray = convertValidMovesToArray(this.responseText);

        console.log(responseArray)
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
function textStringToArray(string){ 
    let len = string.length;
    let str = string.substring(1,len); //delete first bracket

    let count  = 0; 
    let aux="";
    let newStr = "";
    let ret = []; 
    let line = [NaN]; 
    let board = []; //len 5

    //process Board
    for(let i= 0; i < str.length; i++){
        switch(str[i]){
            case '[': 
                count++; 
            break; 
            case ']':
                count--; 
                if(count == 1){
                    line.push(parseInt(aux,10));
                    aux = "";
                    line.splice(line[0],1);
                    board.push(line);
                    line = [];
                }
            break; 
            case ',':
                line.push(parseInt(aux,10));
                aux = "";
            break; 
            default:
                aux+=str[i];
            break;
        }
       if(count == 0){
           aux = "";
           newStr = str.substring(i+2,str.len);
           console.log(newStr);
            break;
       }
    }
    ret.push(board);
    for(let i=0; i < newStr.length; i++){
        switch(newStr[i]){
            case '[': 
                count++; 
            break; 
            case ']':
                count--; 
            break; 
            default:
                aux+=newStr[i];
            break;
        }
       if(count == 0){
           ret.push(aux);
           aux = "";
       }
    }
    return ret;
}

function convertBoardToString(Board){
    let board = "["; 
    for(let line = 0; line < Board.length; line++){
        board += '['+Board[line]+'],';
    }
    board = board.substring(0,board.length-1);
    board +=']'
    return board;
}

function convertValidMovesToArray(ValidMoves){
    let str = ValidMoves
        .replace(/[\[\]']+/g,"")
        .replace(/a/g,"1")
        .replace(/b/g,"2")
        .replace(/c/g,"3")
        .replace(/d/g,"4")
        .replace(/e/g,"5")
        .replace(/,/g,"");
    
    let to = []; 
    let from = []; 
    let move = []; 
    let count = 0; 
    let ret = []; 

    for(let i = 0; i < str.length; i++){
        count++;
        if(count <= 2){
            from.push(str[i]);
        }else to.push(str[i]);
        if(count == 4){
            count = 0; 
            move.push(from);
            move.push(to);
            ret.push(move);
            //reset
            to = []; 
            from=[]; 
            move=[];
        }
    }

    return ret; 
}