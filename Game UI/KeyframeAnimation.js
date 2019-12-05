/**
 * KeyFrameAnimation
 * @constructor
 * @param scene - Reference to MyScene object
 */
class KeyFrameAnimaton extends Animation {
    /**
     * @constructor 
     * @param {int} id
     * @param {array} keyframe - array of arrays storing animaton keyframe + start instant 
     */
    constructor(id, keyframes, scene) {
      
        super(); 
       this.id= id; 
       this.scene=scene; 
            
        this.sent = 0;
        this.segment = 0;
        this.progress_percentage = 0;
        this.last_instant = 0;

        //times 
        this.delta_t = 0;
        this.last_t = 0;

        //trans matrixes 
        this.m = mat4.create();

        //translate -> rotate -> scale 
        this.keyframes = [
            [
                [0, 0, 0],
                [0, 0, 0],
                [1, 1, 1],
                0
            ]
        ]; //keyframe 0 instant 

        for (let i = 0; i < keyframes.length; i++) {
            this.keyframes.push(keyframes[i]);
        }

        this.instant = this.keyframes[0][3]; //first keyframe passed with instant stored in 3rd index

        this.segment = 1; //keyframe using numeration

        //make segment time array 
        this.t = [this.instant];
        for (let i = 1; i < this.keyframes.length; i++) {
            this.t.push(this.keyframes[i][3] - this.keyframes[i - 1][3]);
        }
        //NOTE first keyfram is set with sample values 
    }

    update(t) {
        if(this.last_t == 0)
            this.last_t = t; 
        this.delta_t = t - this.last_t;
        this.last_t = t;
        this.sent = this.delta_t/1000 + this.sent;
    }

    apply() {
        this.scene.multMatrix(this.m);
    }

    /**
    * create ma
    */
    process_animation() {
        //stop excecution 
        if (this.segment > this.keyframes.length - 1) {
            return this.m;
        }
    
        //check if should change to another keyframe    
        if (this.sent > this.t[this.segment]) { 
            if (this.last_instant == 0) {
                this.sent = this.t[this.segment];
                this.last_instant = 1;
            }
            else {
                if (this.last_instant == 1) //not last instant of keyframe anymore
                    this.last_instant = 0;
                for (let i = this.segment; i < this.t.length-1; i++) {
                    this.sent -= this.t[i]; // reset sent
                    this.segment = i+1;
                    if (this.sent < this.t[i+1]) {
                        break;
                    }
                }
            }
            if (this.segment > this.keyframes.length - 1) {
                return this.m;
            }
        }

        this.progress_percentage = this.sent / this.t[this.segment]; //percentage
        if(this.sent == 0)
            this.progress_percentage=0;

        //TRANSLATE
        //calculate translation vector
        let T = [
            (this.keyframes[this.segment][0][0] - this.keyframes[this.segment - 1][0][0]) * this.progress_percentage,
            (this.keyframes[this.segment][0][1] - this.keyframes[this.segment - 1][0][1]) * this.progress_percentage,
            (this.keyframes[this.segment][0][2] - this.keyframes[this.segment - 1][0][2]) * this.progress_percentage
        ];
        //sum veector to intial pos 
        T[0] += this.keyframes[this.segment - 1][0][0];
        T[1] += this.keyframes[this.segment - 1][0][1];
        T[2] += this.keyframes[this.segment - 1][0][2];

        let translate_matrix = mat4.create();
        translate_matrix = mat4.translate(translate_matrix, translate_matrix, T);

        //ROTATE 
        let R = [
            (this.keyframes[this.segment][1][0] - this.keyframes[this.segment - 1][1][0]) * this.progress_percentage,
            (this.keyframes[this.segment][1][1] - this.keyframes[this.segment - 1][1][1]) * this.progress_percentage,
            (this.keyframes[this.segment][1][2] - this.keyframes[this.segment - 1][1][2]) * this.progress_percentage
        ];

        R[0] += this.keyframes[this.segment - 1][1][0];
        R[1] += this.keyframes[this.segment - 1][1][1];
        R[2] += this.keyframes[this.segment - 1][1][2];

        let rotation_matrix = mat4.create();
        rotation_matrix = mat4.rotate(rotation_matrix, rotation_matrix, R[0], [1, 0, 0]);
        rotation_matrix = mat4.rotate(rotation_matrix, rotation_matrix, R[1], [0, 1, 0]);
        rotation_matrix = mat4.rotate(rotation_matrix, rotation_matrix, R[2], [0, 0, 1]);

        //SCALE 
        let initialKeyframeCoords = [3];
        let finalKeyframeCoords = [3];

        initialKeyframeCoords[0] = this.keyframes[this.segment - 1][2][0];
        initialKeyframeCoords[1] = this.keyframes[this.segment - 1][2][1];
        initialKeyframeCoords[2] = this.keyframes[this.segment - 1][2][2];

        finalKeyframeCoords[0] = this.keyframes[this.segment][2][0];
        finalKeyframeCoords[1] = this.keyframes[this.segment][2][1];
        finalKeyframeCoords[2] = this.keyframes[this.segment][2][2];

        let rx = Math.pow(finalKeyframeCoords[0] / initialKeyframeCoords[0], 1 / this.t[this.segment]);
        let ry = Math.pow(finalKeyframeCoords[1] / initialKeyframeCoords[1], 1 / this.t[this.segment]);
        let rz = Math.pow(finalKeyframeCoords[2] / initialKeyframeCoords[2], 1 / this.t[this.segment]);

        let S = [
            this.keyframes[this.segment - 1][2][0] * Math.pow(rx, this.sent),
            this.keyframes[this.segment - 1][2][1] * Math.pow(ry, this.sent),
            this.keyframes[this.segment - 1][2][2] * Math.pow(rz, this.sent)
        ];

        let scale_matrix = mat4.create();
        scale_matrix = mat4.scale(scale_matrix, scale_matrix, S);

        //multiply all matrixes
        let aux_mat = mat4.create();
        aux_mat = mat4.multiply(aux_mat, aux_mat, scale_matrix);
        aux_mat = mat4.multiply(aux_mat, aux_mat, rotation_matrix);
        aux_mat = mat4.multiply(aux_mat, aux_mat, translate_matrix);
        //calculate matriz SRT 
        let ma = mat4.create();
        ma = mat4.multiply(ma, ma, aux_mat);

        this.m = ma;

        return this.m;

    }

}