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
     * list all valid moves on current board
     * @param {*} Board 
     * @param {*} Player 
     * @returns list of all valid moves
     */
    getValidMoves(Board,Player){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('get_valid_moves('+strBoard+','+Player+')','valid_moves');
        return response;
    }
    /**
     * makes human player move 
     * @param {*} Board 
     * @param {*} Move 
     * @returns NewBoard after move
     */
    playerMove(Board,Move){
        let strBoard = convertBoardToString(Board);
        let strMove = convertMoveToString(Move);
        console.log(strBoard);
        console.log(strMove);
        this.getPrologRequest('player_move('+strMove+','+strBoard+')','player_move');
        console.log(response);
        return response;
    }
    /**
     * makes ai move
     * @param {*} Board 
     * @param {*} Level 
     * @param {*} Player 
     * @returns NewBoard after move
     */
    aiMove(Board,Level,Player){
        //todo
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('ai_move('+strBoard+','+Level+','+Player+')','ai_move');
        return response;
    }
    /**
     * 
     * @param {*} Board 
     * @param {*} Player 
     */
    getScore(Board,Player){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('get_player_score('+strBoard+','+Player+')','get_score');
        return response;
    }
    /**
     * 
     * @param {*} Board 
     * @param {*} Player 
     * @returns winning player, if -1 game continues if 5 red wins if 9 blue wins
     */
    checkWin(Board,Player){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('check_game_over('+strBoard+','+Player+')','check_winner')
        return response;
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
            case 'player_move':
                request.addEventListener("load",this.parsePlayerMovesPrologReply);
            break;
            case 'ai_move':
                request.addEventListener("load,",this.parseBoardPrologReply);
            break;
            case 'get_score':
                request.addEventListener("load",this.parseScorePrologReply);
            break;
            case 'check_winner':
                request.addEventListener("load",this.parseWinnerPrologReply);
            break;
        }
        request.addEventListener("error",this.startPrologGameError);
        request.open('GET', 'http://localhost:'+this.port+'/'+requestString,false);  //todo check if this flag doesnt cereate problems
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8"); 
        request.send();
    }
    /**
     * xhr handler for game init
     */
    parseBoardPrologReply() {
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        let responseArray = textStringToArray(this.responseText);
        response = responseArray;
    }
    /**
     *  xhr handler for a valid move
     */
    parseValidMovesPrologReply() {
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        let responseArray = convertValidMovesToArray(this.responseText);

        response = responseArray;
    }
    /**
     *  xhr handler for player moves
     */
    parsePlayerMovesPrologReply() {
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        console.log(this.responseText)
        let responseArray = boardStringToArray(this.responseText);
        console.log(responseArray)
        response = responseArray;
    }
    /**
     *  xhr handler for score
     */
    parseScorePrologReply(){
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        response = parseInt(this.responseText,10);
    }
    /**
     *  xhr handler for winner
     */
    parseWinnerPrologReply(){
        if (this.status === 400) { 
            console.log("ERROR"); 
            return;
        }
        response = parseInt(this.responseText,10);
    }
    /**
     *  xhr handler for errors on start
     */
    parseStartPrologError(){
        console.log('ERROR')
    }
}

//Utils
/**
 * 
 * @param {*} string 
 */
function boardStringToArray(string){
    
    let str=string;

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
    }
    return board;
}
/**
 * converts board array to string to be passed to prolog
 * @param {*} Board 
 * @returns board string
 */
function convertBoardToString(Board){
    let board = "["; 
    for(let line = 0; line < Board.length; line++){
        board += '['+Board[line]+'],';
    }
    board = board.substring(0,board.length-1);
    board +=']'
    return board;
}
/**
 * process string - used mainly to process board
 * @param {*} string 
 * @returns string processed into array
 */
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
/**
 * converts board array to string to be passed to prolog
 * @param {*} Board 
 * @returns board string
 */
function convertBoardToString(Board){
    let board = "["; 
    for(let line = 0; line < Board.length; line++){
        board += '['+Board[line]+'],';
    }
    board = board.substring(0,board.length-1);
    board +=']'
    return board;
}
/**
 * converts move array to string to be passed to prolog
 * @param {*} Move 
 * @returns move string
 */
function convertMoveToString(Move){
    let move = "["; 
    for(let line = 0; line < Move.length; line++){
        for (let column = 0; column < 2; column++) {
            if (column % 2 == 0)
                move += String.fromCharCode(Move[line][column] + 96) + ',';
            else move += Move[line][column] + ',';
        }
    }
    move = move.substring(0,move.length-1);
    move +=']'
    return move;
}
/**
 * converts validmoves string to compatible js array
 * @param {*} ValidMoves 
 * @returns array valid moves
 */
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