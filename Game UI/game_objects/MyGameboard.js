class MyGameboard extends CGFobject{
    constructor(scene, gameOrchestrator){
        super(scene);
        //console.log(this.scene.graph.components)
        //Stores the set of tiles that composes the entire game board      
        //board 
        //visible tiles 
        this.tiles = {};
        this.orchestrator = gameOrchestrator;
        //todo invisible tiles 

    }
    /**
     * Create a gameboard instance
     * @param {templates} model templates
     */
    createGameBoard(templates){

        let type = "tile_black";
        //visible tiles
        //generate 25 tiles 
        for(let column = 1; column<=5; column++){
            for(let line = 1; line <=5; line++){
                let coords = [line,column]; //todo confirm if is line column
                let tile = new MyTile(this.scene,this,type,coords,true,true,this.orchestrator);
                this.tiles[coords] = tile; //todo check if it is the best way 
                //change tile type 
                if(type == "tile_black")
                    type = "tile_white"
                else type = "tile_black"
            }
        }
        //generate 10 auxiliary tiles
        for(let red = 1; red <= 5; red++) {
            let coords = [red,-0.7];
            let tile = new MyTile(this.scene,this,type,coords,false,true,this.orchestrator);
            this.tiles[coords] = tile; 
        }
        for(let blue = 1; blue <= 5; blue++) {
            let coords = [blue,6.7];
            let tile = new MyTile(this.scene,this,type,coords,false,true,this.orchestrator);
            this.tiles[coords] = tile; 
        }
    }
    resetGame(){
        for(let key in this.tiles){
            this.tiles[key].unsetPieceOnTile();
        }
    }
    /**
     * add piece to a given tile
     * @param tile - tile to put the piece in 
     */
    addPieceToTile(tile,piece){
        tile.setPieceOnTile(piece);
    }
    /**
     * get piece on the given tile
     * @param tile - tile to get the piece in 
     * @returns piece
     */
    getPieceOnATile(tile){
        return tile.getPiece();
    }
    /**
     * get tile given a piece
     * @param piece - piece given 
     * @returns tile
     */
    getTileWithPiece(piece){
        for(let key in this.tiles){
            if (this.tiles[key].getPiece() == piece)
             return this.tiles[key];
        }
    }
    /**
     * get Tile by board coordinates
     * @param coords - Board coordinates
     * @returns tile
     */
    getTileByCoords(coords){
       for(let key in this.tiles){
           if (key == coords)
            return this.tiles[key];
       }
    }
    /**
     * move piece on the gameboard
     * @param piece - piece to move
     * @param tileFrom -  tile where piece is standing 
     * @param tileTo - to where is going to be 
     */
    movePiece(piece,tileFrom,tileTo){
        tileFrom.unsetPieceOnTile();
        tileTo.setPieceOnTile(piece);        
    }
    resetValidMoves(){
        for(let key in this.tiles){
            let piece = this.tiles[key].getPiece()
            if (piece != null )
                piece.resetPieceValidMoves();
        }
    }
    /**
     * render gameboard
     */
    display(){
        for(let key in this.tiles)
            this.tiles[key].display();
    }
}