/**
 * 
 */
class MyGameSequence{
    //Stores the a sequence of game moves (MyGameMove objects):
    constructor(){
        //todo
        this.moves = []
    }
    /**
     * Add game move to the stack
     * @param {MyGameMove} Move 
     */
    addGameMove(move){
        this.moves.push(move)
    }
    undo(){
        //todo 
        //manage Undo
    }
    replay(){
        //todo 
        //feeds move replay
        //degub only 
        console.log(this.moves)
    }
}