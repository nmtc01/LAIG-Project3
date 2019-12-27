class MyGameboard extends CGFobject{
    constructor(scene){
        super(scene);
        //console.log(this.scene.graph.components)
        //Stores the set of tiles that composes the entire game board
        
        //board 
        //visible tiles 
        this.visibleTiles //25 tiles
        this.tiles = {}
        //todo invisible tiles 

    }
    /**
     * Create a gameboard instance
     * @param {templates} model templates
     */
    createGameBoard(templates){
        //todo
        let type = "black";
        console.log(templates)
        //visible tiles
        for(let column = 1; column<=5; column++){
            for(let line = 1; line <=5; line++){
                let coords = [line,column]; //todo confirm if is line column
                let tile = new MyTile(this.scene,this,type,coords,true,true);
                this.tiles[coords] = tile; //todo check if it is the best way 
            }
        }
        //generate 25 tiles 
    }
    /**
     * add piece to a given tile
     * @param tile - tile to put the piece in 
     */
    addPieceToTile(tile){
        //todo
    }
    /**
     * remove piece from the given tile
     * @param tile - tile to the piece from
     */
    removePieceFromTile(tile){
        //todo
    }
    /**
     * get piece on the given tile
     * @param tile - tile to get the piece in 
     * @returns piece
     */
    getPieceOnATile(tile){
        //todo
    }
    /**
     * get tile given a piece
     * @param piece - piece given 
     * @returns tile
     */
    getTileWithPiece(piece){
        //todo
    }
    /**
     * get Tile by board coordinates
     * @param coords - Board coordinates
     * @returns tile
     */
    getTileByCoords(coords){
         //todo
    }
    /**
     * move piece on the gameboard
     * @param piece - piece to move
     * @param tileFrom -  tile where piece is standing 
     * @param tileTo - to where is going to be 
     */
    movePiece(piece,tileFrom,tileTo){
         //todo
    }
    /**
     * render gameboard
     */
    display(){
         //todo
         for(let key in this.tiles)
            this.tiles[key].display();
    }
}