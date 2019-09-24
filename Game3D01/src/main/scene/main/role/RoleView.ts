import { ui } from "../../../../ui/layaMaxUI";
import Session from "../../../Session";
import SysRoleUp from "../../../sys/SysRoleUp";
import { HeroLvType } from "../../../../game/data/HeroData";
import SysRoleBase from "../../../sys/SysRolebase";
import App from "../../../../core/App";
import AdDiamond from "../../../dialog/AdDiamond";
import AutoEvent from "../../../../core/utils/AutoEvent";
import GameEvent from "../../../GameEvent";
import SysSkill from "../../../sys/SysSkill";
import { GoldType } from "../../../../game/data/HomeData";
import FlyUpTips from "../../../FlyUpTips";
import WorldCell from "../world/WorldCell";
import FlyEffect from "../../../../game/effect/FlyEffect";
export default class RoleView extends ui.test.jueseUI {
    public nowRoleId:number = 1;
    public autoEvent:AutoEvent = new AutoEvent();

    constructor() { 
        super();
        this.autoEvent.setSprite( this );
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.hpFun );
        this.gongjiniu.clickHandler = new Laya.Handler( this,this.atkFun );
        this.updateAll();
        this.on(Laya.Event.DISPLAY,this,this.disFun);
        
        this.jia.clickHandler = new Laya.Handler( this,this.jiaFun , [GoldType.RED_DIAMONG , this.redImg , this.xueshu ]  );
        this.jia2.clickHandler = new Laya.Handler( this,this.jiaFun , [GoldType.BLUE_DIAMONG , this.blueImg , this.gongshu ] );

        this.autoEvent.onEvent( GameEvent.GOLD_CHANGE , this,this.goldChangeFun );
        this.autoEvent.onEvent( GameEvent.HERO_UPDATE , this,this.heroFun );
        Laya.stage.on( GameEvent.HERO_UPDATE , this, this.heroLvUpFun );
        //let sss = Session.heroData.getHeroData(1);
        //console.log( sss );
        this.lvEff.visible = false;

        
        this.a1.ani1.interval = this.a2.ani1.interval = 1000/60;
        //this.a2.ani1.gotoAndStop( 60 );
        this.a1.ani1.stop();
        this.a2.ani1.stop();
        
        this.a1.visible = this.a2.visible = false;

