/** 
 * MyTable
 * @constructor
 * @param scene - Reference to MyScene object
 * @param base - Base radius
 * @param top - Top radius
 * @param height - Size in the direction of the positive Z axis
 * @param slices - Number of divisions around the circumference
 * @param stacks - Number of divisions along the Z direction 
 */
class MyTable extends CGFobject{
    constructor(scene, width, length, height){
        super(scene);
        this.width= width;
        this.length= length; 
        this.height= height; 

        this.init();
    }

    init() {
        //Legs
        this.leg = new RectPrism(this.scene, this.height*0.2, this.height*0.2, this.height);
        //Base
        this.base_height = 0.5;
        this.base = new RectPrism(this.scene, this.width*0.9, this.length*0.9, this.base_height);
        //Top
        this.top = new RectPrism(this.scene, this.width, this.length, 0.2);
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(0, this.base_height + this.height, 0);
        this.top.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, this.base_height/2 + this.height, 0);
        this.base.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.length/2*0.9+this.height*0.1, this.height/2, this.width/2*0.9-this.height*0.1);
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.length/2*0.9+this.height*0.1, this.height/2, -this.width/2*0.9+this.height*0.1);
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.length/2*0.9-this.height*0.1, this.height/2, -this.width/2*0.9+this.height*0.1);
        this.leg.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(this.length/2*0.9-this.height*0.1, this.height/2, this.width/2*0.9-this.height*0.1);
        this.leg.display();
        this.scene.popMatrix();
    }

    /**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 * @param {Int} lg_s - Sacling factor length
	 * @param {Int} lg_t - Sacling factor length
	 * in this case the arguments do nothing
	 */
	updateTexCoords(lg_s, lg_t) {
		this.updateTexCoordsGLBuffers();
	}
}