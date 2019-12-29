/**
 * 
 */

// • Load of new scenes
// • Manage gameplay (game states) • Manages undo
// • Manages movie play
// • Manage object selection

class MyGameOrchestrator extends CGFobject{
    constructor(scene){
        super(scene);
        this.gameSequence = new MyGameSequence(this.scene); 
        this.animator = new MyAnimator(this.scene); 
        this.gameboard = new MyGameboard(this.scene, this); 
        //this.theme = new MyScenegraph(/*todo*/); 
        //this.prolog = new MyPrologInterface(/*todo*/);
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
    orchestrate(){
        //todo
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
        //this.animator.display(); 
        //...
    }
}

