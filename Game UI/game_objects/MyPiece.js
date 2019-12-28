/**
 * 
 */
class MyPiece extends CGFobject{
    //Game element that occupies tiles
    constructor(scene,type,visible,selectable, gameOrchestrator){
          super(scene);
          this.tile = null;
          //Has pointer to holding tile (if a piece is placed on the gameboard/auxiliary board)
          this.type=type; 
          this.visible = visible; 
          this.selectable = selectable
          this.orchestrator = gameOrchestrator;
          this.uniqueId = gameOrchestrator.getUniqueId();
          gameOrchestrator.increaseUniqueId();
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
          if (this.selectable) 
               this.orchestrator.getScene().registerForPick(this.uniqueId, this);
          //display specific template
          if (!this.visible)
               this.scene.setActiveShader(this.scene.invisibleShader);
          this.scene.graph.displayTemplate(this.type);
          if (!this.visible)
               this.scene.setActiveShader(this.scene.defaultShader);
          if (this.selectable) 
               this.orchestrator.getScene().clearPickRegistration();
          this.scene.popMatrix(); 
     }
}