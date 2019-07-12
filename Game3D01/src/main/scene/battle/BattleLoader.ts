import GameBG from "../../../game/GameBG";
import GameConfig from "../../../GameConfig";
import App from "../../../core/App";
import SysMap from "../../sys/SysMap";

export default class BattleLoader{
    constructor() {}
    
    private _mapId:number;
    public chaterId:number = 1;
    private _configId:number;
    private _index:number = 0;
    public get mapId():number
    {
        return this._mapId;
    }

    public load():void
    {
        this._mapId = this.chaterId * 1000 + this._index;
        let sysMap:SysMap = SysMap.getData(this.chaterId,this._mapId);
        let configArr:string[] = sysMap.stageGroup.split(',');
        let configId:number = Number(configArr[Math.floor(configArr.length * Math.random())]);
        this._configId = configId;
        this._configId = 100104;
        console.log("==============",this._configId);
        var arr: string[] = [
            "h5/mapConfig/"+this._configId+".json",
            "h5/wall/wall.lh",
            "h5/zhalan/hero.lh",
            "h5/selectEnemy/foot/hero.lh",
            "h5/selectEnemy/head/hero.lh",
            "h5/gunEffect/hero.lh",
            "h5/effects/door/hero.lh"
        ];
        arr.push("h5/monsters/10001/monster.lh");
        arr.push("h5/ArrowBlue/monster.lh");
        arr.push("h5/gong/hero.lh");
        arr.push("h5/hero/hero.lh");

        Laya.loader.create(arr, Laya.Handler.create(this, this.onComplete))
    }

    onComplete(): void {
        this._index++;
        let map = Laya.loader.getRes("h5/mapConfig/"+this._configId+".json");
		GameBG.MAP_ROW = map.rowNum;
		GameBG.arr0 = map.arr;
        Laya.Scene.open("test/TestScene.scene");
    }
}