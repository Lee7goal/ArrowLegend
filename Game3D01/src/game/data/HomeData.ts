import IData from "./IData";
import GameEvent from "../../main/GameEvent";
import { TopUI } from "../../main/scene/main/MainUI";
import Game from "../Game";
import { GOLD_CHANGE_TYPE } from "../../UseGoldType";
import App from "../../core/App";
import SysHero from "../../main/sys/SysHero";

export default class HomeData implements IData{
    
    totalEnergy:number;
    curEnergy:number;
    maxEngergy:number;
    lastTime:number;
    chapterId:number;
    mapIndex:number;
    level:number;
    /**
     * 金币
     */
    coins:number;
    /**
     * 钻石
     */
    redDiamond:number = 0;
    blueDiamond:number = 0;
    playerExp:number = 0;

    public setData(data:any):void{
        this.totalEnergy = data.totalEnergy;
        this.maxEngergy = data.maxEngergy;
        this.lastTime = data.lastTime;
        this.curEnergy = data.curEnergy;
        this.chapterId = data.chapterId;
        this.mapIndex = data.mapIndex;
        this.level = data.level;
        this.coins = data.coins;
        this.playerExp = data.playerExp;
        if(this.playerExp == null)
        {
            this.playerExp = 0;
        }
        if( Date.now() >= this.lastTime){
            this.curEnergy = this.totalEnergy;
        } else {
            let deltaTime:number = this.lastTime - Date.now();
            let time:number = Math.floor(deltaTime / 1000);
            let delta:number = Math.ceil(time / TopUI.TOTAL_TIME);
            this.curEnergy = this.totalEnergy - delta;
            console.log("Session剩余的时间", time , this.curEnergy);
        }
    }

    /**
     * 存储数据
     * @param data 
     */
    public saveData(data:any):void{
        data.curEnergy = this.curEnergy;
        data.maxEngergy = this.maxEngergy;
        data.lastTime = this.lastTime;
        data.totalEnergy = this.totalEnergy;
        data.chapterId = this.chapterId;
        data.mapIndex = this.mapIndex;
        data.level = this.level;
        data.coins = this.coins;
        data.playerExp = this.playerExp;
        if( Game.battleLoader.index > this.mapIndex ) {
            data.mapIndex = Game.battleLoader.index;
            console.log("存储最高层数",data.mapIndex);
        }
        data.coins += Game.addCoins;
        this.coins = data.coins;
        data.level = this.level;
    }

    /**
     * 第一次运行初始化数据
     * @param data 
     */
    public initData(data:any):void{
        this.totalEnergy = TopUI.MAX_ENERGY;
        this.maxEngergy = TopUI.MAX_ENERGY;
        this.curEnergy = this.totalEnergy;
        this.lastTime = 0;
        this.chapterId = 1;
        this.mapIndex = 0;
        this.level = 1;
        this.coins = 0;
        this.redDiamond = 0;
        this.playerExp = 0;
        this.blueDiamond = 0;
        this.coins = 9999999;
    }

    /**
     * 
     * @param gold 金币改变数量
     * @param type 操作类型 日志用
     */
    public changeGold( type:GoldType , value:number , useType:GOLD_CHANGE_TYPE = 0 ):boolean{
        let num = this.getGoldByType(type);
        if( ( num  + value )  < 0 ){
            return false;
        }
        this.setGoldByType( type , value );
        Laya.stage.event( GameEvent.GOLD_CHANGE );
        return true;
    }

    public getGoldByType( type:GoldType ):number{
        if( type == GoldType.GOLD ){
            return this.coins;
        }else if( type == GoldType.RED_DIAMONG ){
            return this.redDiamond;
        }else if( type == GoldType.BLUE_DIAMONG ){
            return this.blueDiamond;
        }
    }

    public setGoldByType( type:GoldType , value:number ):void{
        if( type == GoldType.GOLD ){
            this.coins += value;
        }else if( type == GoldType.RED_DIAMONG ){
            this.redDiamond += value;
        }else if( type == GoldType.BLUE_DIAMONG ){
            this.blueDiamond += value;
        }
    }

    /**
     * 君主经验
     * @param exp 
     */
    public addPlayerExp( exp:number ):void{
        this.playerExp += exp;
        while( true ){
            let sys:SysHero = App.tableManager.getDataByNameAndId(SysHero.NAME , this.level );    
            if( this.playerExp >= sys.roleExp  ){
                let nowLv = this.level + 1;
                if( App.tableManager.getDataByNameAndId(SysHero.NAME , this.level ) == null ){
                    //等级已经到头了
                    break;
                }
                this.level = nowLv;
                this.playerExp -= sys.roleExp;
            }else{
                break;
            }
        }
        App.sendEvent( GameEvent.PLAYER_INFO_UPDATE );
    }
}

export enum GoldType{
    GOLD = 0,
    RED_DIAMONG = 1,
    BLUE_DIAMONG = 2
}