class MyPrologInterface extends CGFobject{
    constructor(scene){
        super(scene);
        this.port = 8081;
    }
    /**
     * get request using string
     * @param {*} requestString 
     */
    getPrologRequest(requestString,onSucess,onError){
        let request = new XMLHttpRequest(this);
     
        request.open('GET', 'http://localhost:' + this.port + '/' + requestString, true);
    
        request.onload = onSucess || function (data) {
            console.log("Request Sucessful. Reply: " + data.target.response);
        };
        request.onerror = onError || function () {
            console.log("Error waiting for response");
        };
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    
    }

    /**
     * initilizes prolog localhost server
     */
    initGame(callback){  
        this.getPrologRequest('init',callback);
    }
    parseInitGame(data){
        let ret = textStringToArray(data.target.response);

        this.currentBoard = ret[0];  //board
        this.currentPlayer = Number(ret[1],10); //player playing

        //set up board pieces 
        for(let line = 0; line < this.currentBoard.length; line++){ 
            for(let column = 0 ; column < this.currentBoard[line].length; column++ )
            if(this.currentBoard[line][column] != 0 && this.currentBoard[line][column] != 1){
                let piece_type = this.pieceTranslator(this.currentBoard[line][column]); 
                let coords = [line+1, column+1]; //always increment line/column when adding things 
                let tile = this.gameboard.getTileByCoords(coords);
                tile.setPieceOnTile(new MyPiece(this.scene,piece_type,true,true,this));
            }
        } 

        this.gameState = this.gameStateEnum.ROTATE_CAMERA;
    }
 
    /**
     * list all valid moves on current board
     * @param {*} Board 
     * @param {*} Player 
     * @returns list of all valid moves
     */
    getValidMoves(Board,Player,callback){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('get_valid_moves('+strBoard+','+Player+')',callback);
    }
    parseValidMoves(data){
        this.currentValidMoves = convertValidMovesToArray(data.target.response);
        console.log(this.currentBoard);
        for(let i = 0; i < this.currentValidMoves.length; i++){
            let tile = this.gameboard.getTileByCoords(this.currentValidMoves[i][0])
            let piece = this.gameboard.getPieceOnATile(tile)
            piece.addValidMove(this.currentValidMoves[i][1]);
        }
    }
    /**
     * makes human player move 
     * @param {*} Board 
     * @param {*} Move 
     * @returns NewBoard after move
     */
    playerMove(Board,Move,callback){
        let strBoard = convertBoardToString(Board);
        let strMove = convertMoveAsciiToString(Move);
        this.getPrologRequest('player_move('+strMove+','+strBoard+')',callback);
    }
    parsePlayerMove(data){
        this.currentBoard =  boardStringToArray(data.target.response); //update to newboard      
        //todo - adjust with animation
        let tileFrom = this.gameboard.getTileByCoords(this.currentPlayerMove[0]);
        let tileTo = this.gameboard.getTileByCoords(this.currentPlayerMove[1]);
        let pieceToMove = this.gameboard.getPieceOnATile(tileFrom);

          //Check for eaten pieces
          let eaten_piece = this.gameboard.getPieceOnATile(tileTo);
          if (eaten_piece != null) {
              let eaten_tile_to = this.getEatenPieceTileTo();
              this.currentEatenProps = [eaten_piece, tileTo, eaten_tile_to];
          }

        //animate piece         
        this.animator.start(pieceToMove,tileFrom,tileTo);
        //Reset currentPlayerMove
        this.currentPlayerMove = [];
        this.gameboard.resetValidMoves();
    }

