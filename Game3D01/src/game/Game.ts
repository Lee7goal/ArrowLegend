import Sprite3D = Laya.Sprite3D;
import Camera = Laya.Camera;
import Vector3 = Laya.Vector3;
import Scene3D =Laya.Scene3D;
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
import SkillType from "./skill/SkillType";
import SysSkill from "../main/sys/SysSkill";
import SplitSkill from "./skill/SplitSkill";

export default class Game{

    static cameraCN:GameCameraNum;

    static Event_PlayStop:string = "Game.Event_PlayStop";
    static Event_Short:string = "Game.Event_Short";
    static Event_Hit:string   = "Game.Event_Hit";
    static Event_KeyNum:string   = "Game.Event_KeyNum";

    static AiArr:GamePro[] = [];
    static HeroArrows:GamePro[] = [];
    //3d层
    static layer3d:Sprite3D = new Sprite3D();
    //3d摄像机
    static camera:Camera;
    //临时v3
    //static v3:Vector3 = new Vector3(0,0,0);
    //3d场景
    static scene3d:Laya.Scene3D;
    //主英雄
    //static hero:Laya.Sprite3D;
    static hero:GamePro;
    //主敌人    
    static e0_:GamePro;
    //主箭    
    static a0:GamePro;

    //2d背景
    static bg:GameBG;
    //贴图材质
    static material_blinn:Laya.BlinnPhongMaterial;
    //墙块
    static box:Laya.Sprite3D;

    //栅栏
    static fence:Laya.Sprite3D;

    static bullet:Laya.MeshSprite3D;
    //摇杆
    static ro:Rocker;

    static cameraY:number = 10;

    static sqrt3:number = 10*Math.sqrt(3);

    static map0:GameMap0;

    static footLayer:Laya.Sprite = new Laya.Sprite();
    static bloodLayer:Laya.Sprite = new Laya.Sprite();
    static frontLayer:Laya.Sprite = new Laya.Sprite();


    static selectFoot:Laya.Sprite3D;
    static selectHead:Laya.Sprite3D;
    
    static executor:GameExecut;

    static battleLoader:BattleLoader = new BattleLoader();

    static updateMap():void{
        if(Game.map0){
            if(Game.bg){
                Game.bloodLayer.pos(Game.bg.x,Game.bg.y);
                Game.frontLayer.pos(Game.bg.x,Game.bg.y);
                Game.footLayer.pos(Game.bg.x,Game.bg.y);
                Game.map0.pos(Game.bg.x,Game.bg.y);
            }
        }
    }

    static door:Laya.Sprite3D;
    static openDoor():void
    {
        Game.bg.setDoor(1);
        let v3 = GameBG.get3D(6, 9);
        Game.door = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/door/hero.lh"));
        Game.door.transform.translate(v3);
        Game.layer3d.addChild(Game.door);
        Game.map0.setDoor(true);
    }

    static closeDoor():void{
        Game.door && Game.door.removeSelf();
        Game.map0.setDoor(false);
        Game.bg.setDoor(0);
    }

    static reset():void{
        Game.AiArr.length = 0;
        Game.bloodLayer.removeChildren();
        Game.frontLayer.removeChildren();
        Game.footLayer.removeChildren();
        Game.layer3d.removeChildren();
        Game.executor && Game.executor.stop_();
        if(Game.ro)
        {
            Game.ro.destroy();
        }

        // Game.bloodLayer.pos(0, 0);
        // Game.frontLayer.pos(0, 0);
        // Game.footLayer.pos(0, 0);
    }

    constructor(){
        //Laya.Scene3D
    }

    static getMonster(enemyId: number,xx:number,yy:number,mScale?:number,hp?:number): GamePro {
        let sysEnemy: SysEnemy = App.tableManager.getDataByNameAndId(SysEnemy.NAME, enemyId);
        let sysSkill:SysSkill;
        var sp = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/monsters/" + sysEnemy.enemymode + "/monster.lh"));
        if(!hp)
        {
            hp = sysEnemy.enemyHp;
            if(sysEnemy.skillId > 0)
            {
                sysSkill = App.tableManager.getDataByNameAndId(SysSkill.NAME,sysEnemy.skillId);
                if(sysSkill.effectType == SkillType.SPLIT)
                {
                    hp = sysEnemy.enemyHp / sysSkill.effect1;
                }
            }
        }
        var gpro = new GamePro(GameProType.RockGolem_Blue,hp);
        gpro.sysEnemy = sysEnemy;
        gpro.setSp3d(sp);

        var ATT: any = Laya.ClassUtils.getClass(AttackType.TAG + sysEnemy.attackType);
        var MONS: any = Laya.ClassUtils.getClass(MoveType.TAG + sysEnemy.moveType);
        

        gpro.setGameAi(new ATT(gpro));
        gpro.setGameMove(new MONS());
        if(sysSkill)
        {
            var SKILL:any = Laya.ClassUtils.getClass(SkillType.TAG + sysSkill.effectType);
            gpro.setSkill(new SKILL());
        }
        
        let tScale: number = sysEnemy.zoomMode / 100;
        tScale = mScale ? mScale : tScale;
        gpro.sp3d.transform.scale = new Laya.Vector3(tScale, tScale, tScale);
        Game.map0.Eharr.push(gpro.hbox);//加入敌人组
        Game.map0.Fharr.push(gpro.hbox);//加入碰撞伤害组
        Game.map0.addChild(gpro.sp2d);
        Game.layer3d.addChild(sp);

        gpro.setXY2DBox(xx,yy);
        gpro.startAi();
        gpro.setUI();
        return gpro;
    }
}