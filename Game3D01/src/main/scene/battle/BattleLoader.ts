import GameBG from "../../../game/GameBG";
import GameConfig from "../../../GameConfig";

export default class BattleLoader{
    constructor() {}
    
    private _mapId:number;
    public get mapId():number
    {
        return this._mapId;
    }

    public load(mapId:number):void
    {
        this._mapId = mapId;
        var arr: string[] = [
            "h5/mapConfig/"+this._mapId+".json",
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
        let map = Laya.loader.getRes("h5/mapConfig/"+this._mapId+".json");
		GameBG.MAP_ROW = map.rowNum;
		GameBG.arr0 = map.arr;
        Laya.Scene.open(GameConfig.battleScene);
    }
}