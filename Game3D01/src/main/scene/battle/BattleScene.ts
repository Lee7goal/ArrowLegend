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
import PlaneGameMove from "../../../game/move/PlaneGameMove";
import Monster from "../../../game/player/Monster";
import Hero from "../../../game/player/Hero";
export default class BattleScene extends Laya.Sprite {

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
    }

    init(): void {
        Game.reset();
        if (!Game.executor) {
            Game.executor = new GameExecut();
        }
        Game.map0.drawMap();
        // this.addChild(Game.map0);
        Game.updateMap();

        GameBG.mcx = ((GameBG.wnum + 1) * (GameBG.ww)) / 2 - GameBG.mw2;
        GameBG.mcy = (GameBG.hnum * GameBG.ww) / 2 - GameBG.mw2;

        if (!Game.door) {
            let v3 = GameBG.get3D(6, 9);
            Game.door = Laya.Sprite3D.instantiate(Laya.loader.getRes("h5/effects/door/monster.lh"));
            Game.door.transform.translate(v3);
        }
        Game.layer3d.addChild(Game.door);
        Game.closeDoor();
        Game.setSelectEffect();

        //克隆墙的母体
        var aa = Laya.loader.getRes("h5/wall/wall.lh");
        Game.box = aa;

        var aa = Laya.loader.getRes("h5/zhalan/hero.lh");
        Game.fence = aa;

        let sp: Laya.Sprite3D;
        var isHasBoss: boolean = false;
        var monster: Monster;
        let k: number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                //console.log(i,j);
                let type: number = GameBG.arr0[k];
                if (k < GameBG.arr0.length) {
                    if ((GridType.isWall(type) || (type == 1))) {
                        let v3 = GameBG.get3D(i, j);
                        let box: Laya.Sprite3D = Laya.Sprite3D.instantiate(Game.box);
                        box.transform.scale = Game.cameraCN.boxscale0;
                        box.transform.translate(v3);
                        Game.layer3d.addChild(box)
                    }
                    else if (GridType.isFence(type)) {
                        let v3 = GameBG.get3D(i, j);
                        let box: Laya.Sprite3D = Laya.Sprite3D.instantiate(Game.fence);
                        box.transform.translate(v3);
                        Game.layer3d.addChild(box)
                    }
                    else if (GridType.isMonster(type)) {
                        if (!monster) {
                            monster = Monster.getMonster(type, GameBG.ww * i + (GameBG.ww - GameBG.mw) / 2, j * GameBG.ww + (GameBG.ww - GameBG.mw) / 2);
                            monster.splitTimes = 1;
                            if (!isHasBoss) {
                                isHasBoss = monster.sysEnemy.isBoss == 1;
                            }
                        }
                    }
                }
                k++;
            }
        }

        if (monster) {
            Game.e0_ = monster;
        }

        Game.bg.drawR(isHasBoss);

        sp = Laya.loader.getRes("h5/bullets/20000/monster.lh");
        var gpro = new GamePro(GameProType.HeroArrow);
        gpro.setSp3d(sp);
        Game.a0 = gpro;

        Game.ro = new Rocker();
        Game.ro.resetPos();
        Laya.stage.addChild(Game.ro);


        Game.hero.init();
        Game.bg.updateY();


        Laya.MouseManager.multiTouchEnabled = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
    }



    kd(eve: KeyboardEvent): void {
        if (Game.executor.isRun) {
            Game.executor.stop_();
        } else {
            Game.executor.start();
        }
    }

    md(eve: MouseEvent): void {
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.md);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.up);
        let xx: number = Laya.stage.mouseX;
        let yy: number = Laya.stage.mouseY;
        Game.ro.x = xx;
        Game.ro.y = yy;
        Laya.stage.addChild(Game.ro);
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