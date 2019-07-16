import GameBG from "../../../game/GameBG";
import GameConfig from "../../../GameConfig";
import App from "../../../core/App";
import SysMap from "../../sys/SysMap";
import SysEnemy from "../../sys/SysEnemy";
import GridType from "../../../game/bg/GridType";

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
        // this._configId = 100301;
        Laya.loader.load("h5/mapConfig/"+this._configId+".json",new Laya.Handler(this,this.onLoadRes));
    }

    private onLoadRes():void{
        let map = Laya.loader.getRes("h5/mapConfig/"+this._configId+".json");
		GameBG.MAP_ROW = map.rowNum;
        GameBG.arr0 = map.arr;
        let bgType = map.bgType ? map.bgType : 1;
        bgType = Math.max(bgType,1);
        GameBG.BG_TYPE = "map_" + bgType;
        
        //公共资源
        var arr: string[] = [
            "h5/mapConfig/"+this._configId+".json",
            "h5/wall/wall.lh",
            "h5/zhalan/hero.lh",
            "h5/selectEnemy/foot/hero.lh",
            "h5/selectEnemy/head/hero.lh",
            "h5/gunEffect/hero.lh",
            "h5/effects/door/hero.lh"
        ];
        //主角
        arr.push("h5/bullets/10001/monster.lh");
        arr.push("h5/gong/hero.lh");
        arr.push("h5/hero/hero.lh");

        //怪
        let k: number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                let type: number = GameBG.arr0[k];
                if (k < GameBG.arr0.length) {
                    if (GridType.isMonster(type))  {
                        let sysEnemy:SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME,type);
                        arr.push("h5/monsters/"+sysEnemy.enemymode+"/monster.lh");
                    }
                }
                k++;
            }
        }

        // let max = 10009;
        // for(var i = 10001; i <= max; i++)
        // {
        //     arr.push("h5/monsters/"+i+"/monster.lh");
        // }
        Laya.loader.create(arr, Laya.Handler.create(this, this.onComplete))
    }

    onComplete(): void {
        this._index++;
        Laya.Scene.open("test/TestScene.scene");
    }
}