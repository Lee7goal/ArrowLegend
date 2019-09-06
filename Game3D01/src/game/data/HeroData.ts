import IData from "./IData";
import App from "../../core/App";
import SysRoleBase from "../../main/sys/SysRolebase";
import SysRoleUp from "../../main/sys/SysRoleUp";
import Session from "../../main/Session";
import { GoldType } from "./HomeData";
import FlyUpTips from "../../main/FlyUpTips";
import GameEvent from "../../main/GameEvent";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";

/**
 * 角色类 有女海盗 有坦克车 等等
 */
export default class HeroData implements IData{
    public heroData:any = {};

    constructor(){
        
    }

    public setData(data:any):void{
        this.heroData = data.heroData;
    }
    
    public saveData(data:any):void{
        data.heroData = this.heroData;
    }
    
    public initData(data:any):void{
        let arr:SysRoleBase[] = App.tableManager.getTable(SysRoleBase.NAME);
        for( let k of arr ){
            this.heroData[k.id] = [1,1];
        }
    }

    public getHeroLv( heroId:number , type:HeroLvType ):number{
        return this.heroData[heroId][type];
    }

    /**
     * @param heroId 
     * @param type 
     */
    public lvUp( heroId:number , type:HeroLvType ):boolean{
        let lv = this.heroData[heroId][type];
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
        this.heroData[heroId][type] = nowLv;
        Laya.stage.event( GameEvent.HERO_UPDATE );
        Session.saveData();
        return true;
    }
}

export enum HeroLvType{
    ATK = 0,
    HP = 1
}