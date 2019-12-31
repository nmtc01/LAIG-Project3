class MyCounter extends CGFobject{
    constructor(scene){
        super(scene);

        this.player; 
        this.redPlayerComponent= "red_counter"
        this.bluePlayerComponent = "blue_counter"
        this.score;

        this.needleBlue = new RectPrism(this.scene,0.05,0.05,1/2);
        this.needleRed = new RectPrism(this.scene,0.05,0.05,1/2);
        
        this.material = new CGFappearance(this.scene);
        this.material.setEmission(0,0,0,0);
        this.material.setAmbient(0,0,0,0);
        this.material.setDiffuse(0,0,0,0);
        this.material.setSpecular(0,0,0,0);

        this.angleRed = 0; 
        this.angleBlue = 0; 

        this.delta_t = 0;
        this.last_t = 0;

        this.sent = 0;

    }
    start(){
        
    }
    reset(){
      
    }
    update(t){
        if(this.last_t == 0)
            this.last_t = t; 
        this.delta_t = t - this.last_t;
        this.last_t = t;
        this.sent = this.delta_t/1000 + this.sent;
        //console.log(this.sent);
    }
    display(){
        //display score object
        this.scene.pushMatrix();
        this.scene.graph.displayTemplate(this.redPlayerComponent);
        this.scene.graph.displayTemplate(this.bluePlayerComponent);
        this.scene.popMatrix();

        //display red player time and score
        this.scene.pushMatrix();
        this.scene.translate(0.4,0.1,0.7);
        this.scene.multMatrix(this.scene.graph.components['red_counter'].transformation);
       // this.rotate.translate(this.angleRed,1,0,0)
        this.material.apply();
        this.needleRed.display();
        this.scene.popMatrix();

        //diplay blue player time and score

        this.scene.pushMatrix();
        this.scene.translate(-0.4,0.1,-0.7);
        this.scene.multMatrix(this.scene.graph.components['blue_counter'].transformation);
        // this.rotate.translate(this.angleBlue,1,0,0)
        this.material.apply();
        this.needleBlue.display();
        this.scene.popMatrix();
    }
}