import BitmapNumber from "../../core/display/BitmapNumber";
import App from "../../core/App";

export default class BloodEffect{
    
    constructor() {}

    static add(value:number,sprite:Laya.Sprite):void
    {
        let bitNum:BitmapNumber = App.getFontClip(0.1);
        bitNum.value = "-" + value;
        sprite.addChild(bitNum);
        Laya.Tween.to(bitNum,{y:-50,scaleX:0.6,scaleY:0.6},200,Laya.Ease.circOut,new Laya.Handler(this,()=>{
            bitNum.removeSelf();
        }));
    }
}