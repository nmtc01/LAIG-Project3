class MyWinner extends CGFobject {
    constructor(scene,player) {
        super(scene); 

        this.player = player;
        this.rectangle = new MyRectangle(scene,-1,1,-1,1);

        this.redWinner = new CGFtexture(this.scene, "scenes/images/game/redWinner.jpg");
        this.blueWinner = new CGFtexture(this.scene, "scenes/images/game/blueWinner.jpg");
    }

    setWinner(player) {
        this.player = player;
    }

    display() {
        if (this.player != 0) {
            //update texture
            this.material =new CGFappearance(this.scene);
            this.material.setAmbient(1,1,1,1); 
            if (this.player == 5)
                this.material.setTexture(this.redWinner);
            else this.material.setTexture(this.blueWinner);
            this.material.apply();
        
            this.scene.pushMatrix(); 
            this.scene.setActiveShader(this.scene.winnerShader); 
            this.rectangle.display();       
            this.scene.popMatrix();
            this.scene.setActiveShader(this.scene.defaultShader);
        }
    }
}