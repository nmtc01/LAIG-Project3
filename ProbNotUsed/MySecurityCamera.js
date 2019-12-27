class MySecurityCamera extends CGFobject {
    constructor(scene,textureRTT) {
        super(scene); 

        this.textureRTT = textureRTT;
        this.time=0; 
        this.rectangle = new MyRectangle(scene,-0.5,0.5,-0.5,0.5);
    
        //shader
        this.shader = new CGFshader(scene.gl,"shaders/securitycamera.vert","shaders/securitycamera.frag"); 
       
        this.shader.setUniformsValues({ uSampler: 1 });
    }

    display() {
        this.shader.setUniformsValues({ timeFactor: this.time});
        //update texture
        this.material =new CGFappearance(this.scene);
        this.material.setAmbient(1,1,1,1); 
        this.material.setTexture(this.textureRTT);
        this.material.apply();

        this.scene.setActiveShader(this.shader);      
        this.scene.pushMatrix();  
        this.textureRTT.bind(0);
        this.rectangle.display();     
        this.textureRTT.unbind(0);    
        this.scene.popMatrix();
        this.scene.setActiveShader(this.scene.defaultShader);
    }

    update(t){
        this.time = t/500 % 1000; //todo check if time is correct later 
    }
}