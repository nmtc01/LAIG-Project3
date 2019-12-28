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
        this.prolog = new MyPrologInterface(this.scene);
    }
    //todo check best way to do this 
    startGame(type,level){
        console.log('start game');
        this.prolog.initGame(type,level);
    }
    orchestrate(){
        //todo
    }
    update(time) { 
        this.animator.update(time);
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

