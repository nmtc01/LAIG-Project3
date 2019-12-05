/**
* MySkybox
* @constructor
 * @param scene - Reference to MyScene object
 * @param size - Skybox size
*/
class MySkybox extends CGFobject {
	constructor(scene, size) {
		super(scene);
		this.size = size;

        this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
		//Down face
			-this.size, -this.size, -this.size, //0
			this.size , -this.size, this.size , //1
			this.size , -this.size, -this.size, //2
			-this.size, -this.size, this.size , //3
		//Side faces
			this.size, -this.size, this.size,    //4
			this.size, -this.size, -this.size,   //5
			this.size, this.size, -this.size,    //6
			this.size, this.size, this.size,     //7

			-this.size, -this.size, this.size, //8
			this.size, -this.size, this.size,  //9		
			this.size, this.size, this.size,   //10
			-this.size, this.size, this.size,  //11

			-this.size, -this.size, -this.size, //12
			-this.size, -this.size, this.size,  //13
			-this.size, this.size, this.size,   //14
			-this.size, this.size, -this.size,  //15

			this.size, -this.size, -this.size,  //16
			-this.size, -this.size, -this.size, //17
			-this.size, this.size, -this.size,  //18
			this.size, this.size, -this.size,   //19
		//Up face
			-this.size, this.size, this.size,   //20
			this.size, this.size, this.size,    //21
			this.size, this.size, -this.size,   //22
			-this.size, this.size, -this.size   //23
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			1, 2, 0,
			3, 1, 0,

			6, 5, 4,
			7, 6, 4,

			10, 9, 8,
			8, 11, 10,

			14, 13, 12,
			12, 15, 14,

			18, 17, 16,
			16, 19, 18,
			
			22, 21, 20,
			20, 23, 22
		];

		this.normals = [0, 1, 0,
						0, 1, 0,
						0, 1, 0,
						0, 1, 0,
						-1,  0, 0,
						-1,  0, 0,
						-1,  0, 0,
						-1,  0, 0,
						0,  0, -1,
						0,  0, -1,
						0,  0, -1,
						0,  0, -1,
						1,  0, 0,
						1,  0, 0,
						1,  0, 0,
						1,  0, 0,
						0, 0 , 1,
						0, 0 , 1,
						0, 0 , 1,
						0, 0 , 1,
						0, -1, 0,
						0, -1, 0,
						0, -1, 0,
						0, -1, 0];
        
        this.texCoords = [
        //Face inferior
            0.25,0.5,
            0.5, 0.75,
            0.5,0.5,
            0.25,0.75,
		//Faces laterais
            0.75,0.5,
            0.5,0.5,
			0.5,0.25,
			0.75,0.25,

			1,0.5,
			0.75,0.5,
			0.75,0.25,
			1,0.25,

			0.25,0.5,
			0,0.5,
			0,0.25,
			0.25,0.25,

			0.5,0.5,
			0.25,0.5,
			0.25,0.25,
			0.5,0.25,
		//Face superior
			0.25,0,
			0.5,0,
			0.5,0.25,
			0.25,0.25
        ];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
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
}

