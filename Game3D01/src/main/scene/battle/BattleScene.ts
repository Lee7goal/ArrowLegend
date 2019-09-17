import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import GameBG from "../../../game/GameBG";
import Rocker from "../../../game/GameRocker";
import GameMap0 from "../../../game/GameMap0";
import GameHitBox from "../../../game/GameHitBox";
import GamePro from "../../../game/GamePro";
import GridType from "../../../game/bg/GridType";
import GameProType from "../../../game/GameProType";
import FootRotateScript from "../../../game/controllerScript/FootRotateScript";
import HeadTranslateScript from "../../../game/controllerScript/HeadTranslateScript";
import GameExecut from "../../../game/GameExecut";
import GameCameraNum from "../../../game/GameCameraNum";
import SysEnemy from "../../../main/sys/SysEnemy";
import App from "../../../core/App";
import AttackType from "../../../game/ai/AttackType";
import MoveType from "../../../game/move/MoveType";
import BattleLoader from "../../../main/scene/battle/BattleLoader";
import HeroAI from "../../../game/ai/HeroAI";
import Monster from "../../../game/player/Monster";
import Hero from "../../../game/player/Hero";
import TopUI from "./TopUI";
import PauseUI from "./PauseUI";
import GameOverView from "./gameOver/GameOverView";
import CustomShaderff00 from "../../../shader/CustomShaderff00";
import SelectNewSkill from "./SelectNewSkill";
import SysSkill from "../../sys/SysSkill";
import Session from "../../Session";
import RebornView from "./gameOver/RebornView";
import GameCube from "./GameCube";
import GameFence from "./GameFence";
import SysMap from "../../sys/SysMap";
import GameEvent from "../../GameEvent";
import GameThorn from "../../../game/GameThorn";
import BattleFlagID from "../BattleFlagID";
import GuideTalk from "../../guide/GuideTalk";
import GuideActionArea from "../../guide/GuideActionArea";
export default class BattleScene extends Laya.Sprite {

    _top: TopUI;
    private _gameOver: GameOverView;
    private _rebornView: RebornView;
    private guideMonster:Monster;
    private guideCircle:Laya.Sprite3D;

