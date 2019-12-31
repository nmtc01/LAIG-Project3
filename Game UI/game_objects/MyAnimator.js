/**
 * 
 */
class MyAnimator extends CGFobject{
    //Manages the animation of a game sequence
    constructor(scene,orchestrator,sequence){
        super(scene);
        this.orchestrator = orchestrator;

        this.sequence = sequence;

        this.canAnimate = false;
        this.active = false;
        //Has:
            // Pointer to the orchestrator 
            // Gets a game sequence
        this.p1 = vec3.create(); 
        this.p2 = vec3.create(); 
        this.p3 = vec3.create(); 
        this.p4 = vec3.create(); 

        this.height = 1.5;

        this.animation_time = 2; //animation will take 2 seconds 
        this.piece_to_move; 
        this.tileFrom;
        this.tileTo;

        this.translate_vector = vec3.create();
        //times 
        this.delta_t = 0;
        this.last_t = 0;

        this.sent = 0;
 
    }
    /**
     * resert animation
     */
    reset(){
        //todo
    }
    /**
     * start animation
     */
    start(piece,tileFrom,tileTo){
        //todo
        this.canAnimate = true;
        this.active = true;

        vec3.set(this.p1,tileFrom.getDisplayCoords()[0],tileFrom.getDisplayCoords()[1],tileFrom.getDisplayCoords()[2]);
        vec3.set(this.p2,tileFrom.getDisplayCoords()[0],this.height,tileFrom.getDisplayCoords()[2]);
        vec3.set(this.p3,tileTo.getDisplayCoords()[0],this.height,tileTo.getDisplayCoords()[2]);
        vec3.set(this.p4,tileTo.getDisplayCoords()[0],tileTo.getDisplayCoords()[1],tileTo.getDisplayCoords()[2]);
       
        this.piece_to_move = piece; 
        this.tileFrom = tileFrom;
        this.tileTo = tileTo;

        this.sent = 0; 
        this.piece_to_move.setMoving(true);
        //while time
    }
    /**
     * Update time to use on animation
     * @param {time} time 
     */
    update(t){ 
        if(this.last_t == 0)
            this.last_t = t; 
        this.delta_t = t - this.last_t;
        this.last_t = t;
        this.sent = this.delta_t/1000 + this.sent;
        //console.log(this.sent);
    }
    processAnimation(){
        //calculate interpolation 
        let val = this.sent;
        let interpolation =  val/this.animation_time;
        if(this.sent >= 2){
            this.sent = 0;
            this.active = false; //end animation
        }
        //animation is processed using a bezier curve
        bezier(this.translate_vector,this.p1,this.p2,this.p3,this.p4,interpolation);
    }
    display(){
        if(this.active){
            this.scene.pushMatrix();
            //Optionally can look at the orchestrator to stop current animation.
            this.scene.translate(this.translate_vector[0],this.translate_vector[1],this.translate_vector[2]); 
            this.piece_to_move.display();
            this.scene.popMatrix();
        }
    }
}
function bezier(out,a,b,c,d,t){

    let inverseFactor = 1 - t;
    let inverseFactorTimesTwo = inverseFactor * inverseFactor;
    let factorTimes2 = t * t;
    let factor1 = inverseFactorTimesTwo * inverseFactor;
    let factor2 = 3 * t * inverseFactorTimesTwo;
    let factor3 = 3 * factorTimes2 * inverseFactor;
    let factor4 = factorTimes2 * t;

    out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
    out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
    out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

    return out;
}