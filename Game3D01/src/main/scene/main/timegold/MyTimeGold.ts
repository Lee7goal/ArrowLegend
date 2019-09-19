import { ui } from "../../../../ui/layaMaxUI";
import Session from "../../../Session";

export default class MyTimeGold{
    private disView:ui.test.TimeLogoUI = null;
   
    constructor(){
        
    }

    public setUI( a:ui.test.TimeLogoUI):void{
        this.disView = a;
        this.disView.on(Laya.Event.UNDISPLAY , this, this.undisFun );
        this.disView.on(Laya.Event.DISPLAY,this,this.disFun );
        this.disFun();
    }

    public disFun():void{
        Laya.timer.frameLoop( 1,this,this.loopFun );
    }

    public undisFun():void{
        Laya.timer.clear( this,this.loopFun );
    }

    public loopFun():void{
        let arr = Session.timeGoldData.getNowTime();
        this.disView.timeFc.value = this.getString( arr[0] ) + ":" + this.getString( arr[1] );
        this.disView.goldFc.value = Session.timeGoldData.gold + "";
        let ms = arr[2] * 1000 + arr[3];
        let endA = 360 * ( (60000 - ms) / 60000 ) - 90;
        let a = this.disView.shanbox;
        a.graphics.clear();
        a.graphics.drawPie(a.width/2 ,a.height/2 - 2 , 35,-90 , endA , "#ffec1d" );
    }

    public getString( value:number ):string{
        return value < 10 ?  0 + "" + value : value + "";
    }
}