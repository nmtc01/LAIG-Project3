/** 
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class Patch extends CGFobject {
    constructor(scene, NPointsU, NPointsV, NPartsU, NPartsV, controlPoints) {
        super(scene);
        this.NPointsU = NPointsU;
        this.NPointsV = NPointsV;
        this.NPartsU = NPartsU;
        this.NPartsV = NPartsV;

        this.controlPoints = controlPoints;
        this.init();
    }
    init() {
        let degree1 = this.NPointsU - 1;
        let degree2 = this.NPointsV - 1; 

        this.vertices = [];

        for(let u =0; u < this.NPointsU; u++ ){
            var auxU = [];
            for(let v = 0; v < this.NPointsV; v++){
                let i = this.NPointsV*u+v;
                var auxV = [this.controlPoints[i][0],this.controlPoints[i][1],this.controlPoints[i][2],1];
                auxU.push(auxV);
            }
            this.vertices.push(auxU);
        }
        this.surface = new CGFnurbsSurface(degree1, degree2, this.vertices);
        this.patch = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surface);
    }

    display() {
        this.patch.display();
    }

    updateTexCoords(lg_s, lg_t) {
    }
}