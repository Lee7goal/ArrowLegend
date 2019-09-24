import { ui } from "../../ui/layaMaxUI";
import RotationEffect from "../../core/utils/RotationEffect";
import App from "../../core/App";
import { AD_TYPE } from "../../ADType";
import Session from "../Session";
import { GoldType } from "../../game/data/HomeData";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";
import GetItemDialog from "./GetItemDialog";

export default class AdDiamond extends ui.test.juese_tishiUI{
    constructor(){
        super();
        RotationEffect.play( this.light );
        this.rebornBtn.clickHandler = new Laya.Handler(this,this.clickFun);
    }

    private clickFun():void{
        App.sdkManager.playAdVideo( AD_TYPE.AD_DIAMOND , new Laya.Handler(this,this.adFun) );
    }

    public goldType:number = 0;
    public setGoldType(a:GoldType):void{
        this.goldType = a;
        this.v1.vs.selectedIndex = a;
    }

    public addNum:number = 0;

    private adFun():void{
        let v:number = Math.ceil( Math.random() * 4 )  + 6;
        this.addNum = v;
        //v = 500;
        Session.homeData.changeGold( this.goldType , v , GOLD_CHANGE_TYPE.AD_DIAMOND );
        let g = new GetItemDialog();
        
        // let arr = [];
        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        //  arr.push( {type:GoldType.GOLD , value:v }  );

        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.GOLD , value:v }  );

        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.GOLD , value:v }  );

        // arr.push( {type:GoldType.BLUE_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.RED_DIAMONG , value:v }  );
        // arr.push( {type:GoldType.GOLD , value:v }  );
        
        g.setData( {type:this.goldType , value:v } );
        //g.setData(arr);

        g.popup(true);

        g.once( Laya.Event.UNDISPLAY ,this, this.undisFun );
    }

    private undisFun():void{
        this.event( AdDiamond.CHANGE_GOLD_EVENT , [this.goldType , this.addNum] );
    }

    public static CHANGE_GOLD_EVENT:string = "CHANGE_GOLD_EVENT";
}