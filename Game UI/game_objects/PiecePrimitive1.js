class PiecePrimitive1 extends CGFobject{
    constructor(scene,type){
        super(scene);
        this.type = type; 
        this.init();
    }
    init(){
        //primitives
        this.body = new Cylinder2(this.scene, 1/3, 1/3, 1/6, 50, 50);
        this.tops = new MySphere(this.scene,1/3, 50, 50);
        
        //texture
        switch(this.type){
            case 'BW': 
                //this.topsTex = new CGFtexture(this.scene, 'images/mp_rip/rip_bk.jpg'); 
            break; 
            case 'BB': 
                //this.topsTex = new CGFtexture(this.scene, 'images/mp_rip/rip_bk.jpg'); 
            break; 
            case 'RW': 
                //this.topsTex = new CGFtexture(this.scene, 'images/mp_rip/rip_bk.jpg'); 
            break; 
            case 'RB':
                //this.topsTex = new CGFtexture(this.scene, 'images/mp_rip/rip_bk.jpg'); 
            break; 
        }
        this.topsTex = new CGFtexture(this.scene, 'scenes/images/game/BlueWhitePiece.png');

        this.midMat = new CGFappearance(this.scene);
        this.midMat.setAmbient(1, 1, 1, 1);
        this.midMat.setDiffuse(0.35, 0.35, 0.35, 1.0);
        this.midMat.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.midMat.setShininess(10.0);

        this.topMat = new CGFappearance(this.scene);
        this.topMat.setAmbient(1, 1, 1, 1);
        this.topMat.setDiffuse(1.0, 1.0, 1.0, 1.0);
        this.topMat.setSpecular(0.2, 0.2, 0.2, 1.0);
        this.topMat.setShininess(10.0);
        this.topMat.setTexture(this.topsTex);
        this.topMat.setTextureWrap('REPEAT','REPEAT');
      
    }
    display(){
        this.scene.pushMatrix(); 
        this.scene.translate(0,1/2.5,0);
        this.scene.rotate(Math.PI/2,1,0,0);
        this.midMat.apply();
        this.body.display();
        this.scene.popMatrix();

        this.scene.pushMatrix(); 
        this.scene.translate(0,1/2.5,0);
        this.scene.scale(1,1/3,1);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.topMat.apply();
        this.tops.display();
        this.scene.popMatrix();

        this.scene.pushMatrix(); 
        this.scene.translate(0,1/4.5,0);
        this.scene.scale(1,1/3,1);
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.topMat.apply();
        this.tops.display();
        this.scene.popMatrix();

    }
    updateTexCoords(lg_s, lg_t) {
	}
}