        //Laya.stage.on( GameEvent.APP_ENERGY ,  this, this.reducePowerFun );
        //Laya.stage.on( Laya.Event.CLICK ,this,this.reducePowerFun , [1] );
        Laya.timer.loop( 4000 , this,this.ani1tFun );
    }

    private ani1tFun():void{
        this.a1.visible = true;
        this.a1.ani1.play( 0 , false );
        Laya.timer.once( 1000 , this,this.ani2tFun );
    }

    private ani2tFun():void{
        this.a2.visible = true;
        this.a2.ani1.play( 0 , false );
    }

    public heroLvUpFun():void{
        this.lvEff.visible = true;
        this.lvEff.ani1.gotoAndStop(0);
        this.lvEff.ani1.interval = 1000/60;
        this.lvEff.ani1.play( 0,false );
        this.lvEff.ani1.on( Laya.Event.COMPLETE ,this,this.efFun );
    }

    public efFun():void{
        this.lvEff.visible = false;
    }

    public heroFun():void{
        this.updateAll();
    }

    public goldChangeFun():void{
        this.updateAll();
    }

    public oldNum:number = 0;
    /**
     * 点击加号 获得宝石
     * @param goldType 
     */
    public jiaFun( goldType:GoldType , flyTarget:Laya.Image , fc:Laya.FontClip ):void{
        let d = new AdDiamond();
        d.setGoldType( goldType );
        d.popup();
        this.oldNum = Session.homeData.getGoldByType( goldType );
        d.on( AdDiamond.CHANGE_GOLD_EVENT , this, this.flyGoldFun , [flyTarget , fc] );
    }

    public flyGoldFun(  flyTarget:Laya.Image , fc:Laya.FontClip ,y:GoldType , v:number ):void{
        let fly = new FlyEffect();
        fly.flyNum = v;
        fly.flySkin = flyTarget.skin;
        fly.flyTargetHandler = new Laya.Handler( this,this.flyFun );
        fly.flyFromP( Laya.stage.width/2 , Laya.stage.height/2 , flyTarget , v , this.oldNum , fc );
    }

    public flyFun( fc:Laya.FontClip , now:number ) :void{
        fc.value = now + "/" + 0;
    }

    public disFun():void {
        this.updateAll();
    }

    public hpFun():void{
        let res = Session.heroData.lvUp( this.nowRoleId , HeroLvType.HP );
        this.tip(res);
    }

    public atkFun():void{
        let res = Session.heroData.lvUp( this.nowRoleId , HeroLvType.ATK );
        this.tip(res);
    }

    public tip(res:number):void{
        if( res == 2 ){
            FlyUpTips.setTips("钻石不够");
        }else if( res == 3 ){
            FlyUpTips.setTips("升级到头了");
        }else if( res == 4 ){
            FlyUpTips.setTips("金币不够");
        }else if( res == 5 ){
            FlyUpTips.setTips("升级到头了");
        }
    }

    public updateAll():void{
        this.setOne( this.box1 , HeroLvType.HP , this.shengmingniu , this.shengmingjia ,this.xueshu , this.tiao , this.shengmingshu ,this.hpLv , this.hpGold , this.hpAddFc , this.vs1 , this.vs11 );
        this.setOne( this.box2 , HeroLvType.ATK , this.gongjiniu ,this.gongjijia , this.gongshu , this.tiao2 , this.gongjishu ,this.atkLv  ,this.atkGold , this.atkAddFc ,this.vs2 ,this.vs12);
        let sys = SysRoleBase.getSys( this.nowRoleId );
        let sysSkill:SysSkill = App.tableManager.getDataByNameAndId( SysSkill.NAME,sys.baseSkill );
        this.skillLabel.text = sysSkill.skillInfo;
        this.jinengming.text = sysSkill.skillName;
        this.jinengtubiao.skin = null;
        this.jinengtubiao.skin = "icons/skill/" + sysSkill.id + ".png";
    }

    public setOne( box:Laya.Box , type:HeroLvType , btn:Laya.Button , fc:Laya.FontClip  ,fc2:Laya.FontClip , tiao:Laya.Image , allFc:Laya.FontClip , lvFc:Laya.FontClip ,goldFc:Laya.Text ,addFc:Laya.FontClip , vs:Laya.ViewStack , vs2:Laya.ViewStack ):void{
        
        let lv = Session.heroData.getHeroLv( this.nowRoleId , type );
        let sysRB = SysRoleBase.getSys( this.nowRoleId );
        
        

        let sys = SysRoleUp.getSysRole( this.nowRoleId , lv );
        //显示这个等级加多少属性
        // if( type == HeroLvType.ATK ){
        //     fc.value = "+" + SysRoleUp.getAddAtk( this.nowRoleId , lv ); //sys.getValue( type );
        // }else if( type == HeroLvType.HP ){
        //     fc.value = "+" + SysRoleUp.getAddHp( this.nowRoleId , lv ); //sys.getValue( type );
        // }
        fc.value = "+" + sys.getValue( type );
        
        let cost = sys.getCost( type );
        let costType = sys.getCostType(type);
        let have = Session.homeData.getGoldByType( costType );
        let can = (have >= cost);
        
        //btn.visible = can;
        //box.visible = !can;
        
        if( can ){
            vs2.selectedIndex = 1;
        }else{
            vs2.selectedIndex = 0;
        }
        
        let v = sysRB.getValue( type );
        
        //这里显示最终加的
        allFc.value = v + "";// sys. getValue( type )

        addFc.value = "+" + SysRoleUp.getAddValue( this.nowRoleId , lv , type );

        addFc.x = allFc.x + allFc.value.length * 23 + 10;

        addFc.visible = (lv != 0);

        lvFc.value = lv + "";
        
        if( vs2.selectedIndex == 1 ){
            return;
        }
        goldFc.text = sys.costGold + "";
        fc2.value = ( have + "/" + cost);
        let vv = (have / cost);
        tiao.scrollRect = new Laya.Rectangle( 0 , 0,  tiao.width * vv , tiao.height );
        tiao.visible = (vv != 0);

        if( lv >= sysRB.roleLimt ){
            //超过限制了  只显示max
            vs.selectedIndex = 1;
            vs2.visible = false;
            return;
        }
        vs2.visible = true;
        // btn.visible = true;
        // box.visible = true;
        vs.selectedIndex = 0;
    }
}