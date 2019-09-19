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
import SysRoleBase from "./sys/SysRolebase";
import SysRoleUp from "./sys/SysRoleUp";
import SysHero from "./sys/SysHero";
import SysTalentCost from "./sys/SysTalentCost";
import SysTalent from "./sys/SysTalent";
import SysTalentInfo from "./sys/SysTalentInfo";
import GameEvent from "./GameEvent";
import Session from "./Session";
import TimeGoldDialog from "./scene/main/timegold/TimeGoldDialog";
import RankDialog from "./scene/main/rank/RankDialog";

export default class GameMain {
    constructor() {
        //ZipLoader.instance.zipFun(Laya.loader.getRes("h5/tables.zip"), new Laya.Handler(this, this.zipFun));
        this.zipFun();
    }

    private zipFun(): void {
        Game.alert = new GameAlert();
        Game.scenneM.showMain();
        Game.battleLoader.preload();
        if(Session.homeData.isGuide){
            Game.battleLoader.load();
        }else{
            Game.cookie.getCookie(CookieKey.CURRENT_BATTLE, (res) => {
                if (res)  {
                    Game.alert.onShow("是否继续未完成的战斗?", new Laya.Handler(this, this.onContinue, [res]), new Laya.Handler(this, this.onCancel));
                }
            });
        }
    }

    private onCancel(): void  {
        Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
    }

    private onContinue(res): void  {
        Game.battleLoader.load(res);
        console.log("继续战斗", res);
    }

    public static initTable(arr: any[]): void {
        App.tableManager.register(SysChapter.NAME, SysChapter);
        App.tableManager.register(SysMap.NAME, SysMap);
        App.tableManager.register(SysEnemy.NAME, SysEnemy);
        App.tableManager.register(SysBullet.NAME, SysBullet);
        App.tableManager.register(SysLevel.NAME, SysLevel);
        App.tableManager.register(SysSkill.NAME, SysSkill);
        App.tableManager.register(SysBuff.NAME, SysBuff);
        App.tableManager.register(SysNpc.NAME, SysNpc);
        App.tableManager.register(SysRoleBase.NAME , SysRoleBase );
        
        App.tableManager.register(SysRoleUp.NAME , SysRoleUp);
        App.tableManager.register(SysHero.NAME , SysHero );
        App.tableManager.register(SysTalentCost.NAME , SysTalentCost);
        App.tableManager.register(SysTalentInfo.NAME , SysTalentInfo );
        App.tableManager.register(SysTalent.NAME , SysTalent );
        
        App.tableManager.onParse(arr);

        let mapArr:SysMap[] = App.tableManager.getTable(SysMap.NAME);
        let len:number = mapArr.length;
        for(let i = 0; i < len; i++)
        {
            let sysMap:SysMap = mapArr[i];
            if(SysMap.dic[sysMap.stageId] == null)
            {
                SysMap.dic[sysMap.stageId] = [];
            }
            SysMap.dic[sysMap.stageId].push(sysMap);
        }

        for(let key in SysMap.dic)
        {
            let tArr:SysMap[] = SysMap.dic[key];
            tArr.sort((a:SysMap,b:SysMap)=>{
                return a.id - b.id;
            });
        }
    }

    public static TIME_GOLD:string = "TIME_GOLD";
    public static RANK_DIALOG:string = "RANK_DIALOG";

    public static initDialog():void{
        App.dialogManager.register( GameMain.TIME_GOLD , TimeGoldDialog , ["res/atlas/timegold.atlas"] );
        App.dialogManager.register( GameMain.RANK_DIALOG , RankDialog , ["res/atlas/paihang.atlas"] );
    }
}