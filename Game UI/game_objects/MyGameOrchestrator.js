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
                if(this.gameState == 'get_valid_moves'){
                    //paint tiles
                    this.currentValidMoves = this.prologInterface.getValidMoves(this.currentBoard,this.currentPlayer);
                    console.log(this.currentValidMoves);

                    for(let i = 0; i < this.currentValidMoves.length; i++){
                        let tile = this.gameboard.getTileByCoords(this.currentValidMoves[i][0])
                        let piece = this.gameboard.getPieceOnATile(tile)
                        piece.addValidMove(this.currentValidMoves[i][1]);
                    }

                    this.gameState = 'player_playing';
                }
                if(this.gameState == 'player_playing'){
                    //todo smth to paint tiles
                    //when move is valid!!
                    //todo
                    //todo hardcoded now to test, then user needs to input a move by picking a tile
                    
                    let move = [[1,1],[3,2]];
                    let newBoard = this.prologInterface.playerMove(this.currentBoard, move); 
                    this.currentBoard = newBoard; //update to newboard
                    console.log(this.currentBoard)
                    //todo - adjust with animation
                   // console.log('Locked');
                   // setTimeout(() => {  console.log("Unlocked"); 
            
                        let tileFrom = this.gameboard.getTileByCoords(move[0]);
                        let tileTo = this.gameboard.getTileByCoords(move[1]);
                        let pieceToMove = this.gameboard.getPieceOnATile(tileFrom);
                        //animate piece          
                        this.animator.start(pieceToMove,tileFrom,tileTo);
                        this.gameState = 'animate'
                    //}, 2000);
                    
                    //todo
                    //this.gameboard.resetValidMoves();
                    //this.animator.start(pieceToMove,tileFrom,tileTo);
                    this.gameState = 'animate'
                }
                if(this.gameState == 'animate'){

                    this.animator.processAnimation();

                    if(!this.animator.active){
                        //move piece on gameboard
                        this.gameboard.movePiece(this.animator.piece_to_move,this.animator.tileFrom,this.animator.tileTo)
                        //stop animation
                        this.gameState = 'check_game_state'
                    }
                }
                if(this.gameState == 'check_game_state'){
                    console.log('state');
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
        }
        //Tile
        else if(obj instanceof MyTile){
            
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

