import App from "../core/App";
import GameConfig from "../GameConfig";
import MainScene from "./scene/main/MainScene";
import SysChapter from "./sys/SysChapter";
import SysMap from "./sys/SysMap";
import ZipLoader from "../core/utils/ZipLoader";
import SysEnemy from "./sys/SysEnemy";
    export default class GameMain{
    
    constructor(){
        ZipLoader.load("res/tables.zip", new Laya.Handler(this, this.zipFun));
    }

    private zipFun(arr: any[]):void{
        App.init();
        this.initTable(arr);

        Laya.stage.addChild(App.layerManager);
        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    }

    private initTable(arr: any[]):void{
        App.tableManager.register(SysChapter.NAME,SysChapter);
        App.tableManager.register(SysMap.NAME,SysMap);
        App.tableManager.register(SysEnemy.NAME,SysEnemy);

        App.tableManager.onParse(arr);
    }
}