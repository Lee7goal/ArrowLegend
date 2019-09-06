import IData from "./IData";
import GameEvent from "../../main/GameEvent";
import { TopUI } from "../../main/scene/main/MainUI";

export default class HomeData implements IData{
    
    totalEnergy:number;
    curEnergy:number;
    maxEngergy:number;
    lastTime:number;
    chapterId:number;
    mapIndex:number;
    level:number;
    coins:number;

    public setData(data:any):void{

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
    }

    /**
     * 
     * @param gold 金币改变数量
     * @param type 操作类型 日志用
     */
    public changeGold( gold:number , type:number = 0 ):boolean{
        if( (this.coins + gold)  < 0 ){
            return false;
        }
        this.coins += gold;
        Laya.stage.event( GameEvent.GOLD_CHANGE );
    }


}