    /**
     * chooses ai move
     * @param {*} Board 
     * @param {*} Level 
     * @param {*} Player 
     * @returns NewMove after choose
     */
    aiChooseMove(Board,Level,Player,callback){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('choose_ai_move('+strBoard+','+Level+','+Player+')',callback);
    }
    parseAIChooseMove(data) {
        this.currentPlayerMove = convertMoveStringToArray(data.target.response);
    }
    /**
     * makes ai move
     * @param {*} Board 
     * @param {*} Move 
     * @returns NewBoard after move
     */
    aiMove(Board,Move,callback){
        let strBoard = convertBoardToString(Board);
        let strMove = convertMoveAsciiToString(Move);
        this.getPrologRequest('ai_move('+strMove+','+strBoard+')',callback);
    }
    parseAIMove(data) {
        this.currentBoard = boardStringToArray(data.target.response);
       
        let tileFrom = this.gameboard.getTileByCoords(this.currentPlayerMove[0]);
        let tileTo = this.gameboard.getTileByCoords(this.currentPlayerMove[1]);

        let pieceToMove = this.gameboard.getPieceOnATile(tileFrom);

          //Check for eaten pieces
          let eaten_piece = this.gameboard.getPieceOnATile(tileTo);
          if (eaten_piece != null) {
              let eaten_tile_to = this.getEatenPieceTileTo();
              this.currentEatenProps = [eaten_piece, tileTo, eaten_tile_to];
          }
        //animate piece        
        this.animator.start(pieceToMove,tileFrom,tileTo);
        //Reset currentPlayerMove
        this.currentPlayerMove = [];
        this.gameboard.resetValidMoves();
    }
    /**
     * 
     * @param {*} Board 
     * @param {*} Player 
     */
    getScore(Board,Player,callback){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('get_player_score('+strBoard+','+Player+')',callback);
    }  
    parseScore(data){
        this.currentScores[this.currentPlayer] = parseInt(data.target.response,10);
    }
    /**
     * 
     * @param {*} Board 
     * @param {*} Player 
     * @returns winning player, if -1 game continues if 5 red wins if 9 blue wins
     */
    checkWin(Board,Player,callback){
        let strBoard = convertBoardToString(Board);
        this.getPrologRequest('check_game_over('+strBoard+','+Player+')',callback)
    }
    parseWinner(data){
        let winner = parseInt(data.target.response,10);
        //check winner
        if(winner != -1){
            this.gameState = this.gameStateEnum.GAME_ENDED;
            //smth to print winner 
            //smth to lock the game 
            //maybe smth to change flag game running from the scene
            //todo 
            //debug - print game sequence
            console.log('gameSequence');
            this.gameSequence.replay();
            console.log('animator');
            this.animator.sequence.replay();
        }
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
 * 
 * @param {*} string 
 */
function moveStringToArray(string){
    let str=string;

    let aux = []; 
    let move = []; 

    //process move
    for(let i= 0; i < str.length; i++){
        switch(str[i]){
            case '[':
                break;
            case ']':
                move.push(aux);
                break;
            case ',':
                if (i % 4 == 0) {
                    move.push(aux);
                    aux = [];
                }
                break; 
            default:
                aux.push(str[i]);
                break;
        }
    }
    return move;
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
 * converts move array with coords with letters and numbers to string to be passed to prolog
 * @param {*} Move 
 * @returns move string
 */
function convertMoveAsciiToString(Move){
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
 * converts move array to string to be passed to prolog
 * @param {*} Move 
 * @returns move string
 */
function convertMoveToString(Move){
    let move = "["; 
    for(let line = 0; line < Move.length; line++){
        for (let column = 0; column < 2; column++) {
            move += Move[line][column] + ',';
        }
    }
    move = move.substring(0,move.length-1);
    move +=']'
    return move;
}
function convertMoveStringToArray(string){
    let str = string
    .replace(/[\[\]']+/g,"")
    .replace(/a/g,"1")
    .replace(/b/g,"2")
    .replace(/c/g,"3")
    .replace(/d/g,"4")
    .replace(/e/g,"5")
    .replace(/,/g,"");

    return [[Number(str[0],10), Number(str[1],10)],[Number(str[2],10),Number(str[3],10)]];
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
            from.push(Number(str[i],10));
        }else to.push(Number(str[i],10));
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