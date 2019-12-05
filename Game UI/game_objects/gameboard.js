/**
 * GameBoard
 * @param scene - Reference to MyScene object
 * @param x1 - diagonal x1
 * @param y1 - diagonal y1
 * @param x2 - diagonal x2
 * @param y2 - diagonal y2
 * 
 * Addapted from Plane.js
 * Board height is always set at 1/8 = 0.125 = y
 */
class Gameboard extends CGFobject{
    constructor(scene,x1,z1,x2,z2,NPartsU,NPartsV){
        super(scene);
        this.x1 = x1; 
        this.z1 = z1; 
        this.x2 = x2; 
        this.z2 = z2; 
        this.NPartsU= NPartsU; 
        this.NPartsV= NPartsV;

        this.init();
    }

    init(){
        /**
         * diagonal orientation 
         *  
         *   z
         *   ^     ^
         *   |    /
         *   |   /
         *   |  /
         *   | /
         *   + - - - - - - - > x
         */
        this.controlPointsTop = [
                                [
                                    [this.x1, 1/8, this.z1, 1],  
                                    [this.x1, 1/8, this.z2, 1]
                                ], 
                                [
                                    [this.x2, 1/8, this.z1, 1],  
                                    [this.x2, 1/8, this.z2, 1] 
                                ]
                            ]; 
		this.surfaceTop = new CGFnurbsSurface(1, 1, this.controlPointsTop);
        this.board = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surfaceTop);
       
        //board sides
        this.controlPointsSides1 = [
            [
                [this.x1, 0, this.z1, 1],  
                [this.x1, 1/8, this.z1, 1]
            ], 
            [
                [this.x2, 0, this.z1, 1],  
                [this.x2, 1/8, this.z1, 1] 
            ]
        ]; 

        this.controlPointsSides2 = [
            [
                [this.x2, 0, this.z1, 1],  
                [this.x2, 1/8, this.z1, 1]
            ], 
            [
                [this.x2, 0, this.z2, 1],  
                [this.x2, 1/8, this.z2, 1] 
            ]
        ]; 

        this.controlPointsSides3 = [
            [
                [this.x2, 0, this.z2, 1],  
                [this.x2, 1/8, this.z2, 1]
            ], 
            [
                [this.x1, 0, this.z2, 1],  
                [this.x1, 1/8, this.z2, 1] 
            ]
        ]; 

        this.controlPointsSides4 = [
            [
                [this.x1, 0, this.z2, 1],  
                [this.x1, 1/8, this.z2, 1]
            ], 
            [
                [this.x1, 0, this.z1, 1],  
                [this.x1, 1/8, this.z1, 1] 
            ]
        ]; 

        this.surfaceSide1 = new CGFnurbsSurface(1, 1, this.controlPointsSides1);
        this.side1 = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surfaceSide1);

        this.surfaceSide2 = new CGFnurbsSurface(1, 1, this.controlPointsSides2);
        this.side2 = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surfaceSide2);

        this.surfaceSide3 = new CGFnurbsSurface(1, 1, this.controlPointsSides3);
        this.side3 = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surfaceSide3);

        this.surfaceSide4 = new CGFnurbsSurface(1, 1, this.controlPointsSides4);
        this.side4 = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surfaceSide4);

        //bottom 

        this.controlPointsBottom = [
            [
                [this.x1, 0, this.z2, 1],  
                [this.x1, 0, this.z1, 1]
            ], 
            [
                [this.x2, 0, this.z2, 1],  
                [this.x2, 0, this.z1, 1] 
            ]
        ]; 
    this.surfaceBot = new CGFnurbsSurface(1, 1, this.controlPointsBottom);
    this.bottom = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surfaceBot);

    }
    //todo add edges planes
    display(){
        this.board.display();
        this.side1.display();
        this.side2.display();
        this.side3.display();
        this.side4.display();
        this.bottom.display(); 

        //todo smth with textures
    }

    updateTexCoords(lg_s, lg_t) {
	}
}