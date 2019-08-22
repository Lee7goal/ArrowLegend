import ZipLoader from "../core/utils/ZipLoader";
import App from "../core/App";
import Game from "../game/Game";
import SysChapter from "./sys/SysChapter";
import SysMap from "./sys/SysMap";
import SysEnemy from "./sys/SysEnemy";
import SysBullet from "./sys/SysBullet";
import SysLevel from "./sys/SysLevel";
import SysSkill from "./sys/SysSkill";
import SysBuff from "./sys/SysBuff";
import SysNpc from "./sys/SysNpc";

export default class GameMain {
    constructor() {
        // ZipLoader.load("h5/tables.zip", new Laya.Handler(this, this.zipFun));
        ZipLoader.instance.zipFun(Laya.loader.getRes("h5/tables.zip"),new Laya.Handler(this, this.zipFun));
    }

    private zipFun(arr: any[]): void {
        App.init();
        this.initTable(arr);
        Laya.stage.addChild(App.layerManager);
        Game.scenneM.showMain();

        Game.battleLoader.loadPubRes();
    }

    private initTable(arr: any[]): void {
        App.tableManager.register(SysChapter.NAME, SysChapter);
        App.tableManager.register(SysMap.NAME, SysMap);
        App.tableManager.register(SysEnemy.NAME, SysEnemy);
        App.tableManager.register(SysBullet.NAME, SysBullet);
        App.tableManager.register(SysLevel.NAME, SysLevel);
        App.tableManager.register(SysSkill.NAME, SysSkill);
        App.tableManager.register(SysBuff.NAME, SysBuff);
        App.tableManager.register(SysNpc.NAME, SysNpc);

        App.tableManager.onParse(arr);
    }
}