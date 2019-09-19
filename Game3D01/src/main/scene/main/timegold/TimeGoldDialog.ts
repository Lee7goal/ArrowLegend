import { ui } from "../../../../ui/layaMaxUI";
import MyEffect from "../../../../core/utils/MyEffect";
import Session from "../../../Session";
import GetItemDialog from "../../../dialog/GetItemDialog";
import { GoldType } from "../../../../game/data/HomeData";
import App from "../../../../core/App";
import { AD_TYPE } from "../../../../ADType";

export default class TimeGoldDialog extends ui.test.TimeGoldUI{
    constructor(){
        super();
        MyEffect.rotation( this.light , 5000 );
        this.LingBtn.on( Laya.Event.CLICK,this,this.normalClick );
        this.AdLingBtn.on( Laya.Event.CLICK,this,this.adClick );
        this.init();
    }

    private adClick():void{
        if ( Session.timeGoldData.gold == 0 ){
            this.close();
            return;
        }
        App.sdkManager.playAdVideo( AD_TYPE.AD_DIAMOND , new Laya.Handler( this,this.adFun ) );
        //this.sdkSession.playAdVideo(SdkSession.TIME_GOLD, new Laya.Handler(this, this.adFun));
    }

    public normalClick():void{
        if ( Session.timeGoldData.gold == 0) {
            this.close();
            return;
        }
        GetItemDialog.open( { type:GoldType.GOLD ,value:Session.timeGoldData.gold } );
        //App.dialog( MyGameInit.NewGetItemDialog , true ,  this.timeGoldSession.gold );
        //this.timeGoldSession.rewardGold(false);
        Session.timeGoldData.rewardGold(false);
        this.init();
    }

    public adFun(stat: number): void {
        if ( Session.timeGoldData.gold == 0 ) {
            this.close();
            return;
        }
        if (stat == 1) {
            GetItemDialog.open( { type:GoldType.GOLD ,value:Session.timeGoldData.gold * 3 } );
            //App.dialog( MyGameInit.NewGetItemDialog , true ,  this.timeGoldSession.gold * 3 );
            Session.timeGoldData.rewardGold(true);
            this.init();
        }
    }

    public init(): void {
        this.goldFc.value = Session.timeGoldData.gold + "";
        this.btn1Fc.value = Session.timeGoldData.gold + "";
        this.btn2Fc.value = Session.timeGoldData.gold * 3 + "";
        //this.sdkSession.initAdBtn(this.dialog.AdLingBtn , SdkSession.TIME_GOLD );
        //this.effectView.ani1.play();
        //RotationEffect.play(this.dialog.light);
    }
}