import IData from "./IData";
import App from "../../core/App";
import SysRoleBase from "../../main/sys/SysRolebase";
import SysRoleUp from "../../main/sys/SysRoleUp";
import Session from "../../main/Session";
import { GoldType } from "./HomeData";
import FlyUpTips from "../../main/FlyUpTips";
import GameEvent from "../../main/GameEvent";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";
import HeroBaseData from "./HeroBaseData";
import Equip from "./Equip";

/**
 * 角色类 有女海盗 有坦克车 等等
 */
export default class HeroData implements IData{
    public heroMap:any = {};
    constructor(){
        
    }

    public setData(data:any):void{
        this.initData(null);
        let str:string = data.heroData;
        let arr = str.split(".");
        for( let v of arr ){
            let hd = new HeroBaseData();
            hd.setString( v );
            this.heroMap[hd.id] = hd;
        }
    }
    
    public saveData(data:any):void{
        let arr:Array<any> = [];
        for( let k in this.heroMap ){
            let hd:HeroBaseData = this.heroMap[k];
            arr.push( hd.getString() );
        }
        data.heroData = arr.join(".");
    }
    
    public initData(data:any):void{
        let arr:SysRoleBase[] = App.tableManager.getTable(SysRoleBase.NAME);
        for( let k of arr ){ 
            let hd = new HeroBaseData();
            hd.id = k.id;
            hd.initData();
            this.heroMap[hd.id] = hd;
        }
    }

    /**
     * @param heroId 得到英雄的等级
     * @param type 
     */
    public getHeroLv( heroId:number , type:HeroLvType ):number{
        let hd:HeroBaseData = this.heroMap[heroId];
        return hd.getLv( type );
    }

    /**
     * 得到某位英雄具体的数值 给战场用的
     * @param heroId 
     */
    public getHeroData( heroId:number ):Equip{
        let e = new Equip();
        let sysRB = SysRoleBase.getSys( heroId );
        e.atk = sysRB.baseAtk + this.getValue( heroId , HeroLvType.ATK ) ;
        e.hp = sysRB.baseHp + this.getValue( heroId , HeroLvType.HP );
        e.dodge = sysRB.baseDodge;
        e.moveSpeed = sysRB.baseMove;
        e.atkSpeed = sysRB.baseSpeed;
        e.crit = sysRB.baseCrit;
        e.critEffect = sysRB.baseCritHurt;
        
        return e;
    }

    public getValue( heroId:number, type:HeroLvType ):number{
        let lv = this.getHeroLv( heroId , type );
        let sys = SysRoleUp.getSysRole( heroId , lv );
        return sys.getValue( type );
    }


    /**
     * @param heroId 
     * @param type 
     */
    public lvUp( heroId:number , type:HeroLvType ):boolean{
        let hd:HeroBaseData = this.heroMap[heroId];
        
        let lv = hd.getLv( type );
        let sys:SysRoleUp = SysRoleUp.getSysRole( heroId , lv );
        let cost = sys.getCost(type);
        let goldType = sys.getCostType(type);
        let res = Session.homeData.changeGold( goldType ,  -cost , GOLD_CHANGE_TYPE.HERO_LV_ABILITY );
        if( res == false ){
            return false;
        }
        let nowLv = lv + 1;
        let nowSys = SysRoleUp.getSysRole( heroId , nowLv );
        if( nowSys == null ){
            //已经到头了 无法升级
            return false;
        }
        hd.setLv( type , nowLv );
        Laya.stage.event( GameEvent.HERO_UPDATE );
        Session.saveData();
        return true;
    }
}

export enum HeroLvType{
    ATK = 0,
    HP = 1
}