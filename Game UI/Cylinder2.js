/** 
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param x - Scale of rectangle in X
 * @param y - Scale of rectangle in Y
 */
class Cylinder2 extends CGFobject{
    constructor(scene, base, top, height, slices, stacks){
        super(scene);
        this.base= base;
        this.top= top; 
        this.height= height; 
        this.NPartsU= stacks; 
        this.NPartsV= slices/2;
        this.NPointsU= 2;
        this.NPointsV= 4;

        this.init();
    }

    init(){
        let degree1 = this.NPointsU - 1;
        let degree2 = this.NPointsV - 1;
        let h_base = this.base*4/3; //calculated with algorythm of Casteljau
        let h_top = this.top*4/3;

        this.controlPoints1 = [
            //U0
            [
                //V0
                [-this.base, 0, 0, 1],
                //V1
                [-this.base, h_base, 0, 1],
                //V2
                [this.base, h_base, 0, 1],
                //V3
                [this.base, 0, 0, 1]
            ],
            //U1
            [
                //V0
                [-this.top, 0, this.height, 1],
                //V1
                [-this.top, h_top, this.height, 1],
                //V2
                [this.top, h_top, this.height, 1],
                //V3
                [this.top, 0, this.height, 1]
            ]
        ];
        this.controlPoints2 = [
            //U0
            [
                //V0
                [this.base, 0, 0, 1],
                //V1
                [this.base, -h_base, 0, 1],
                //V2
                [-this.base, -h_base, 0, 1],
                //V3
                [-this.base, 0, 0, 1]
            ],
            //U1
            [
                //V0
                [this.top, 0, this.height, 1],
                //V1
                [this.top, -h_top, this.height, 1],
                //V2
                [-this.top, -h_top, this.height, 1],
                //V3
                [-this.top, 0, this.height, 1]
            ]
        ];

        this.surface1 = new CGFnurbsSurface(degree1, degree2, this.controlPoints1);
        this.surface2 = new CGFnurbsSurface(degree1, degree2, this.controlPoints2);
        this.cylinder2_part1 = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surface1);
        this.cylinder2_part2 = new CGFnurbsObject(this.scene, this.NPartsU, this.NPartsV, this.surface2);
    }

    display(){
        this.cylinder2_part1.display();
        this.cylinder2_part2.display();
    }

    updateTexCoords(lg_s, lg_t) {
	}
}