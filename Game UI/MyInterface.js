/**
* MyInterface class, creating a GUI interface.
*/
class MyInterface extends CGFinterface {
    /**
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Initializes the interface.
     * @param {CGFapplication} application
     */
    init(application) {
        super.init(application);
        // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
        // add a group of controls (and open/expand by defult

        this.initKeys();
               
        return true;
    }

    /**
     * initKeys
     * 
     */
    initKeys() {
        this.scene.gui = this;
        this.processKeyboard = function () { };
        this.activeKeys = {};
    }

    processKeyDown(event) {
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        return this.activeKeys[keyCode] || false;
    }

    updateInterface() {
        //create dropdown with cameras/view
        this.gui.add(this.scene,'selectedFile',this.scene.fileNames)
           .name('Scene Ambient: ')
           .onChange(val => this.scene.updateFile(val));          
        this.gui.add(this.scene, 'selectedCamera', this.scene.primaryCameraIDs)
            .name('Scene Camera:')
            .onChange(val => this.scene.updateSceneCameras(val));
        //create folder with lights
        var f0 = this.gui.addFolder('Lights');
        var i = 0; //to iterate camera state 
        for (var key in this.scene.graph.lights) { //create switches for each light adde on XML 
            f0.add(this.scene.lightSwitch, i).name(key);
            i++;
        }
        this.gui.add(this.scene,'start')
            .name('Start')
        
    }

    reset(){
        this.gui && this.gui.destroy();
         // init GUI. For more information on the methods, check:
        //  http://workshop.chromeexperiments.com/examples/gui

        this.gui = new dat.GUI();
        // add a group of controls (and open/expand by defult

        this.initKeys();
    }
}