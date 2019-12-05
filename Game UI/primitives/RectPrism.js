/**
* RectPrism
* @constructor
 * @param scene - Reference to MyScene object
 * @param width - Width
 * @param length - Length
 * @param height - Height
*/
class RectPrism extends CGFobject {
	constructor(scene, width, length, height) {
		super(scene);
        this.width = width;
        this.length = length;
        this.height = height;

        this.init();
	}
	init() {
		//Side faces
		let r1 = new MyRectangle(this.scene, -this.length/2, this.length/2, -this.height/2, this.height/2);
		let r3 = new MyRectangle(this.scene, -this.width/2, this.width/2, -this.height/2, this.height/2);
		//Base faces
		let r5 = new MyRectangle(this.scene, -this.length/2, this.length/2, -this.width/2, this.width/2);
		
		this.faces = [r1, r3, r5];
	}

	/**
	 * @method updateTexCoords
	 * Updates the list of texture coordinates of the rectangle
	 * @param {Array} coords - Array of texture coordinates
	 * @param {Int} lg_s - Sacling factor length
	 * @param {Int} lg_t - Sacling factor length
	 * in this case the arguments to nothing
	 */
	updateTexCoords(lg_s, lg_t) {
		this.updateTexCoordsGLBuffers();
	}

	display() {
		this.scene.pushMatrix();
		this.scene.translate(0,0,this.width/2);
		this.faces[0].display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI, 0, 1, 0);
		this.scene.translate(0,0,this.width/2);
		this.faces[0].display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 0, 1, 0);
		this.scene.translate(0,0,this.length/2);
		this.faces[1].display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 0, 1, 0);
		this.scene.translate(0,0,this.length/2);
		this.faces[1].display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(Math.PI/2, 1, 0, 0);
		this.scene.translate(0,0,this.height/2);
		this.faces[2].display();
		this.scene.popMatrix();

		this.scene.pushMatrix();
		this.scene.rotate(-Math.PI/2, 1, 0, 0);
		this.scene.translate(0,0,this.height/2);
		this.faces[2].display();
		this.scene.popMatrix();
	}
}
