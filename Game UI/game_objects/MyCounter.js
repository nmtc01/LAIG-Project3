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

        this.moveTime = 30;

        this.angleRed = 0; 
        this.angleBlue = 0; 

        this.redTime=0; 
        this.blueTime=0; 

        this.delta_t = 0;
        this.last_t = 0;

        this.sent = 0;

    }
    startTurn(){
            this.sent = 0 ; 
            this.blueTime =0; 
            this.redTime =0; 
            this.angleBlue = 0; 
            this.angleRed = 0; 
    }
    reset(){
      
    }
    processCounter(currentPlayer){
        switch(currentPlayer){
            case 5: 
                this.redTime = this.sent;
                this.angleRed = -this.sent*2*Math.PI/this.moveTime;
            break; 
            case 9: 
                this.blueTime = this.sent;
                this.angleBlue = this.sent*2*Math.PI/this.moveTime;
            break; 
        }
    }
    update(t){
        if(this.last_t == 0)
            this.last_t = t; 
        this.delta_t = t - this.last_t;
        this.last_t = t;
        this.sent = this.delta_t/1000 + this.sent;
    }
    display(){
        //display score object
        this.scene.pushMatrix();
        this.scene.graph.displayTemplate(this.redPlayerComponent);
        this.scene.graph.displayTemplate(this.bluePlayerComponent);
        this.scene.popMatrix();

        //display red player time and score
        this.scene.pushMatrix();
        this.scene.translate(0.4,-0.1,0.7);
        this.scene.multMatrix(this.scene.graph.components['red_counter'].transformation);
        this.scene.rotate(this.angleRed,1,0,0);
        this.scene.translate(0,0.2,0);
        this.material.apply();
        this.needleRed.display();
        this.scene.popMatrix();

        //diplay blue player time and score

        this.scene.pushMatrix();
        this.scene.translate(-0.4,-0.1,-0.7);
        this.scene.multMatrix(this.scene.graph.components['blue_counter'].transformation);
        this.scene.rotate(this.angleBlue,1,0,0)
        this.scene.translate(0,0.2,0);
        this.material.apply();
        this.needleBlue.display();
        this.scene.popMatrix();
    }
}