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
class GameboardPrimitive1 extends CGFobject{
    constructor(scene){
        super(scene);
        this.x1 = -2; 
        this.z1 = 2; 
        this.x2 = 2; 
        this.z2 = -2; 
        this.NPartsU = 50; 
        this.NPartsV = 50;

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

    //textures 
    this.topTex = new CGFtexture(this.scene, 'scenes/images/game/Board1.png');
    
    this.topMat = new CGFappearance(this.scene);
    this.topMat.setAmbient(1, 1, 1, 1);
    this.topMat.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.topMat.setSpecular(0.2, 0.2, 0.2, 1.0);
    this.topMat.setShininess(10.0);
    this.topMat.setTexture(this.topTex);
    this.topMat.setTextureWrap('REPEAT','REPEAT');

    this.sideMat = new CGFappearance(this.scene);
    this.sideMat.setAmbient(1, 1, 1, 1);
    this.sideMat.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.sideMat.setSpecular(0.2, 0.2, 0.2, 1.0);
    this.sideMat.setShininess(10.0);
    //materials

    }
    display(){
        this.scene.pushMatrix();
        this.topMat.apply();
        this.board.display();
        this.scene.popMatrix();
       
        this.scene.pushMatrix();
        this.sideMat.apply();
        this.side1.display();
        this.side2.display();
        this.side3.display();
        this.side4.display();
        this.bottom.display(); 
        this.scene.popMatrix();

    }

    updateTexCoords(lg_s, lg_t) {
	}
}