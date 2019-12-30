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
        this.animator = new MyAnimator(this.scene,this); 
        this.gameboard = new MyGameboard(this.scene,this); 
        this.prologInterface = new MyPrologInterface(this.scene);
        this.gameSequence = new MyGameSequence();

        //use to determine game type 
        this.gameType = null;
        this.gameLevel = null;

        //current player on prolog was set as red as custom, so the ai will always be the blue one
        //if blue is playing on pvc ou cvc game mode it always be a ai move 
        this.currentPlayer=null;  //todo current playing 5-red 9-blue should i convert the numbers?
        this.currentBoard=null; 
        this.currentValidMoves = null;
        this.currentPlayerMove = [];
        this.currentScores = {5:0, 9:0}
        this.isAiPlaying = false;
        this.stop = false;

        this.gameState = {
            INIT:'init', 
            GET_VALID_MOVES:'get_valid_moves', 
            PLAYER_PLAYING: 'player_playing',
            AI_PLAYING: 'ai_playing',  
            ANIMATE: 'animate',
            CHECK_GAME_STATE: 'check_game_state',
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
                tile.setPieceOnTile(new MyPiece(this.scene,piece_type,true,true,this));
            }
        } 
        //todo check who will play 
        this.gameState = 'get_valid_moves';
    }
    getScene() {
        return this.scene;
    }
    getUniqueId() {
        return this.scene.getPickIndex();
    }
    increaseUniqueId() {
        this.scene.increasePickIndex();
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

    getValidMoves() {
        //paint tiles
        this.currentValidMoves = this.prologInterface.getValidMoves(this.currentBoard,this.currentPlayer);

        for(let i = 0; i < this.currentValidMoves.length; i++){
            let tile = this.gameboard.getTileByCoords(this.currentValidMoves[i][0])
            let piece = this.gameboard.getPieceOnATile(tile)
            piece.addValidMove(this.currentValidMoves[i][1]);
        }
    }
    playerPlaying(move) {
        console.log(this.currentBoard);
        let newBoard = this.prologInterface.playerMove(this.currentBoard, move); 
        this.currentBoard = newBoard; //update to newboard
        console.log(this.currentBoard);
                   
        //todo - adjust with animation
            
        let tileFrom = this.gameboard.getTileByCoords(move[0]);
        let tileTo = this.gameboard.getTileByCoords(move[1]);

        let pieceToMove = this.gameboard.getPieceOnATile(tileFrom);
        //animate piece          
        this.animator.start(pieceToMove,tileFrom,tileTo);
                    
        //this.gameboard.resetValidMoves();
    }
    aiPlaying() {
        let move = this.prologInterface.aiChooseMove(this.currentBoard, this.gameLevel, this.currentPlayer);
        let newBoard = this.prologInterface.aiMove(this.currentBoard, move); 
        this.currentBoard = newBoard; //update to newboard

        let newMove = [[move[0][0].charCodeAt(0)-96, parseInt(move[0][1],10)],
                       [move[1][0].charCodeAt(0)-96, parseInt(move[1][1],10)]];

        let tileFrom = this.gameboard.getTileByCoords(newMove[0]);
        let tileTo = this.gameboard.getTileByCoords(newMove[1]);

        let pieceToMove = this.gameboard.getPieceOnATile(tileFrom);
        //animate piece          
        this.animator.start(pieceToMove,tileFrom,tileTo);

        //this.gameboard.resetValidMoves();
    }
    animate() {
        this.animator.processAnimation();

        if(!this.animator.active){
            //move piece on gameboard
            this.gameboard.movePiece(this.animator.piece_to_move,this.animator.tileFrom,this.animator.tileTo);
            //stop animation
            this.gameState = 'check_game_state';
        }
    }
    checkGameState() {
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
                this.currentPlayer = 9;
            else this.currentPlayer = 5; 
            this.gameState = 'get_valid_moves';
        }
        //todo erase - this is just here to debug, so that the game can lock
    }

    //TODO stop condition after win
    manageGameplay(){
        //* DEBUG - TO CHECK ID INTEGRITY
        /*
        let aux= []; 
        for(let key in this.gameboard.tiles){
            let piece = this.gameboard.tiles[key].getPiece()
            if (piece != null )
               aux.push(piece.uniqueId);
        }
        console.log(aux);
        */
        //the management will depend on game type selected 
        //each game managemente is a copy from prolog - game.pl 
        switch(this.gameType){
            case 'pvp': 
            {
                if(this.gameState == 'get_valid_moves'){
                    this.getValidMoves();
                    this.gameState = 'player_playing';
                }
                if(this.gameState == 'player_playing'){
                    if (this.currentPlayerMove != null)
                        if (this.currentPlayerMove.length == 2) { 
                            this.playerPlaying(this.currentPlayerMove);
                            //Reset currentPlayerMove
                            this.currentPlayerMove = [];
                            this.gameState = 'animate';
                        }
                }
                if(this.gameState == 'animate'){
                    this.animate();
                }
                if(this.gameState == 'check_game_state'){
                    this.checkGameState();
                    this.gameState = 'get_valid_moves';
                }
                break;  
            }
            case 'pvc': 
            {
                if(this.gameState == 'get_valid_moves'){
                    this.getValidMoves();
                    if (!this.isAiPlaying) {
                        this.gameState = 'player_playing';
                        this.isAiPlaying = true;
                    }
                    else {
                        this.gameState = 'ai_playing';
                        this.isAiPlaying = false;
                    }
                }
                if(this.gameState == 'player_playing'){
                    if (this.currentPlayerMove != null)
                        if (this.currentPlayerMove.length == 2) { 
                            this.playerPlaying(this.currentPlayerMove);
                            //Reset currentPlayerMove
                            this.currentPlayerMove = [];
                            this.gameState = 'animate';
                        }
                }
                if(this.gameState == 'ai_playing'){
                    this.aiPlaying();
                    this.gameState = 'animate';
                    this.stop = true;
                } 
                if(this.gameState == 'animate'){
                    this.animate();
                }
                if(this.gameState == 'check_game_state'){
                    this.checkGameState();
                    //this.gameState = 'game_ended';
                    this.gameState = 'get_valid_moves';
                    //TODO delete this.stop - just to make the game stops - testing
                    if (this.stop)
                        this.gameState = 'game_end';
                }
                break; 
            }
            case 'cvc': 
            {
                if(this.gameState == 'get_valid_moves'){
                    this.getValidMoves();
                    this.gameState = 'ai_playing';
                }
                if(this.gameState == 'ai_playing'){
                    this.aiPlaying();
                    this.gameState = 'animate';
                    //Descomment to stop game
                    //this.stop = true;
                } 
                if(this.gameState == 'animate'){
                    this.animate();
                }
                if(this.gameState == 'check_game_state'){
                    this.checkGameState();
                    //this.gameState = 'game_ended';
                    this.gameState = 'get_valid_moves';
                    //TODO delete this.stop - just to make the game stops - testing
                    if (this.stop)
                        this.gameState = 'game_end';
                }
                break;
            } 
        }
        
    }
    orchestrate(){  
        this.manageGameplay(); 
       
    }
    update(time) { 
        this.animator.update(time);
    }
    managePick(mode, pickResults) {
        if (mode == false /* && some other game conditions */){
            if(pickResults != null && pickResults.length > 0) { // any pickResults? 
                for (var i=0; i< pickResults.length; i++) {
                    var obj = pickResults[i][0]; // get object from result 
                    if (obj) { // exists?
                        var uniqueId = pickResults[i][1] // get id
                        //TODO: use onObjectSelected do something 
                        this.onObjectSelected(obj, uniqueId);
                    }
                }
                // clear results
                pickResults.splice(0, pickResults.length); 
            }
        } 
    }
    onObjectSelected(obj, id) { 
        //Reset other objects glows
        let tiles = this.gameboard.tiles;
        for(let key in tiles){
            let piece = this.gameboard.getPieceOnATile(tiles[key]);
            if (piece != null)
                piece.setPicked(false);
            if(tiles[key].validMoveTile)
                tiles[key].setValidMoveTile(false);
        }
        //Piece
        if(obj instanceof MyPiece){
            //Make the picked piece glow
            this.scene.pushMatrix();
            obj.setPicked(true);
            obj.display();
            this.scene.popMatrix();
            //Create a move to be used by manageGameplay() on pvp or pvc - from coords
            this.currentPlayerMove.push(obj.getTile().getCoords());
        }
        //Tile
        else if(obj instanceof MyTile){
            //Validate move
            let aux = this.currentPlayerMove;
            aux.push(obj.getCoords());
            for(let i = 0; i < this.currentValidMoves.length; i++) {
                if (this.currentValidMoves[i] == aux) {
                    //Create a move to be used by manageGameplay() on pvp or pvc - to coords
                    this.currentPlayerMove = aux;
                    break;
                }
            }
        }
        else {
        // error ?
        } 
    }
    
    display() { 
        //this.theme.display(); 
        this.gameboard.display(); 
        this.animator.display(); 
        //...
    }
}

