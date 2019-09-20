import { ui } from "../../../../ui/layaMaxUI";
import TalentCell2 from "./TalentCell2";
import Session from "../../../Session";
import MyEffect from "../../../../core/utils/MyEffect";
import App from "../../../../core/App";
import SysTalentInfo from "../../../sys/SysTalentInfo";
import SysTalent from "../../../sys/SysTalent";

export default class SelectTalent extends ui.test.TalentViewUI{
    public arr:Array<ui.test.TalentZhuanUI> = [];
    
    constructor(){
        super();
        this.height = Laya.stage.height;
        this.arr.push( this.b0,this.b1,this.b2,this.b3,this.b4,this.b5 );
        for(let k of this.arr  ){
            k.wenhao.box1.visible = false;//不显示内容
            k.wenhao.select.visible = false;
            k.back.select.visible = false;
            k.back.box2.visible = false;
            k.on(Laya.Event.CLICK,this,this.clickFun,[k]);
        }
        this.nameImg.alpha = 0;
        this.clickClose.alpha = 0;
        this.box1.visible = false;
    }

    private clickFun( e:ui.test.TalentZhuanUI ):void{
        let now = Math.floor( Math.random() * 9 ) + 1;
        let tid:number = now;
        let obj = Session.talentData.getImgData( now );
        
        e.back.logo1.skin = obj.logo;
        e.back.bg1.skin = obj.bg;
        e.back.txtImg.skin = obj.font;
        let lv = Session.talentData.getLv( now );
        let oldLv = lv;
        let newLv = lv + 1;
        e.back.lv.value = (lv + 1 ) + "";
        
        Session.talentData.lvUp( now );

        e.back.select.visible = true;
        this.mouseEnabled = false;
        let t = new Laya.Tween();
        t.to( e , {scaleX:-1,update:new Laya.Handler(this,this.upFun,[e])} , 600  );
        //this.timer.once( 2000,this,this.timerFun );
        
        for( let a of this.arr ){
            a.mouseEnabled = false;
            if( a != e ) {
                a.back.visible = false;
                MyEffect.hide( a );
            }
        }

        let ty = this.arr[1].y - 100;
        let tx = this.arr[1].x;
        let tw = new Laya.Tween();
        tw.to( e, {x:tx,y:ty} , 800 , Laya.Ease.strongOut );

        this.nameImg.skin = e.back.txtImg.skin;
        this.nameImg.y = ty - 200;
        this.l1.visible = false;
        MyEffect.show( this.nameImg );
        this.clickClose.alpha = 1;
        MyEffect.flash( this.clickClose );

        this.timer.once( 1000,this,this.timeFun );

        let sysInfo:SysTalentInfo = App.tableManager.getDataByNameAndId( SysTalentInfo.NAME , tid );
        this.l11.text = sysInfo.talentInfo;

        let oldSys:SysTalent = App.tableManager.getDataByNameAndId( SysTalent.NAME , oldLv );
        let newSys:SysTalent = App.tableManager.getDataByNameAndId( SysTalent.NAME , newLv );
        if( oldSys == null ){
            this.f1.value = "+0%";
        }else{
            let oldValue = oldSys[sysInfo.idName];
            this.f1.value = "+" + oldValue + "%";
        }
        let newValue = newSys[sysInfo.idName];
        this.f2.value = "+" + newValue + "%";  
        Laya.timer.once( 500 ,this,this.boxFun );
    }

    private boxFun():void{
        this.box1.visible = true;
        let t3 = new Laya.Tween();
        t3.from( this.box1,{ scaleX:0 ,scaleY:0 } , 200 , Laya.Ease.backInOut );
    }

    private timeFun():void{
        Laya.stage.once( Laya.Event.CLICK,this,this.clickFun2 );
    }

    private clickFun2():void{
        this.close();
    }

    private upFun(e:ui.test.TalentZhuanUI):void{
        if( e.scaleX <= 0 ){
            e.wenhao.visible = false;    
        }
    }
}