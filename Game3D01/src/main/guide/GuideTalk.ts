import { ui } from "../../ui/layaMaxUI";
import GameEvent from "../GameEvent";
    export default class GuideTalk extends ui.game.newGuide2UI {
    
    private contents:string[];
    constructor() {
         super();
         
        //  this.on(Laya.Event.DISPLAY,this,this.onDis); 
         this.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void
    {
        this.removeSelf();
    }

    private _guideId:number;
    setContent(str:string,guideId:number):void
    {
        this._guideId = guideId;
        this.contents = str.split("");
        this.txt.text = "";
        Laya.timer.loop(80,this,this.onLoop);
    }

    private onLoop():void
    {
        if(this.contents.length > 0)
        {
            let char:string = this.contents.shift();
            this.txt.text += char;
        }
        else
        {
            Laya.timer.clear(this,this.onLoop);
        }
    }

    removeSelf():Laya.Node
    {
        Laya.stage.event(GameEvent.SHOW_ACTION_RECT,this._guideId );
        return super.removeSelf();
    }
}