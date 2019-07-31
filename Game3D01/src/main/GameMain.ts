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
import FlyGameMove from "../game/move/FlyGameMove";
import Game from "../game/Game";
import JumpMove from "../game/move/JumpMove";
import MonsterAI from "../game/ai/MonsterAI";
import AIType from "../game/ai/AIType";
import BaseAI from "../game/ai/BaseAi";
import FlowerAI from "../game/ai/FlowerAI";
import StoneAI from "../game/ai/StoneAI";
import TreeAI from "../game/ai/TreeAI";
import MonsterMove from "../game/move/MonsterMove";
import RandMoveAI from "../game/ai/RandMoveAI";
import BounceRandomMoveAI from "../game/ai/BounceRandomMoveAI";
import MoveAndHitAi from "../game/ai/MoveAndHitAi";
import FollowAI from "../game/ai/FollowAI";
import JumpFollowAI from "../game/ai/JumpFollowAI";
import { ui } from "./../ui/layaMaxUI";
import NPC_1001_view from "./scene/battle/npc/NPC_1001_view";
import NPC_1002_view from "./scene/battle/npc/NPC_1002_view";
import NPC_1003_view from "./scene/battle/npc/NPC_1003_view";
import NPC_1001 from "./scene/battle/npc/NPC_1001";
import NPC_1002 from "./scene/battle/npc/NPC_1002";
import NPC_1003 from "./scene/battle/npc/NPC_1003";


var REG: Function = Laya.ClassUtils.regClass;
    export default class GameMain{
        
    constructor(){
        ZipLoader.load("h5/tables.zip", new Laya.Handler(this, this.zipFun));
    }

    private zipFun(arr: any[]):void{
        App.init();
        this.initTable(arr);
        this.regClass();
        Laya.stage.addChild(App.layerManager);
        Game.scenneM.showMain();
    }
    private _mainScene:MainScene;

    private initTable(arr: any[]):void{
        App.tableManager.register(SysChapter.NAME,SysChapter);
        App.tableManager.register(SysMap.NAME,SysMap);
        App.tableManager.register(SysEnemy.NAME,SysEnemy);
        App.tableManager.register(SysBullet.NAME,SysBullet);

        App.tableManager.onParse(arr);
    }

    private regClass():void{
        //NPC
        REG("NPC1001",NPC_1001);
        REG("NPC1002",NPC_1002);
        REG("NPC1003",NPC_1003);

        REG("NPCVIEW1001",NPC_1001_view);
        REG("NPCVIEW1002",NPC_1002_view);
        REG("NPCVIEW1003",NPC_1003_view);
        //攻击类型
        REG(AttackType.TAG + AIType.NOTHAS,BaseAI);
        REG(AttackType.TAG + AIType.FLYHIT,FlyAndHitAi);
        REG(AttackType.TAG + AIType.BULLET,FlowerAI);
        REG(AttackType.TAG + AIType.STONE,StoneAI);
        REG(AttackType.TAG + AIType.TREE,TreeAI);
        REG(AttackType.TAG + AIType.RANDOM_MOVE,RandMoveAI);
        REG(AttackType.TAG + AIType.BOUNCE_RANDOM_MOVE,BounceRandomMoveAI);
        REG(AttackType.TAG + AIType.MOVEHIT,MoveAndHitAi);
        REG(AttackType.TAG + AIType.FOLLOW,FollowAI);
        REG(AttackType.TAG + AIType.JUMP_FOLLOW,JumpFollowAI);
        //移动类型
        REG(MoveType.TAG + MoveType.FLY,FlyGameMove);
        REG(MoveType.TAG + MoveType.MOVE,MonsterMove);
        REG(MoveType.TAG + MoveType.FIXED,FixedGameMove);
        REG(MoveType.TAG + MoveType.JUMP,JumpMove);
    }
}