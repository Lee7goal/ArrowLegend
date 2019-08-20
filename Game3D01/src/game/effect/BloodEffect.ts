import BitmapNumber from "../../core/display/BitmapNumber";
import App from "../../core/App";
import GameBG from "../GameBG";
import Blood from "../Blood";
import ShakeUtils from "../../core/utils/ShakeUtils";
import Game from "../Game";

export default class BloodEffect{
    
    constructor() {}

    static add(value:string,sprite:Blood,isCrit:boolean,skin:string):void
    {
        let bitNum:BitmapNumber = App.getFontClip(0.05,skin);
        if(isCrit)
        {
            Game.shakeBattle();
        }
        bitNum.value = value;
        let xx:number = -GameBG.ww2 + Math.random() * GameBG.ww;
        let yy:number = Math.random() * GameBG.ww;
        sprite.addChild(bitNum);
        bitNum.pos(xx,yy);
        sprite.bloodCount++;
        
        Laya.Tween.to(bitNum,{y:yy-50,scaleX:0.2,scaleY:0.2},200,Laya.Ease.circOut);
        setTimeout(() => {
            bitNum.removeSelf();
        }, 400);
    }
}