    _guideTalk:GuideTalk;
    private _guideArea:GuideActionArea;
    constructor() {
        super();
        var bg: GameBG = new GameBG();
        this.addChild(bg);
        Game.bg = bg;
        var map0: GameMap0 = new GameMap0();
        Game.map0 = map0;
        //脚底层
        this.addChild(Game.footLayer);
        this.addChild(Game.frontLayer);
        //添加3D场景
        var scene: Laya.Scene3D = this.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        scene.addChild(Game.layer3d);
        Game.scene3d = scene;
        //血条层
        this.addChild(Game.bloodLayer);

        this.addChild(Game.topLayer);
        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        Game.cameraCN = new GameCameraNum(-45, 10);
        camera.transform.translate(new Laya.Vector3(0, Game.cameraCN.y, Game.cameraCN.z));
        camera.transform.rotate(new Laya.Vector3(Game.cameraCN.a, 0, 0), true, false);


        camera.orthographic = true;
        Game.camera = camera;
        //正交投影垂直矩阵尺寸
        GameBG.orthographicVerticalSize = GameBG.wnum * Laya.stage.height / Laya.stage.width;
        camera.orthographicVerticalSize = GameBG.orthographicVerticalSize;
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
        //添加方向光
        var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));

        bg.on(Game.Event_NPC, this, this.showNpcView);

        this._top = new TopUI();
        this.addChild(this._top);
        this._top.reset();

        this._top.zanting.clickHandler = new Laya.Handler(this, this.showPause);

        Laya.stage.on(Game.Event_SELECT_NEWSKILL, this, this.onShowSelect);
        Laya.stage.on(Game.Event_MAIN_DIE, this, this.showDieView1);

        Laya.stage.on(GameEvent.MEMORY_WARNING,this,this.onRelease);

        // this.on(Laya.Event.UNDISPLAY,this,this.unDis);
    }

    private onRelease():void
    {
        Game.battleLoader.onRelease();
    }

    private _selectSkill: SelectNewSkill;
    /**技能选择 */
    private onShowSelect(lv: number): void {
        if (lv > 10)  {
            return;
        }
        this.up(null);
        if (!this._selectSkill) {
            this._selectSkill = new SelectNewSkill();
        }
        this.addChild(this._selectSkill);
        Game.isPopupSkill = 1;
        Game.state = 1;
    }

    private onOver(): void {
        if (!this._gameOver) {
            this._gameOver = new GameOverView();
        }
        this.addChild(this._gameOver);
        Game.state = 1;
    }

    private onReborn(): void {
        if (!this._rebornView) {
            this._rebornView = new RebornView();
        }
        this.addChild(this._rebornView);
        Game.state = 1;
    }

    private showDieView1(): void {
        if (Game.rebornTimes <= 0)  {
            this.onOver();
        }
        else  {
            this.onReborn();
        }
    }

    private _pauseUI: PauseUI;
    private showPause(): void {
        if (!this._pauseUI) {
            this._pauseUI = new PauseUI();
        }
        this.addChild(this._pauseUI);
        Game.executor.stop_();
        Game.state = 1;
    }

    private npcView: Laya.View;
    private showNpcView(): void {
        let npcId: number = Game.bg.npcId;
        if (npcId > 0) {
            let NPCVIEW = Laya.ClassUtils.getClass("NPCVIEW" + npcId);
            if (NPCVIEW) {
                this.npcView = new NPCVIEW();
                this.addChild(this.npcView);
            }
            Game.state = 1;
        }
    }

    private nullGridList:Laya.Point[] = [];
    init(): void {
        if(!Game.hero)
        {
            Game.hero = new Hero();
        }
        // Game.camera.transform.localPositionZ = 0;
        // Game.camera.transform.localPositionX = 0;
        
        GameFence.recover();
        GameThorn.recover();

        Session.saveData();
        Game.reset();
        this._top.updateCoins();
        this._top.updateExp();
        this._top.updateIndex(Game.battleLoader.index);
        if (!Game.executor) {
            Game.executor = new GameExecut();
            CustomShaderff00.ff00;
        }
        this._top._indexBox.visible = !Session.isGuide;
        Game.map0.drawMap();
        // this.addChild(Game.map0);
        

        // GameBG.mcx = ((GameBG.wnum + 1) * (GameBG.ww)) / 2 - GameBG.mw2;
        // GameBG.mcy = (GameBG.hnum * GameBG.ww) / 2 - GameBG.mw2;

        GameBG.mcx = 13 * GameBG.ww /2   - GameBG.mw2;
        GameBG.mcy = GameBG.bgHH *0.5 - GameBG.mw2;

        
        Game.setSelectEffect();


        var aa = Laya.loader.getRes("h5/zhalan/hero.lh");
        Game.fence = aa;

        this.nullGridList.length = 0;

        let sp: Laya.Sprite3D;
        var isHasBoss: boolean = false;
        var bossEnemy:SysEnemy;
        var monster: Monster;
        let k: number = 0;
        for (let j = 0; j < GameBG.MAP_ROW; j++) {
            for (let i = 0; i < GameBG.MAP_COL; i++) {
                let type: number = GameBG.arr0[k];
                // if (k < GameBG.arr0.length) {
                    if (GridType.isCube(type)) {
                        GameCube.getOne(GameBG.get3D(i, j),type);//墙
                    }
                    else if (GridType.isFence(type)) {
                        GameFence.getOne(GameBG.get3D(i, j));//栅栏
                    }
                    else if (Game.battleLoader.continueRes == null && GridType.isMonster(type)) {
                        // if (!monster) {
                        if (Game.battleLoader.monsterId > 0) {
                            type = Game.battleLoader.monsterId;
                        }
                        // type = 10051;
                        monster = Monster.getMonster(type, GameBG.ww * i + (GameBG.ww - GameBG.mw) / 2, j * GameBG.ww + (GameBG.ww - GameBG.mw) / 2);
                        monster.splitTimes = 1;
                        if (!isHasBoss) {
                            isHasBoss = monster.sysEnemy.isBoss == 1;
                            bossEnemy = monster.sysEnemy;
                        }

                        if(Session.isGuide)
                        {
                            this.guideMonster = monster;
                            this.guideMonster.hide();
                        }
                        // }
                    }

                    if(type == BattleFlagID.DOOR)
                    {
                        let v3 = GameBG.get3D(i,j);
                        // Game.door = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/door/monster.lh"));
                        if(!Game.door)
                        {
                            Game.door = Laya.loader.getRes("h5/effects/door/monster.lh");
                            Game.layer3d.addChild(Game.door);
                            Game.door.transform.translate(v3);
                        }
                        Game.door.transform.localPositionX = v3.x;
                        Game.door.transform.localPositionZ = v3.z;
                        // Game.monsterResClones.push(Game.door);
                        
                    }
                    else if(type == BattleFlagID.GUIDE)
                    {
                        let v3 = GameBG.get3D(i,j);
                        console.log("绿圈的位置",i,j,v3);
                        // Laya.Sprite3D.load("h5/effects/guide/monster.lh",new Laya.Handler(this,(vv)=>{
                            console.log("使用的时候",i,j,v3);
                            this.guideCircle = Laya.loader.getRes("h5/effects/guide/monster.lh");
                            this.guideCircle.transform.translate(v3);
                            this.guideCircle.transform.localPositionX = v3.x;
                            this.guideCircle.transform.localPositionZ = v3.z;
                            
                            // this.guideCircle.transform.localPositionX = -500;
                        // },[v3]))
                        
                    }

                    // if(type == 0)
                    // {
                    //     this.nullGridList.push(new Laya.Point(GameBG.ww * i,j * GameBG.ww));
                    // }
                // }
                k++;
            }
        }

        this._top.setBoss(isHasBoss,bossEnemy);

        // Laya.timer.loop(5000,this,()=>{
        //     if(Game.door.parent)
        //     {
        //         Game.door.removeSelf();
        //     }
        //     else
        //     {
        //         Game.layer3d.addChild(Game.door);
        //     }
        // })

        Game.closeDoor();

        if (monster) {
            Game.e0_ = monster;
        }

        Game.bg.drawR(isHasBoss);

        Game.ro = new Rocker();
        Game.ro.resetPos();
        this.addChild(Game.ro);

        if(!Game.hero)
        {
            Game.hero = new Hero();
        }
        Game.hero.init();
        Game.hero.playerData.lastLevel = Game.hero.playerData.level;
        Game.bg.updateY();

        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1001));
        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1002));
        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1003));
        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1004));
        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1005));
        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1008));
        Game.skillManager.addSkill(App.tableManager.getDataByNameAndId(SysSkill.NAME,1009));

        this.setGuide("滑动摇杆，控制角色到达指定位置。",1);

        Laya.MouseManager.multiTouchEnabled = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
        
        Laya.stage.on(Laya.Event.KEY_PRESS, this, this.onOpenDoor);
    }

    setGuide(str:string,guideId:number):void
    {
        this._guideTalk && this._guideTalk.removeSelf();
        if(!Session.isGuide)
        {
            return;
        }
        Session.guideId = guideId;
        if(!this._guideTalk)
        {
            this._guideTalk = new GuideTalk();
        }
        this.addChild(this._guideTalk);
        this._guideTalk.setContent(str,guideId)
        Laya.stage.on(GameEvent.SHOW_ACTION_RECT,this,this.showActionRect);
    }

    private showActionRect(guideId:number):void{
        this._guideArea && this._guideArea.removeSelf();
        if(!Session.isGuide)
        {
            return;
        }
        if(Session.guideId == 1)
        {
            if(!this._guideArea)
            {
                this._guideArea = new GuideActionArea();
            }
            this.addChild(this._guideArea);
            // Game.bg.showGuidePointer();
            // this.guideCircle.transform.localPositionX = 0;
            Game.layer3d.addChild(this.guideCircle);
            Session.guideId = 3;
            
        }
        else if(Session.guideId == 2)
        {
            //召唤怪
            let zhaohuan: ui.test.zhaohuanUI = new ui.test.zhaohuanUI();
            Game.bloodLayer.addChild(zhaohuan);
            zhaohuan.pos(this.guideMonster.hbox.cx, this.guideMonster.hbox.cy);
            setTimeout(() => {
                zhaohuan.removeSelf();
                this.guideMonster.show();
                Session.guideId = 4;
                this.guideCircle && this.guideCircle.removeSelf();
            }, 800);

            
            
            // this.guideCircle.transform.localPositionX = -500;
            // Game.bg.hideGuidePointer();
        }
    }

    private index:number = 0;
    private doorLoop():void
    {
        if(this.index % 2 == 0)
        {
            Game.door.transform.localPositionY = 0;
        }
        else
        {
            Game.door.transform.localPositionY = -500;
        }
        this.index++
    }
    private onOpenDoor(e: Laya.Event): void {
        if (e.nativeEvent.keyCode == 111) {
            // Game.openDoor();
            Game.hero.busi = true;
        }
    }



    kd(eve: KeyboardEvent): void {
        if (Game.executor.isRun) {
            Game.executor.stop_();
        } else {
            Game.executor.start();
        }
    }

    md(eve: MouseEvent): void {
        if (Game.state > 0) {
            return;
        }

        if(Session.guideId == 1 || Session.guideId == 2)
        {
            return;
        }

        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.md);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.up);
        let xx: number = Laya.stage.mouseX;
        let yy: number = Laya.stage.mouseY;
        Game.ro.x = xx;
        Game.ro.y = yy;
        this.addChild(Game.ro);
        Laya.stage.frameLoop(1, this, this.moves);

        //Game.hero.stopAi();
        if (Game.executor.isRun) {
            (<HeroAI>Game.hero.getGameAi()).run = true;
        }



    }

    up(eve: Event): void {
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.up);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
        if (Game.ro && Game.ro.parent) {
            Game.ro.resetPos();
            Game.ro.reset();
        }
        Laya.stage.clearTimer(this, this.moves);

        if (Game.executor.isRun) {
            (<HeroAI>Game.hero.getGameAi()).run = false;
        }

        // Game.hero.startAi();        
    }

    moves(): void {
        if (Game.state > 0) {
            return;
        }
        let xx: number = Laya.stage.mouseX;
        let yy: number = Laya.stage.mouseY;
        let n: number;
        Game.ro.setSp0(xx, yy);
        // var speed: number = Game.ro.getSpeed();
        // n = Game.ro.getA3d();
        // Game.ro.rotate(n);
        // if (speed > 0) {
        //     // Game.hero.rotation(n);
        //     // this.move2d(Game.ro.getA());
        // } else {

        // }
    }


}