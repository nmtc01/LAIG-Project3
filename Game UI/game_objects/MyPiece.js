/**
 * 
 */
class MyPiece extends CGFobject{
    //Game element that occupies tiles
    constructor(scene){
         super(scene);

        //Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
        this.type=0; 
    }
    /**
     * set piece type 
     * @param {type} type - piece type
     */
    setType(type){
         //todo
    }
    /**
     * get piece type 
     * @returns type - piece type 
     */
    getType(){
         //todo
    }
    /**
     * render piece
     */
    display(){
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