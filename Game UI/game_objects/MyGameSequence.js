/**
 * 
 */
class MyGameSequence{
    //Stores the a sequence of game moves (MyGameMove objects):
    constructor(){
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
    replay(){
        //todo 
        //feeds move replay
        //degub only 
        console.log(this.moves)
    }
}