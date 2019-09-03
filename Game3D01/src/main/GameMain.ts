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
import GameAlert from "./GameAlert";
import CookieKey from "../gameCookie/CookieKey";

export default class GameMain {
    constructor() {
        ZipLoader.instance.zipFun(Laya.loader.getRes("h5/tables.zip"),new Laya.Handler(this, this.zipFun));
    }

    private zipFun(arr: any[]): void {
        App.init();
        this.initTable(arr);
        Laya.stage.addChild(App.layerManager);

        Game.alert = new GameAlert();
        
        Game.scenneM.showMain();

        Game.battleLoader.preload();

        Game.cookie.getCookie(CookieKey.CURRENT_BATTLE,(res)=>{
            if(res)
            {
                Game.alert.onShow("是否继续未完成的战斗?",new Laya.Handler(this,this.onContinue,[res]),new Laya.Handler(this,this.onCancel));
            }
        });
    }

    private onCancel():void
    {
        Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
    }

    private onContinue(res):void
    {
        Game.battleLoader.load(res);
        console.log("继续战斗",res);
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