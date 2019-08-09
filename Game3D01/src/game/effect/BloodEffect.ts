import BitmapNumber from "../../core/display/BitmapNumber";
import App from "../../core/App";
import GameBG from "../GameBG";

export default class BloodEffect{
    
    constructor() {}

    static add(value:number,sprite:Laya.Sprite):void
    {
        let bitNum:BitmapNumber = App.getFontClip(0.1);
        bitNum.name = "BloodEffect";
        bitNum.value = "-" + value;
        let xx:number = -GameBG.ww * 0.5;
        if(sprite.getChildByName("BloodEffect"))
        {
            xx = GameBG.ww;
        }
        bitNum.x = xx;
        sprite.addChild(bitNum);
        
        Laya.Tween.to(bitNum,{y:-50,scaleX:0.6,scaleY:0.6},200,Laya.Ease.circOut);
        setTimeout(() => {
            bitNum.removeSelf();
        }, 400);
    }
}