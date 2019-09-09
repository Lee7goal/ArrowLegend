import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Scene3D = Laya.Scene3D;
import GameBG from "./GameBG";
import Rocker from "./GameRocker";
import GameMap0 from "./GameMap0";
import GamePro from "./GamePro";
import GameExecut from "./GameExecut";
import GameCameraNum from "./GameCameraNum";
import BattleLoader from "../main/scene/battle/BattleLoader";
import SysEnemy from "../main/sys/SysEnemy";
import App from "../core/App";
import GameProType from "./GameProType";
import AttackType from "./ai/AttackType";
import MoveType from "./move/MoveType";
import HeadTranslateScript from "./controllerScript/HeadTranslateScript";
import FootRotateScript from "./controllerScript/FootRotateScript";
import Monster from "./player/Monster";
import Hero from "./player/Hero";
import SceneManager from "../main/SceneManager";
import ShakeUtils from "../core/utils/ShakeUtils";
import CoinEffect from "./effect/CoinEffect";
import PlayerSkillManager from "./PlayerSkillManager";
import MainUI from "../main/scene/main/MainUI";
import Session from "../main/Session";
import BuffManager from "./buff/BuffManager";
import GameAlert from "../main/GameAlert";
import { BaseCookie } from "../gameCookie/BaseCookie";
import CookieKey from "../gameCookie/CookieKey";

export default class Game {
    static resVer:string = "1.0.4";

    static userHeadUrl:string = "";
    static userName:string = "";

    static TestShooting = 0;
    static BigMapMode = 1;

    static state:number = 0;
    static isPopupSkill:number = 0;

    static rebornTimes:number = 2;

    
    // static monsterResClones: Laya.Sprite3D[] = [];

    static cameraCN: GameCameraNum;

    static Event_MAIN_DIE:string = "Event_MAIN_DIE";
    static Event_PlayStop: string = "Game.Event_PlayStop";
    static Event_Short: string = "Game.Event_Short";
    static Event_Hit: string = "Game.Event_Hit";
    static Event_KeyNum: string = "Game.Event_KeyNum";

    static Event_ADD_HP: string = "Event_ADD_HP";
    static Event_UPDATE_ATTACK_SPEED: string = "Event_UPDATE_ATTACK_SPEED";

    static Event_NPC: string = "Event_NPC";
    static Event_COINS: string = "Event_COINS";
    static Event_EXP:string = "Event_EXP";
    static Event_LEVEL:string = "Event_LEVEL";
    static Event_SELECT_NEWSKILL:string = "Event_SELECT_NEWSKILL";

    static skillManager:PlayerSkillManager = new PlayerSkillManager();

    static AiArr: GamePro[] = [];
    static HeroArrows: GamePro[] = [];
    //3d层
    static layer3d: Sprite3D = new Sprite3D();
    //3d摄像机
    static camera: Camera;
    //临时v3
    //static v3:Vector3 = new Vector3(0,0,0);
    //3d场景
    static scene3d: Laya.Scene3D;
    //主英雄
    //static hero:Laya.Sprite3D;
    static hero: Hero = new Hero();
    //主敌人    
    static e0_: GamePro;

    static selectEnemy(pro: GamePro): void {
        Game.e0_ = pro;
        let curScale: number = (pro as Monster).sysEnemy.zoomMode / 100;
        curScale = 1 / curScale;
        if (Game.e0_.sp3d && Game.e0_.sp3d.transform)  {
            Game.e0_.sp3d.addChild(Game.selectFoot);
            Game.e0_.addSprite3DToChild("guadian", Game.selectHead);
            Game.selectHead.transform.localScale = new Laya.Vector3(curScale, curScale, curScale);
            Game.selectFoot.transform.localScale = new Laya.Vector3(curScale, curScale, curScale);
        }
        else  {
            console.log("克隆体没有了？");
        }
    }

    //主箭    
    static a0: GamePro;

    //2d背景
    static bg: GameBG;
    //贴图材质
    static material_blinn: Laya.BlinnPhongMaterial;

    //栅栏
    static fence: Laya.Sprite3D;

    static bullet: Laya.MeshSprite3D;
    //摇杆
    static ro: Rocker;

    static cameraY: number = 10;

    static sqrt3: number = 10 * Math.sqrt(3);

    static map0: GameMap0;

    static footLayer: Laya.Sprite = new Laya.Sprite();
    static bloodLayer: Laya.Sprite = new Laya.Sprite();
    static frontLayer: Laya.Sprite = new Laya.Sprite();
    static topLayer: Laya.Sprite = new Laya.Sprite();

    static scenneM: SceneManager = new SceneManager();
    static buffM:BuffManager = new BuffManager();


    /**脚底红圈 */
    static selectFoot: Laya.Sprite3D;
    /**头顶的红三角 */
    static selectHead: Laya.Sprite3D;

    static executor: GameExecut;

    static battleLoader: BattleLoader = new BattleLoader();

    static updateMap(): void {
        if (Game.map0) {
            if (Game.bg) {
                Game.bloodLayer.pos(Game.bg.x, Game.bg.y);
                Game.frontLayer.pos(Game.bg.x, Game.bg.y);
                Game.footLayer.pos(Game.bg.x, Game.bg.y);
                Game.topLayer.pos(Game.bg.x, Game.bg.y);
                Game.map0.pos(Game.bg.x, Game.bg.y);
            }
        }
    }

    static cookie:BaseCookie;

