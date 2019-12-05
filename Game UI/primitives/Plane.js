/** 
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class Plane extends CGFobject{
    constructor(scene, NPartsU,NPartsV){
        super(scene);
        this.NPartsU= NPartsU; 
        this.NPartsV= NPartsV;

        this.init();
    }

    init(){
        this.controlPoints = [
                                [
                                    [-1/2, 0, 1/2, 1],  
                                    [-1/2, 0, -1/2, 1]
                                ], 
                                [
                                    [1/2, 0, 1/2, 1],  
                                    [1/2, 0, -1/2, 1] 
                                ]
                            ]; //Vector(2|3|4) [][]
		this.surface = new CGFnurbsSurface(1, 1, this.controlPoints);
		this.plane = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surface);
    }

    display(){
        this.plane.display();
    }

    updateTexCoords(lg_s, lg_t) {
	}
}