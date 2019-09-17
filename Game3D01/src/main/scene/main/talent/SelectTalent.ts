import { ui } from "../../../../ui/layaMaxUI";
import TalentCell2 from "./TalentCell2";
import Session from "../../../Session";
import MyEffect from "../../../../core/utils/MyEffect";

export default class SelectTalent extends ui.test.TalentViewUI{
    public arr:Array<ui.test.TalentZhuanUI> = [];
    
    constructor(){
        super();
        this.arr.push( this.b0,this.b1,this.b2,this.b3,this.b4,this.b5 );
        for(let k of this.arr  ){
            k.wenhao.box1.visible = false;//不显示内容
            k.wenhao.select.visible = false;
            k.back.select.visible = false;
            k.back.box2.visible = false;
            k.on(Laya.Event.CLICK,this,this.clickFun,[k]);
        }
    }

    private clickFun( e:ui.test.TalentZhuanUI ):void{
        let now = Math.floor( Math.random() * 9 ) + 1;
        let obj = Session.talentData.getImgData( now );
        
        e.back.logo1.skin = obj.logo;
        e.back.bg1.skin = obj.bg;
        e.back.txtImg.skin = obj.font;
        let lv = Session.talentData.getLv( now );
        e.back.lv.value = (lv + 1 ) + "";
        
        Session.talentData.lvUp( now );

        e.back.select.visible = true;
        this.mouseEnabled = false;
        let t = new Laya.Tween();
        t.to( e , {scaleX:-1,update:new Laya.Handler(this,this.upFun,[e])} , 600  );
        //this.timer.once( 2000,this,this.timerFun );
        
        for( let a of this.arr ){
            if( a != e ) {
                a.back.visible = false;
                this.undisFun( a );
            }
        }

        let ty = this.arr[1].y - 100;
        let tx = this.arr[1].x;
        let tw = new Laya.Tween();
        tw.to( e, {x:tx,y:ty} , 500 );MyEffect
    }

    private undisFun( e:Laya.Sprite ):void{
        
        let t = new Laya.Tween();
        t.to( e, {alpha:0} ,  500 );
    }

    private timerFun():void{
        this.close();
    }

    private upFun(e:ui.test.TalentZhuanUI):void{
        if( e.scaleX <= 0 ){
            e.wenhao.visible = false;    
        }
    }
}