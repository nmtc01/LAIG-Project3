/**
 * 
 */

// • Load of new scenes
// • Manage gameplay (game states) • Manages undo
// • Manages movie play
// • Manage object selection

class MyGameOrchestrator{
    constructor(Templates){
        this.gameSequence = new MyGameSequence(/*todo*/); 
        this.animator = new MyAnimator(/*todo*/); 
        this.gameboard = new MyGameboard(Templates['Tiles'],Templates['Pieces']); 
        //this.theme = new MyScenegraph(/*todo*/); 
        //this.prolog = new MyPrologInterface(/*todo*/);

    }
    orchestrate(){
        //todo
    }
    update(time) { 
        this.animator.update(time);
    }
    display() { 
        //this.theme.display(); 
        this.gameboard.display(); 
        //this.animator.display(); 
        //...
    }
}

