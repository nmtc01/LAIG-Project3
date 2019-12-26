/**
 * 
 */
class MyTile extends CGFobject{

    constructor(scene,gameboard,coords){
        super(scene)
        // Has pointer to gameboard and pointer to piece (if a piece occupies tile)
        this.gameboard = gameboard;
        this.coords = coords;
        this.piece = null; 
        this.type=0; 
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
    }

    unsetPieceOnTile(){
        this.piece = null;
    }
    /**
     * render tile
     */
    display(){

    }
}