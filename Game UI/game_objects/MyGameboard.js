class MyGameBoard{
    constructor(type,pieces,tiles){
        //Stores the set of tiles that composes the entire game board
        this.type = type;
        this.pieces = pieces; 
        this.tiles = tiles;
    }
    /**
     * Create a gameboard instance
     */
    createGameBoard(){
        //todo
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
    }
}