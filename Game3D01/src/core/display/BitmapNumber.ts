export default class BitmapNumber extends Laya.FontClip {
    constructor(skin:string,sheet:string,tScale:number) { 
        super(); 
        this.skin = skin;
        this.sheet = sheet;
        this.scale(tScale,tScale);
        this.anchorX = this.anchorY = 0.5;
    }
}