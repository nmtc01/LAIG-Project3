/**
 * 
 */

// • Load of new scenes
// • Manage gameplay (game states) 
// • Manages undo
// • Manages movie play
// • Manage object selection

class MyGameOrchestrator extends CGFobject{
    constructor(scene){
        super(scene);

        this.gameSequence = new MyGameSequence(this.scene); 
        this.animator = new MyAnimator(this.scene); 
        this.gameboard = new MyGameboard(this.scene); 
        this.prologInterface = new MyPrologInterface(this.scene);
        this.gameSequence = new MyGameSequence();

        //use to determine game type 
        this.gameType = null;
        this.gameLevel = null;

        //current player on prolog was set as red as custom, so the ai will alaways be the blue one
        //if blue is playing on pvc ou cvc game mode it always be a ai move 
        this.currentPlayer=null;  //todo current playing 5-red 9-blue should i convert the numbers?
        this.currentBoard=null; 
        this.currentValidMoves = null;
        this.currentScores = {5:0, 9:0}
        //todo 
        //pensar se reescrevo a peça ou comparo com um tabuleiro a anterior
        this.validMoves=null;

        this.gameState = {
            INIT:'init', 
            GET_VALID_MOVES:'get_valid_moves', 
            PLAYER_PLAYING: 'player_playing',
            AI_LVL1_PLAYING: 'ai_lvl1_playing', 
            AI_LVL2_PLAYING: 'ai_lvl2_playing', 
            GAME_ENDED:'game_ended'
        }
        this.gameState = 'init'; 
    }
    //todo check best way to do this 
    startGame(type,level){
        this.gameType = type; 
        this.gameLevel=level;
        let ret = this.prologInterface.initGame(type,level);
        this.currentBoard = ret[0];  //board
        this.currentPlayer = ret[1]; //player playing

        //set up board pieces 
        for(let line = 0; line < this.currentBoard.length; line++){ 
            for(let column = 0 ; column < this.currentBoard[line].length; column++ )
            if(this.currentBoard[line][column] != 0 && this.currentBoard[line][column] != 1){
                let piece_type = this.pieceTranslator(this.currentBoard[line][column]); 
                let coords = [line+1, column+1]; //always increment line/column when adding things 
                let tile = this.gameboard.getTileByCoords(coords);
                tile.setPieceOnTile(new MyPiece(this.scene,piece_type,true,true));
            }
        } 
        //todo check who will play 
        this.gameState = 'get_valid_moves';
    }
    pieceTranslator(num){
        let piece = "piece_";

        if(Math.floor(num / 100) == 5)
            piece += "red_";
        else piece += "blue_";

        if((Math.floor(num/10) % 10) == 1)
            piece += "white"
        else piece += "black"

        return piece;
    }
    manageGameplay(){
        //the management will depend on game type selected 
        //each game managemente is a copy from prolog - game.pl 
        switch(this.gameType){
            case 'pvp': 
                if(this.gameState == 'get_valid_moves'){
                    //paint tiles
                    this.currentValidMoves = this.prologInterface.getValidMoves(this.currentBoard,this.currentPlayer);
                    console.log(this.currentValidMoves);
                    this.gameState = 'player_playing';
                }
                if(this.gameState == 'player_playing'){
                    //todo smth to paint tiles
                    //when move is valid!!
                    //todo
                    //let newBoard = this.prologInterface.playerMove(/*move,*/this.currentBoard); 
                    //this.currentBoard = newBoard; //update to newboard
                    //get player score after move 
                    this.currentScores[this.currentPlayer] = this.prologInterface.getScore(this.currentBoard,this.currentPlayer);
                    //get if there is a winner
                    let winner = this.prologInterface.checkWin(this.currentBoard,this.currentPlayer);
                    //check winner
                    if(winner != -1){
                        this.gameState = 'game_ended';
                        //smth to print winner 
                        //smth to lock the game 
                        //maybe smth to change flag game running from the scene
                    }else { //if no winner game continues - prepare next player
                        if(this.currentPlayer == 5)
                            this.currentPlayer == 9;
                        else this.currentPlayer == 5; 
                        this.gameState = 'get_valid_moves';
                    }
                    //todo erase - this is just here to debug, so that the game can lock
                    this.gameState = 'game_ended';
                }
            break;  
            case 'pvc': 
                //todo
                //when moving condition if blue play to check level 
            break; 
            case 'cvc': 
                //todo
                //when moving condition if blue play to check level 
            break; 
        }
        
    }
    orchestrate(){  
        this.manageGameplay(); 
       
    }
    update(time) { 
        this.animator.update(time);
    }
    updateGameBoard(){

    }
    managePick(mode, results) {
        if (mode == false /* && some other game conditions */){
            if(results != null && results.length > 0) { // any results? 
                for (var i=0; i< results.length; i++) {
                    var obj = pickResults[i][0]; // get object from result 
                    if (obj) { // exists?
                        var uniqueId = pickResults[i][1] // get id
                        this.OnObjectSelected(obj, uniqueId); 
                    }
                }
            // clear results
            pickResults.splice(0, pickResults.length); 
            }
        } 
    }

    onObjectSelected(obj, id) { 
        if(obj instanceof MyPiece){
        // do something with id knowing it is a piece 
        }
        else
        if(obj instanceof MyTile){
        // do something with id knowing it is a tile 
        }
        else {
        // error ?
        } 
    }
    
    display() { 
        //this.theme.display(); 
        this.gameboard.display(); 
        //this.animator.display(); 
        //...
    }
}

