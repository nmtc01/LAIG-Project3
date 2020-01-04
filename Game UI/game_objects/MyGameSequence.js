/**
 * 
 */
class MyGameSequence extends CGFobject{
    //Stores the a sequence of game moves (MyGameMove objects):
    constructor(scene,orchestrator){
        super(scene);
        this.orchestrator = orchestrator;
        this.moves = [];
        this.film = []; 
    }
    /**
     * Add game move to the stack
     * @param {MyGameMove} Move 
     */
    addGameMove(move){
        this.moves.push(move);
        this.film.push(move);
    }
    undo(){
        if(this.moves.length != 0)
            return this.moves.pop();
    }
    getMoves(){
        return this.moves;
    }
    replay(){ 
        //remove eaten pieces moves 
        for(let i = 0; i <this.moves.length; i++ ){
            if(this.moves[i][1][1] == -0.7 ||this.moves[i][1][1] == 6.7)
                this.moves.splice(i,1);
        }
        //reset board 
        this.orchestrator.gameState = this.orchestrator.gameStateEnum.GAME_ENDED;
        this.orchestrator.gameboard.resetGame();

       // this.orchestrator.prologInterface.initGame(this.orchestrator.prologInterface.parseInitGame.bind(this.orchestrator)); 
    }
}