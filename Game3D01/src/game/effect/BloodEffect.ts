import BitmapNumber from "../../core/display/BitmapNumber";
import App from "../../core/App";
import GameBG from "../GameBG";
import Blood from "../Blood";
import ShakeUtils from "../../core/utils/ShakeUtils";
import Game from "../Game";

export default class BloodEffect{
    
    constructor() {}

    static add(value:number,sprite:Blood,isCrit:boolean):void
    {
        let bitNum:BitmapNumber = App.getFontClip(0.1);
        if(isCrit)
        {
            ShakeUtils.execute(Game.scenneM.battle, 75, 4);
        }
        bitNum.value = "-" + value;
        let xx:number = -GameBG.ww * 0.5;
        bitNum.x = sprite.bloodCount * GameBG.ww;
        sprite.addChild(bitNum);
        sprite.bloodCount++;
        
        Laya.Tween.to(bitNum,{y:-50,scaleX:0.6,scaleY:0.6},200,Laya.Ease.circOut);
        setTimeout(() => {
            bitNum.removeSelf();
            sprite.bloodCount--;
        }, 400);
    }
}