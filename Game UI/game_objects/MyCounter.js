class MyCounter extends CGFobject{
    constructor(scene,orchestrator){
        super(scene);
        this.orchestrator = orchestrator;

        this.player; 
        this.redPlayerComponent= "red_counter"
        this.bluePlayerComponent = "blue_counter"
        // clock stuff
        this.needleBlue = new RectPrism(this.scene,0.05,0.05,1/2);
        this.needleRed = new RectPrism(this.scene,0.05,0.05,1/2);
        
        this.needleMat = new CGFappearance(this.scene);
        this.needleMat.setEmission(0,0,0,0);
        this.needleMat.setAmbient(0,0,0,0);
        this.needleMat.setDiffuse(0,0,0,0);
        this.needleMat.setSpecular(0,0,0,0);

        this.moveTime = 30; //defines turn time in seconds

        this.angleRed = 0; 
        this.angleBlue = 0; 

        //scores stuff
        this.unitsRed = new Plane(this.scene,30,30); 
        this.dozensRed = new Plane(this.scene,30,30);
        this.hundredsRed = new Plane(this.scene,30,30);

        this.scoreNumber = new Plane(this.scene,30,30); 

        //numbers texture
        this.zeroTex = new CGFtexture(this.scene,"scenes/images/numbers/score0.png");
        this.oneTex = new CGFtexture(this.scene,"scenes/images/numbers/score1.png");
        this.twoTex = new CGFtexture(this.scene,"scenes/images/numbers/score2.png");
        this.threeTex = new CGFtexture(this.scene,"scenes/images/numbers/score3.png");
        this.fourTex = new CGFtexture(this.scene,"scenes/images/numbers/score4.png");
        this.fiveTex = new CGFtexture(this.scene,"scenes/images/numbers/score5.png");

        //numbers mat 
        this.scoreBlueMat = new CGFappearance(this.scene);
        this.scoreBlueMat.setEmission(0,0,0,0);
        this.scoreBlueMat.setAmbient(1,1,1,1);
        this.scoreBlueMat.setDiffuse(1,1,1,1);
        this.scoreBlueMat.setSpecular(0,0,0,0);
        this.scoreBlueMat.setTexture(this.zeroTex);

        this.scoreRedMat = new CGFappearance(this.scene);
        this.scoreRedMat.setEmission(0,0,0,0);
        this.scoreRedMat.setAmbient(1,1,1,1);
        this.scoreRedMat.setDiffuse(1,1,1,1);
        this.scoreRedMat.setSpecular(0,0,0,0);
        this.scoreRedMat.setTexture(this.zeroTex);

        this.blueScore = 0; 
        this.redScore = 0;

        //times
        this.redTime=0; 
        this.blueTime=0; 

        this.delta_t = 0;
        this.last_t = 0;

        this.sent = 0;

    }
    setTurnTime(time){
        this.moveTime = time;
    }
    reset(){
        this.sent = 0 ; 
            this.blueTime =0; 
            this.redTime =0; 
            this.angleBlue = 0; 
            this.angleRed = 0; 
            this.scoreRedMat.setTexture(this.zeroTex);
            this.scoreBlueMat.setTexture(this.zeroTex);
        
    }
    startTurn(){
            this.sent = 0 ; 
            this.blueTime =0; 
            this.redTime =0; 
            this.angleBlue = 0; 
            this.angleRed = 0; 
    }
    downScore(playerPlaying){
      switch(playerPlaying){
        case 5: 
        console.log(this.blueScore);
            this.blueScore -= 2; 
            this.updateScores(9);
        break; 

        case 9:
            this.redScore -= 2; 
            this.updateScores(5);
        break;
      }
    }
    updateScores(playerPlaying){
        switch(playerPlaying){
            case 5: 
                this.redScore++; 
                //update texture 
                switch(this.redScore){
                    case 0:
                        this.scoreRedMat.setTexture(this.zeroTex);
                    break; 
                    case 1: 
                        this.scoreRedMat.setTexture(this.oneTex);
                    break; 
                    case 2: 
                        this.scoreRedMat.setTexture(this.twoTex);
                    break; 
                    case 3: 
                        this.scoreRedMat.setTexture(this.threeTex);
                    break; 
                    case 4:
                        this.scoreRedMat.setTexture(this.fourTex); 
                    break; 
                    case 5:
                        this.scoreRedMat.setTexture(this.fiveTex); 
                    break; 
                }
            break; 
            case 9: 
                this.blueScore++; 
                //update texture 
                switch(this.blueScore){
                    case 0:
                        this.scoreBlueMat.setTexture(this.zeroTex);
                    break; 
                    case 1: 
                        this.scoreBlueMat.setTexture(this.oneTex);
                    break; 
                    case 2: 
                        this.scoreBlueMat.setTexture(this.twoTex);
                    break; 
                    case 3: 
                        this.scoreBlueMat.setTexture(this.threeTex);
                    break; 
                    case 4:
                        this.scoreBlueMat.setTexture(this.fourTex); 
                    break; 
                    case 5:
                        this.scoreBlueMat.setTexture(this.fiveTex); 
                    break; 
                }
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
    processCounter(currentPlayer){
        switch(currentPlayer){
            case 5: 
                //check if player has lost their turn 
                if(this.redTime > this.moveTime){
                    this.orchestrator.changePlayerPlaying();
                    this.orchestrator.gameState = this.orchestrator.gameStateEnum.ROTATE_CAMERA;
                }
                //calculate times
                this.redTime = this.sent;
                this.angleRed = -this.sent*2*Math.PI/this.moveTime;
            break; 
            case 9: 
                //check if player has lost their turn 
                if(this.blueTime > this.moveTime){
                    this.orchestrator.changePlayerPlaying();
                    this.orchestrator.gameState = this.orchestrator.gameStateEnum.ROTATE_CAMERA;
                }
                //calculate times
                this.blueTime = this.sent;
                this.angleBlue = this.sent*2*Math.PI/this.moveTime;
            break; 
        }
    }
    displayTime(){
         //display red player time and score
         this.scene.pushMatrix();
         this.scene.translate(0.4,-0.15,0.7);
         this.scene.multMatrix(this.scene.graph.components[ this.redPlayerComponent].transformation);
         this.scene.rotate(this.angleRed,1,0,0);
         this.scene.translate(0,0.2,0);
         this.needleMat.apply();
         this.needleRed.display();
         this.scene.popMatrix();
 
         //diplay blue player time and score
 
         this.scene.pushMatrix();
         this.scene.translate(-0.4,-0.15,-0.7);
         this.scene.multMatrix(this.scene.graph.components[ this.bluePlayerComponent].transformation);
         this.scene.rotate(this.angleBlue,1,0,0)
         this.scene.translate(0,0.2,0);
         this.needleMat.apply();
         this.needleBlue.display();
         this.scene.popMatrix();
    }
    displayScore(){
        //BLUE
        this.scene.pushMatrix();
        this.scene.multMatrix(this.scene.graph.components[ this.bluePlayerComponent].transformation);
        this.scene.translate(-0.41,-0.1,0.7);
        this.scene.scale(1,0.9,0.6)
        this.scene.rotate(Math.PI/2,1,0,0);
        this.scene.rotate(Math.PI/2,0,0,1);
        this.scoreBlueMat.apply();
        this.scoreNumber.display();
        this.scene.popMatrix();

        //RED
        this.scene.pushMatrix();
        this.scene.multMatrix(this.scene.graph.components[ this.redPlayerComponent].transformation);
        this.scene.translate(0.41,-0.1,-0.7);
        this.scene.scale(1,0.9,0.6)
        this.scene.rotate(Math.PI/2,1,0,0);
        this.scene.rotate(-Math.PI/2,0,0,1);
        this.scoreRedMat.apply();
        this.scoreNumber.display();
        this.scene.popMatrix();

    }
    display(){
        //display score object
        this.scene.pushMatrix();
        //if red player apply glowing shader or marker 
        this.scene.graph.displayTemplate(this.redPlayerComponent);
        //if blue player apply glowing shader or marker 
        this.scene.graph.displayTemplate(this.bluePlayerComponent);
        this.scene.popMatrix();

        this.displayTime();
        this.displayScore();
       
    }
}
