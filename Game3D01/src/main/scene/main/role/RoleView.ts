import { ui } from "../../../../ui/layaMaxUI";
import Session from "../../../Session";
import SysRoleUp from "../../../sys/SysRoleUp";
import { HeroLvType } from "../../../../game/data/HeroData";
export default class RoleView extends ui.test.jueseUI {
    public nowRoleId:number = 1;
    
    constructor() { 
        super();
        this.shengmingniu.clickHandler = new Laya.Handler( this,this.hpFun );
        this.gongjiniu.clickHandler = new Laya.Handler( this,this.atkFun );
        this.updateAll();
        this.on(Laya.Event.DISPLAY,this,this.disFun);
    }

    public disFun():void {
        this.updateAll();
    }

    public hpFun():void{
        
    }

    public atkFun():void{
        
    }

    public updateAll():void{
        this.setOne( this.box1 , HeroLvType.HP , this.shengmingniu , this.shengmingjia ,this.xueshu , this.tiao );
        this.setOne( this.box2 , HeroLvType.ATK , this.gongjiniu ,this.gongjijia , this.gongshu , this.tiao2 );
    }

    public setOne( box:Laya.Box , type:HeroLvType , btn:Laya.Button , fc:Laya.FontClip  ,fc2:Laya.FontClip , tiao:Laya.Image ):void{
        let lv = Session.heroData.getHeroLv( this.nowRoleId , type );
        let sys = SysRoleUp.getSysRole( this.nowRoleId , lv );
        fc.value = "+" + sys.getValue( type );
        let cost = sys.getCost( type );
        let can = Session.homeData.diamond >= cost;
        btn.visible = can;
        box.visible = !can;
        if( box.visible ){
            fc2.value = Session.homeData.diamond + "/" + cost;
            let v = Session.homeData.diamond / cost;
            tiao.scrollRect = new Laya.Rectangle( 0 , 0,  tiao.width * v , tiao.height );
            tiao.visible = (v != 0);
        }
    }
}