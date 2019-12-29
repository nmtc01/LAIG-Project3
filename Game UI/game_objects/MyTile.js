/**
 * 
 */
class MyTile extends CGFobject{

    constructor(scene,gameboard,type,coords,visible,selectable,gameOrchestrator){
        super(scene)
        // Has pointer to gameboard and pointer to piece (if a piece occupies tile)
        this.gameboard = gameboard;
        this.coords = coords;
        this.piece = null; 
        this.visible = visible; 
        this.selectable = selectable
        this.type=type; 
        this.orchestrator = gameOrchestrator;
        this.uniqueId = gameOrchestrator.getUniqueId();
        gameOrchestrator.increaseUniqueId();

        this.validMoveTile = false;

        //display util
        this.displayCoords = [coords[1] - 3, 0,coords[0] - 3] //transalate x,y,z
        
    }
    /**
     * get piece on thta tile
     * @returns piece
     */
    getPiece(){
        return this.piece;
    }
    /**
     * set piece on tile
     * @param piece -  piece to put 
     */
    setPieceOnTile(piece){
        this.piece = piece;
        this.piece.setTile(this);
    }

    unsetPieceOnTile(){
        this.piece = null;
    }
    /**
     * return coords
     */
    getCoords(){
        return this.coords; 
    }
    getDisplayCoords(){
        return this.displayCoords;
    }
    setValidMoveTile(bool){
        this.validMoveTile = bool;
    }
    /**
     * render tile
     */
    display(){
        //make tranformation for where the object should go 
        this.scene.pushMatrix();

        if (this.selectable) 
            this.orchestrator.getScene().registerForPick(this.uniqueId, this);
        if (!this.visible)
            this.scene.setActiveShader(this.scene.invisibleShader);
        else if (this.validMoveTile)
            this.scene.setActiveShader(this.scene.glowShader);
        //display specific template
        this.scene.translate(this.displayCoords[0],this.displayCoords[1],this.displayCoords[2]);
        this.scene.graph.displayTemplate(this.type);
        if (!this.visible || this.validMoveTile )
            this.scene.setActiveShader(this.scene.defaultShader);
        //if has piece display it
        //todo if is animating 
        if(this.piece != null && !this.piece.getMoving())
            this.piece.display();
        if (this.selectable) 
            this.orchestrator.getScene().clearPickRegistration();

        this.scene.popMatrix(); 
    }
}