import Sprite = Laya.Sprite;
export default class LayerManager extends Sprite {
    sceneLayer: Sprite = new Sprite();
    panelLayer: Sprite = new Sprite();
    faceLayer: Sprite = new Sprite();
    alertLayer: Sprite = new Sprite();
    guideLayer: Sprite = new Sprite();

    constructor() { 
        super();
        this.addChild(this.sceneLayer);
        this.addChild(this.panelLayer);
        this.addChild(this.faceLayer);
        this.addChild(this.alertLayer);
        this.addChild(this.guideLayer);
    }
    
}