/**
 * 
 */
class MyPiece extends CGFobject{
    //Game element that occupies tiles
    constructor(scene,type,visible,selectable){
         super(scene);
         this.tile = null;
          //Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
          this.type=type; 
          this.visible = visible; 
          this.selectable = selectable
    }
    /**
     * set piece tile standing in
     */
    setTile(tile){
         this.tile= tile;
    }
    /**
     * set piece type 
     * @param {type} type - piece type
     */
    setType(type){
         //todo
         this.type = type;
    }
    /**
     * get piece type 
     * @returns type - piece type 
     */
    getType(){
         //todo
         return this.type;
    }
    /**
     * render piece
     */
    display(){
         this.scene.pushMatrix();
         //display specific template
         this.scene.graph.displayTemplate(this.type);
 
         this.scene.popMatrix(); 
          //todo
     /*
         if (this.selectable) 
               this.orchestrator.getScene().registerForPick(this.uniqueId, this);
          // Now call all the game objects/components/primitives display 
          // method that should be selectable and recognized
           // with this uniqueId

          // clear the currently registered id and associated object
          if (this.selectable) this.orchestrator.getScene().clearPickRegistration();
     */
    }
}