    static door: Laya.Sprite3D;
    static isOpen: boolean = false;
    static openDoor(): void {
        if (Game.isOpen)  {
            return;
        }
        console.log("开门");
        Game.cookie.setCookie(CookieKey.CURRENT_BATTLE,{
            "mapId":Game.battleLoader.mapId,
            "index":Game.battleLoader.index,
            "configId":Game.battleLoader._configId,
            "curhp":Game.hero.gamedata.hp,
            "maxhp":Game.hero.gamedata.maxhp,
            "skills":Game.skillManager.skills,
            "coins":Game.battleCoins
        });
        Game.isOpen = true;
        Game.battleLoader.index++;
        Game.bg.setDoor(1);
        Game.layer3d.addChild(Game.door);
        // Game.door.transform.localPositionY = 0;
        // console.log("门的位置",Game.door.transform.localPositionX,Game.door.transform.localPositionY,Game.door.transform.localPositionZ);
        // Game.door.active = true;
        Game.map0.setDoor(true);
        Game.shakeBattle();
        Game.battleLoader.clearMonster();
        Session.saveData();

        // Game.battleLoader.load();
    }

    static shakeBattle():void
    {
        Game.scenneM.battle.pos(0,0);
        ShakeUtils.execute(Game.scenneM.battle, 75, 4);
    }

    static closeDoor(): void {
        console.log("关门====================");
        Game.isOpen = false;
        // Game.door.transform.localPositionY = -500;
        Game.door && Game.door.removeSelf();
        Game.map0.setDoor(false);
        Game.bg.setDoor(0);
    }

    static setSelectEffect(): void {
        if (!Game.selectHead) {
            Game.selectHead = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/head/monster.lh"));

            Game.selectHead.addComponent(HeadTranslateScript);
        }
        if (!Game.selectFoot) {
            Game.selectFoot = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/foot/hero.lh"));
            Game.selectFoot.addComponent(FootRotateScript);
        }
        
        // if (!Game.selectHead.getComponent(HeadTranslateScript))  {
        //     Game.selectHead.addComponent(HeadTranslateScript);
        // }

        // Game.selectFoot = Laya.loader.getRes("h5/effects/foot/hero.lh");
        // if (!Game.selectFoot.getComponent(FootRotateScript))  {
        //     Game.selectFoot.addComponent(FootRotateScript);
        // }
    }

    static reset(): void {
        Game.state = 0;
        Game.isPopupSkill = 0;
        // Game.AiArr.length = 1;
        Game.bloodLayer.removeChildren();
        Game.frontLayer.removeChildren();
        Game.footLayer.removeChildren();
        Game.layer3d.removeChildren();
        Game.topLayer.removeChildren();
        Game.selectHead && Game.selectHead.removeSelf();
        Game.selectFoot && Game.selectFoot.removeSelf();
        Game.map0.reset();
        Game.e0_ = null;
        Game.executor && Game.executor.stop_();
        if (Game.ro) {
            Game.ro.destroy();
        }
    }

    static getRandPos(pro: GamePro): number[]  {
        let mRow: number = Math.floor(pro.hbox.y / GameBG.ww);
        let mCol: number = Math.floor(pro.hbox.x / GameBG.ww);

        let range: number = 4;
        let endRowNum = Game.map0.endRowNum - 1;

        var info: any = Game.map0.info;
        var arr: number[][] = [];
        for (let i = mRow - range; i <= mRow + range; i++) {
            if (i < 10 || i > endRowNum)  {
                continue;
            }
            for (let j = mCol - range; j <= mCol + range; j++) {
                if (j == mRow && i == mCol) {
                    continue;
                }
                if (j < 1 || j > 11)  {
                    continue;
                }
                var key: number = info[i + "_" + j];
                if (key == null)  {
                    continue;
                }
                if (key == 0) {
                    let aaa: number[] = [j, i];
                    arr.push(aaa);
                }
            }
        }
        var toArr: number[] = [];
        if (arr.length > 0) {
            var rand: number = Math.floor(arr.length * Math.random());
            toArr = arr[rand];
        }
        return toArr;
    }

    constructor() {
        //Laya.Scene3D
    }

    static alert:GameAlert;

    /**战斗中的金币 */
    static battleCoins: number = 0;

    /**结算时候加的金币 */
    static addCoins:number = 0;

    static showMain():void
    {
        Game.cookie.removeCookie(CookieKey.CURRENT_BATTLE);
        
        Game.battleCoins = 0;
        Game.selectFoot && Game.selectFoot.removeSelf();
        Game.selectHead && Game.selectHead.removeSelf();
        Game.skillManager.clear();
        Game.battleLoader.index = 1;
        Game.rebornTimes = 2;
        Game.hero.reset();
        Game.hero.resetAI();
        Game.hero.playerData.exp = 0;
        Game.battleLoader.clearMonster();
        Game.scenneM.showMain();

        Game.map0.Eharr.length = 0;
        Game.AiArr.length = 0;

        Game.playBgMusic();
    }

    static playBgMusic():void
    {
        Game.playMusic("menu.mp3");
    }

    static playBattleMusic():void
    {
        Game.playMusic("state_fight.mp3");
    }

    static playMusic(str:string):void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH,(res)=>{
            if(res == null ||res.state == 1)
            {
                App.soundManager.play(str,true);
            }
        });
    }

    static playSound(str:string):void
    {
        Game.cookie.getCookie(CookieKey.SOUND_SWITCH,(res)=>{
            if(res.state == 1)
            {
                App.soundManager.play(str);
            }
        });
    }
}