class MyGameboard extends CGFobject{
    constructor(scene){
        super(scene);
        //console.log(this.scene.graph.components)
        //Stores the set of tiles that composes the entire game board      
        //board 
        //visible tiles 
        this.auxTiles = {}; //25 tiles
        this.tiles = {};
        //todo invisible tiles 

    }
    /**
     * Create a gameboard instance
     * @param {templates} model templates
     */
    createGameBoard(templates){
        //todo
        let type = "tile_black";
        //visible tiles
        //generate 25 tiles 
        for(let column = 1; column<=5; column++){
            for(let line = 1; line <=5; line++){
                let coords = [line,column]; //todo confirm if is line column
                let tile = new MyTile(this.scene,this,type,coords,true,false);
                this.tiles[coords] = tile; //todo check if it is the best way 
                //change tile type 
                if(type == "tile_black")
                    type = "tile_white"
                else type = "tile_black"
            }
        }
        //place 10 pieces
        this.tiles[[1,1]].setPieceOnTile(new MyPiece(this.scene,"piece_red_white",true,true));
        this.tiles[[1,2]].setPieceOnTile(new MyPiece(this.scene,"piece_red_black",true,true));
        this.tiles[[1,3]].setPieceOnTile(new MyPiece(this.scene,"piece_red_white",true,true));
        this.tiles[[1,4]].setPieceOnTile(new MyPiece(this.scene,"piece_red_black",true,true));
        this.tiles[[1,5]].setPieceOnTile(new MyPiece(this.scene,"piece_red_white",true,true));

        this.tiles[[5,1]].setPieceOnTile(new MyPiece(this.scene,"piece_blue_white",true,true));
        this.tiles[[5,2]].setPieceOnTile(new MyPiece(this.scene,"piece_blue_black",true,true));
        this.tiles[[5,3]].setPieceOnTile(new MyPiece(this.scene,"piece_blue_white",true,true));
        this.tiles[[5,4]].setPieceOnTile(new MyPiece(this.scene,"piece_blue_black",true,true));
        this.tiles[[5,5]].setPieceOnTile(new MyPiece(this.scene,"piece_blue_white",true,true));
      
    }
    /**
     * add piece to a given tile
     * @param tile - tile to put the piece in 
     */
    addPieceToTile(tile,piece){
        this.removePieceFromTile(tile);
        tile.setPieceOnTile(piece);
    }
    /**
     * remove piece from the given tile
     * @param tile - tile to the piece from
     */
    removePieceFromTile(tile){
        tile.setPieceOnTile(null);
    }
    /**
     * get piece on the given tile
     * @param tile - tile to get the piece in 
     * @returns piece
     */
    getPieceOnATile(tile){
        tile.getPiece();
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