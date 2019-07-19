import App from "../core/App";
import GameConfig from "../GameConfig";
import MainScene from "./scene/main/MainScene";
import SysChapter from "./sys/SysChapter";
import SysMap from "./sys/SysMap";
import ZipLoader from "../core/utils/ZipLoader";
import SysEnemy from "./sys/SysEnemy";
import AttackType from "../game/ai/AttackType";
import MoveType from "../game/move/MoveType";
import SysBullet from "./sys/SysBullet";
import MonsterAI1 from "../game/ai/MonsterAI1";
import FlyAndHitAi from "../game/ai/FlyAndHitAi";
import FixedGameMove from "../game/move/FixedGameMove";
import PlaneGameMove from "../game/move/PlaneGameMove";
import FlyGameMove from "../game/move/FlyGameMove";
import SkillType from "../game/skill/SkillType";
import SplitSkill from "../game/skill/SplitSkill";
import SysSkill from "./sys/SysSkill";
var REG: Function = Laya.ClassUtils.regClass;
    export default class GameMain{
        
    constructor(){
        ZipLoader.load("res/tables.zip", new Laya.Handler(this, this.zipFun));
    }

    private zipFun(arr: any[]):void{
        App.init();
        this.initTable(arr);
        this.regClass();
        Laya.stage.addChild(App.layerManager);
        GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
    }

    private initTable(arr: any[]):void{
        App.tableManager.register(SysChapter.NAME,SysChapter);
        App.tableManager.register(SysMap.NAME,SysMap);
        App.tableManager.register(SysEnemy.NAME,SysEnemy);
        App.tableManager.register(SysBullet.NAME,SysBullet);
        App.tableManager.register(SysSkill.NAME,SysSkill);

        App.tableManager.onParse(arr);
    }

    private regClass():void{
        //攻击类型
        REG(AttackType.TAG + AttackType.FLYHIT,FlyAndHitAi);
        REG(AttackType.TAG + AttackType.BULLET,MonsterAI1);
        //移动类型
        REG(MoveType.TAG + MoveType.FLY,FlyGameMove);
        REG(MoveType.TAG + MoveType.MOVE,PlaneGameMove);
        REG(MoveType.TAG + MoveType.FIXED,FixedGameMove);
        //技能
        REG(SkillType.TAG + SkillType.SPLIT,SplitSkill);
    }
}