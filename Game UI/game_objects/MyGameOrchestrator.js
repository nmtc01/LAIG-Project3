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
        this.gameSequence = new MyGameSequence(this.scene,this); 
        //this.gameSequence = new MyGameSequence(this.scene,this);
        this.animator = new MyAnimator(this.scene,this,this.gameSequence); 
        this.gameboard = new MyGameboard(this.scene,this); 
        this.prologInterface = new MyPrologInterface(this.scene,this);
        this.gameCounter = new MyCounter(this.scene,this); 
        this.winner = new MyWinner(this.scene, 0);

        //use to determine game type 
        this.gameType = null;
        this.gameLevel = null;

        this.filmPlaying = false;

        //current player on prolog was set as red as custom, so the ai will always be the blue one
        //if blue is playing on pvc ou cvc game mode it always be a ai move 
        this.currentPlayer=null;  //todo current playing 5-red 9-blue should i convert the numbers?
        this.currentBoard=null; 
        this.currentValidMoves = null;
        this.currentPlayerMove = [];
        this.currentScores = {5:0, 9:0}
        //Flag to verify if undo is active 
        this.undoEatenPieceActive = false; 
        this.undoAI =false;
        this.undoPieceEatenCamera = false;
        //Flag to verify if AI is playing
        this.isAiPlaying = false;
        //Eaten pieces
        this.currentEatenProps = [];
        this.isEatenMoving = false;
        //Camera rotation
        this.currentCameraAngle = 0;
        this.isRotateActive = false;

        //times 
        this.delta_t = 0;
        this.last_t = 0;
        this.sent = 0;
        this.rotateTime = 0;

        this.gameStateEnum = {
            INIT:0, 
            ROTATE_CAMERA: 1,
            GET_VALID_MOVES: 2, 
            PLAYER_PLAYING: 3,
            AI_CHOOSING_MOVE: 4,
            AI_PLAYING: 5,   
            UNDO: 6,
            ANIMATE: 7,
            CHECK_GAME_STATE: 8,
            GAME_ENDED: 9,
            PLAY_FILM: 10,
            GAME_STOP: 11
        }

        this.gameState = this.gameStateEnum.INIT; 

        this.playerMoveStateEnum = {
            PIECE_SELECT: 0,
            TILE_SELECT: 1
        }
        this.playerMoveState = this.playerMoveStateEnum.PIECE_SELECT;
    }
    getGameState(){
        return this.gameState;
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
    undoEatenPieceBoardString(piece,oldPos){
        let line = oldPos[0]; 
        let col = oldPos[1];
        let type = piece.getType(); 
        let pieceNum = 0; 

        switch(type){
            case 'piece_red_white':
                pieceNum = 510;
            break;
            case 'piece_red_black':
                pieceNum = 500;
            break;
            case 'piece_blue_white':
                pieceNum = 910;
            break; 
            case 'piece_blue_black':
                pieceNum = 900;
            break; 
        }
        //check if piece is on white or black tile, if line+col even black if odd white
        let colorCheck = line + col; 
        if((colorCheck % 2) != 0 )
            pieceNum++; //tile gets white  

        this.currentBoard[line-1][col-1] = pieceNum; 
    }
    startGame(type,level,turnTime){
        this.gameboard.resetGame();
        this.gameType = type; 
        this.gameLevel=level;
        this.gameCounter.reset();
        this.gameCounter.setTurnTime(turnTime);
        this.prologInterface.initGame(this.prologInterface.parseInitGame.bind(this)); 
    }
    rotateCamera() {
        this.isRotateActive = true;
        this.getScene().setPickEnabled(false);
        let deltaAngle = Math.PI * this.sent / 3;
        this.currentCameraAngle += deltaAngle;
        //Correcting associated error
        if (this.rotateTime > 2.9) {
            let rest = this.currentCameraAngle - Math.PI;
            //Reset currentCameraAngle, rotateTime and isRotateActive
            this.currentCameraAngle = 0;
            this.rotateTime = 0;
            this.isRotateActive = false;
            //Rotate camera
            this.scene.defaultCamera.orbit(vec3.fromValues(0, 1, 0), deltaAngle-rest);
        }
        //Rotate camera
        else this.scene.defaultCamera.orbit(vec3.fromValues(0, 1, 0), deltaAngle);
    }
    getValidMoves() {
        this.prologInterface.getValidMoves(this.currentBoard,this.currentPlayer,this.prologInterface.parseValidMoves.bind(this));
        this.getScene().setPickEnabled(true);
    }

    playerPlaying() {
        this.prologInterface.playerMove(this.currentBoard,this.currentPlayerMove,this.prologInterface.parsePlayerMove.bind(this));   
    }
    aiMoveSelection(){
        this.prologInterface.aiChooseMove(this.currentBoard, this.gameLevel, this.currentPlayer,this.prologInterface.parseAIChooseMove.bind(this));
    }
    aiPlaying() {
        this.prologInterface.aiMove(this.currentBoard, this.currentPlayerMove,this.prologInterface.parseAIMove.bind(this)); 
    }
    getEatenPieceTileTo() {
        for (let i = 1; i <= 5; i++) {
            let tile;
            if (this.currentPlayer == 9)
                tile = this.gameboard.getTileByCoords([i,-0.7]);
            else tile = this.gameboard.getTileByCoords([i,6.7]);
            let piece = this.gameboard.getPieceOnATile(tile);
            if (piece == null ) {
                return tile; 
            }
        }
        return tile;
    }
    checkEatenProps() {
        //If there are eaten pieces then animate again
        if (this.currentEatenProps.length != 0) {

            //update score because a piece was eaten
            this.gameCounter.updateScores(this.currentPlayer);

            let piece = this.currentEatenProps[0];
            let tileFrom = this.currentEatenProps[1];
            let tileTo = this.currentEatenProps[2];

            this.animator.start(piece, tileFrom, tileTo);
            //Reset currentEatenProps
            this.currentEatenProps = [];
            this.isEatenMoving = true;
            this.gameState = this.gameStateEnum.ANIMATE;
        }
        else //stop animation
        this.gameState = this.gameStateEnum.CHECK_GAME_STATE;
    }
    animate() {
        if(this.animator.canAnimate){
            this.animator.processAnimation();
            if(!this.animator.active){
                if(this.isEatenMoving){ 
                    this.animator.piece_to_move.setMoving(false);
                    this.animator.tileTo.setPieceOnTile(this.animator.piece_to_move);      
                    this.isEatenMoving = false;
                    //stop animation
                    this.animator.canAnimate = false;
                    this.gameState = this.gameStateEnum.CHECK_GAME_STATE; 
                    
                }else{
                    this.animator.piece_to_move.setMoving(false);
                    //move piece on gameboarb
                    this.gameboard.movePiece(this.animator.piece_to_move,this.animator.tileFrom,this.animator.tileTo);
                    //stop animation
                    this.animator.canAnimate = false;
                    this.gameState = this.gameStateEnum.CHECK_GAME_STATE; 
                }
                this.checkEatenProps();
            }
        }
    }
    undoEatenPiece(){
        //todo - adjust with animation
        let tileFrom = this.gameboard.getTileByCoords(this.currentPlayerMove[0]);
        let tileTo = this.gameboard.getTileByCoords(this.currentPlayerMove[1]);
        let pieceToMove = this.gameboard.getPieceOnATile(tileFrom);

        this.undoEatenPieceBoardString(pieceToMove,tileTo.getCoords());
        //animate piece         
        this.animator.start(pieceToMove,tileFrom,tileTo);
        //Reset currentPlayerMove
        this.currentPlayerMove = [];
        this.gameboard.resetValidMoves();
    }
    undo(){
        let lastMove = this.gameSequence.undo();
        if((lastMove[1][1] == -0.7 || lastMove[1][1] == 6.7) && this.undoEatenPieceActive == false){ //if unduing an eaten piece 
            this.gameCounter.downScore(this.currentPlayer);
            let normalMove = this.gameSequence.undo();
            this.currentPlayerMove = [normalMove[1],normalMove[0]]; 
            this.playerPlaying(); 
            this.gameSequence.addGameMove(lastMove); //add the piece eaten move again, so that it will make that move
            this.gameState = this.gameStateEnum.ANIMATE;
            this.undoEatenPieceActive = true; 
        }else if((lastMove[1][1] == -0.7 || lastMove[1][1] == 6.7) && this.undoEatenPieceActive == true){
            this.undoEatenPieceActive = false; 
            this.currentPlayerMove = [lastMove[1],lastMove[0]]; //exchange positions and move again
            this.undoEatenPiece(); 
            this.gameState = this.gameStateEnum.ANIMATE;
        }else{
            //update current board 
            this.currentPlayerMove = [lastMove[1],lastMove[0]]; //exchange positions and move again
            this.playerPlaying(); 
            this.gameState = this.gameStateEnum.ANIMATE;
        }
    }
    checkGameState() {
        //get player score after move 
        this.prologInterface.getScore(this.currentBoard,this.currentPlayer,this.prologInterface.parseScore.bind(this));
        //get if there is a winner
        this.prologInterface.checkWin(this.currentBoard,this.currentPlayer,this.prologInterface.parseWinner.bind(this));
        
        this.changePlayerPlaying();
    }
    changePlayerPlaying(){
        if(this.currentPlayer == 5)
            this.currentPlayer = 9;
        else this.currentPlayer = 5; 
    }
    equalMoves(move1, move2) {
        let equal = true;
        for (let i = 0; i < move1.length; i++) {
            for (let j = 0; j < move1[i].length; j++) {
                if (move1[i][j] != move2[i][j])
                    equal = false;
            }
        }
        return equal;
    }
    validateMove(obj) {
        let valid = false;
        let aux = [];
        aux.push(...this.currentPlayerMove);
        if (obj instanceof MyPiece)
            aux.push(obj.getTile().getCoords());
        else aux.push(obj.getCoords());
        for(let i = 0; i < this.currentValidMoves.length; i++) {
            if (this.equalMoves(this.currentValidMoves[i],aux)) {
                //Create a move to be used by manageGameplay() on pvp or pvc - to coords
                this.currentPlayerMove = aux;
                valid = true;
                break;
            }
        }
        //If not valid reset currentPlayerMove
        if (!valid)
            this.currentPlayerMove = [];
    }

    manageGameplay(){
        //the management will depend on game type selected 
        //each game managemente is a copy from prolog - game.pl 
        switch(this.gameType){
            case 'pvp': 
            {
                if (this.gameState == this.gameStateEnum.ROTATE_CAMERA) {
                    this.rotateCamera();
                    if (this.currentCameraAngle == 0) {
                        this.gameState = this.gameStateEnum.GET_VALID_MOVES;
                    }
                }
                if(this.gameState == this.gameStateEnum.GET_VALID_MOVES){
                    this.getValidMoves();
                    this.gameCounter.startTurn();
                    this.gameState = this.gameStateEnum.PLAYER_PLAYING
                }
                if(this.gameState == this.gameStateEnum.PLAYER_PLAYING ){
                    if(this.undoEatenPieceActive){ //if undo is active go back with piece eaten 
                        this.undo();
                        this.undoPieceEatenCamera = true;
                    }else{
                    this.gameCounter.processCounter(this.currentPlayer);
                    if (this.currentPlayerMove != null)
                        if (this.currentPlayerMove.length == 2) { 
                            this.gameSequence.addGameMove(this.currentPlayerMove); //add move to the game sequence
                            this.playerPlaying();
                            this.gameState = this.gameStateEnum.ANIMATE;
                        }
                    }
                }
                if(this.gameState == this.gameStateEnum.UNDO){
                   this.undo();
                }
                if(this.gameState == this.gameStateEnum.ANIMATE){
                    this.animate();
                }
                if(this.gameState == this.gameStateEnum.CHECK_GAME_STATE){   
                    if(this.undoPieceEatenCamera){
                        this.gameState = this.gameStateEnum.GET_VALID_MOVES;
                        this.changePlayerPlaying();
                        this.undoPieceEatenCamera = false;
                    }else  this.gameState = this.gameStateEnum.ROTATE_CAMERA;
                    this.checkGameState();
                }
                if (this.gameState == this.gameStateEnum.GAME_ENDED) {
                    this.winner.setWinner(this.currentPlayer);
                }
                break;  
            }
            case 'pvc': 
            {
                if (this.gameState == this.gameStateEnum.ROTATE_CAMERA) {
                    this.rotateCamera();
                    if (this.currentCameraAngle == 0) {
                        this.gameState = this.gameStateEnum.GET_VALID_MOVES;
                    }
                }
                if(this.gameState == this.gameStateEnum.GET_VALID_MOVES){
                    this.getValidMoves();
                    this.gameCounter.startTurn();
                    console.log(this.undoEatenPieceActive);
                    if (!this.isAiPlaying) {
                        if(!this.undoAI){
                            this.isAiPlaying = true;
                            this.gameState = this.gameStateEnum.PLAYER_PLAYING;
                        }
                        else{
                            if(!this.undoEatenPieceActive){
                                
                                this.changePlayerPlaying();
                                this.gameState = this.gameStateEnum.UNDO;

                            }else{
                                 this.gameState = this.gameStateEnum.UNDO;
                            }
                               
                        }
                    }
                    else {
                        if(this.undoAI == true && this.undoEatenPieceActive == false){
                            this.gameState = this.gameStateEnum.UNDO;
                            this.isAiPlaying = false;
                        }else if(this.undoAI == true && this.undoEatenPieceActive == true){
                            this.gameState = this.gameStateEnum.AI_CHOOSING_MOVE;
                            this.isAiPlaying = false;
                        }else{
                            this.gameState = this.gameStateEnum.AI_CHOOSING_MOVE;
                            this.isAiPlaying = false;
                        }
                    }
                }
                if(this.gameState == this.gameStateEnum.PLAYER_PLAYING){ //in this case i need to make 2 undos one for the player another for the AI                 
                    if(this.undoEatenPieceActive){ //if undo is active go back with piece eaten 
                        this.undo();
                    }else{
                   this.gameCounter.processCounter(this.currentPlayer);
                    if (this.currentPlayerMove != null)
                        if (this.currentPlayerMove.length == 2) { 
                            this.gameSequence.addGameMove(this.currentPlayerMove); //add move to the game sequence
                            this.playerPlaying(this.currentPlayerMove);
                            this.gameState = this.gameStateEnum.ANIMATE;
                        }
                    }
                }
                if(this.gameState == this.gameStateEnum.AI_CHOOSING_MOVE){
                    this.aiMoveSelection();
                    this.gameState = this.gameStateEnum.AI_PLAYING;
                }
                if(this.gameState == this.gameStateEnum.AI_PLAYING){
                    if(this.undoEatenPieceActive){ //if undo is active go back with piece eaten 
                        this.undo();
                    }else{
                        this.gameCounter.processCounter(this.currentPlayer);
                        if(this.currentPlayerMove.length != null){
                            if(this.currentPlayerMove.length == 2){
                                this.gameSequence.addGameMove(this.currentPlayerMove); //add move to the game sequence
                                this.aiPlaying();
                                this.gameState = this.gameStateEnum.ANIMATE;
                            }
                        }
                    }
                } 
                if(this.gameState == this.gameStateEnum.UNDO){
                    if(this.undoAI){
                        this.undo();
                        this.undoAI = false;
                    }else{
                        this.undo();
                        this.undoAI = true;
                    }
                }
                if(this.gameState == this.gameStateEnum.ANIMATE){
                    this.animate();
                }
                if(this.gameState == this.gameStateEnum.CHECK_GAME_STATE){
                    this.gameState = this.gameStateEnum.GET_VALID_MOVES;
                    this.checkGameState();
                }
                if (this.gameState == this.gameStateEnum.GAME_ENDED) {
                    this.winner.setWinner(this.currentPlayer);
                }
                break; 
            }
            case 'cvc': 
            {
                if (this.gameState == this.gameStateEnum.ROTATE_CAMERA) {
                    this.gameState = this.gameStateEnum.GET_VALID_MOVES;
                }
                if(this.gameState == this.gameStateEnum.GET_VALID_MOVES){
                    //this.getValidMoves();
                    this.gameCounter.startTurn();
                    this.gameState = this.gameStateEnum.AI_CHOOSING_MOVE;
                }
                if(this.gameState == this.gameStateEnum.AI_CHOOSING_MOVE){
                    this.aiMoveSelection();
                    this.gameState = this.gameStateEnum.AI_PLAYING;
                }
                if(this.gameState == this.gameStateEnum.AI_PLAYING){
                    this.gameCounter.processCounter(this.currentPlayer);
                    if(this.currentPlayerMove.length != null){
                        if(this.currentPlayerMove.length == 2){
                            this.gameSequence.addGameMove(this.currentPlayerMove); //add move to the game sequence
                            this.aiPlaying();
                            this.gameState = this.gameStateEnum.ANIMATE;
                        }
                    }
                } 
                if(this.gameState == this.gameStateEnum.ANIMATE){
                    this.animate();
                }
                if(this.gameState == this.gameStateEnum.CHECK_GAME_STATE){
                    this.gameState = this.gameStateEnum.ROTATE_CAMERA;
                    this.checkGameState();
                }
                if (this.gameState == this.gameStateEnum.GAME_ENDED) {
                    //this.winner.setWinner(this.currentPlayer);
                    if(!this.filmPlaying)
                        this.playFilm();
                    //this.gameCounterState = this.gameStateEnum.PLAY_FILM; //play film
                }
                if(this.gameState == this.gameStateEnum.PLAY_FILM){
                    this.filmPlaying = false;
                    this.animator.processAnimation();
                    if(this.animator.active){  
                          this.animator.piece_to_move.setMoving(false);
                          //this.animator.tileTo.setPieceOnTile(this.animator.piece_to_move);  
                          this.gameboard.movePiece(this.animator.piece_to_move,this.animator.tileFrom,this.animator.tileTo); 
                    }else {
                        //this.animator.piece_to_move.setMoving(false);
                        //this.gameboard.movePiece(this.animator.piece_to_move,this.animator.tileFrom,this.animator.tileTo);
                        this.animator.replay();
                    }

                    /*
                    if(this.animator.canAnimate){
                        this.animator.processAnimation();
                        if(!this.animator.active){
                            if(this.isEatenMoving){ 
                                this.animator.piece_to_move.setMoving(false);
                                this.animator.tileTo.setPieceOnTile(this.animator.piece_to_move);      
                                this.isEatenMoving = false;
                                //stop animation
                                this.animator.canAnimate = false;
                                this.gameState = this.gameStateEnum.CHECK_GAME_STATE; 
                                
                            }else{
                                this.animator.piece_to_move.setMoving(false);
                                //move piece on gameboarb
                                this.gameboard.movePiece(this.animator.piece_to_move,this.animator.tileFrom,this.animator.tileTo);
                                //stop animation
                                this.animator.canAnimate = false;
                                this.gameState = this.gameStateEnum.CHECK_GAME_STATE; 
                            }
                            this.checkEatenProps();
                        }
                    }*/
                    
                }
                break;
            } 
        }
        
    }
    playFilm(){
        this.filmPlaying = true;
        console.log('ola');
        this.gameCounter.reset();
        this.gameSequence.replay(); 
    }
    orchestrate(){  
        this.manageGameplay(); 
       
    }
    update(time) { 
        this.animator.update(time);
        this.gameCounter.update(time);

        //Camera rotation time
        if(this.last_t == 0)
            this.last_t = time; 
        this.delta_t = time - this.last_t;
        this.last_t = time;
        this.sent = this.delta_t/1000;
        if (this.isRotateActive) {
            this.rotateTime += this.sent;
        }
    }
    managePick(mode, pickResults) {
        if (mode == false /* && some other game conditions */){
            if(pickResults != null && pickResults.length > 0) { // any pickResults? 
                for (var i=0; i< pickResults.length; i++) {
                    var obj = pickResults[i][0]; // get object from result 
                    if (obj) { // exists?
                        var uniqueId = pickResults[i][1] // get id
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
        //State machine for player move
        switch(this.playerMoveState)
        {
            case this.playerMoveStateEnum.PIECE_SELECT:
            {
                if(obj instanceof MyPiece){
                    //Verify if it belongs to the player who is playing
                    if ((this.currentPlayer == 5 && obj.type != 'piece_red_black' && obj.type != 'piece_red_white') ||
                        (this.currentPlayer == 9 && obj.type != 'piece_blue_black' && obj.type != 'piece_blue_white'))
                        break;
                    //Make the picked piece glow
                    this.scene.pushMatrix();
                    obj.setPicked(true);
                    obj.display();
                    this.scene.popMatrix();
                    //Create a move to be used by manageGameplay() on pvp or pvc - from coords
                    this.currentPlayerMove.push(obj.getTile().getCoords());
                    //Advance to the next state
                    this.playerMoveState = this.playerMoveStateEnum.TILE_SELECT;
                }
                break;
            }
            case this.playerMoveStateEnum.TILE_SELECT:
            {
                if(obj instanceof MyTile){
                    if (this.currentPlayerMove.length != 0) {
                        //Validate move
                        this.validateMove(obj);
                    }
                    //Advance to the next state
                    this.playerMoveState = this.playerMoveStateEnum.PIECE_SELECT;
                }
                if(obj instanceof MyPiece){
                    //Verify if it belongs to the player who is playing
                    if ((this.currentPlayer == 5 && obj.type != 'piece_red_black' && obj.type != 'piece_red_white') ||
                        (this.currentPlayer == 9 && obj.type != 'piece_blue_black' && obj.type != 'piece_blue_white')) {
                        //If it belongs to the opponent, then verify if it is a valid move
                        if (this.currentPlayerMove.length != 0) {
                            //Validate move
                            this.validateMove(obj);
                        }
                    }
                    else {
                        //Make the picked piece glow
                        this.scene.pushMatrix();
                        obj.setPicked(true);
                        obj.display();
                        this.scene.popMatrix();
                        //Reset currentMove
                        this.currentPlayerMove = [];
                        //Create a move to be used by manageGameplay() on pvp or pvc - from coords
                        this.currentPlayerMove.push(obj.getTile().getCoords());
                        //Advance to the next state
                        this.playerMoveState = this.playerMoveStateEnum.TILE_SELECT;
                    }
                }
                break;
            }
        }
    }
    
    display() { 
        this.gameboard.display(); 
        this.gameCounter.display();
        this.animator.display();
        this.winner.display(); 
    }
}

