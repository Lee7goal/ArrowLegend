import { ui } from "./../ui/layaMaxUI";
import Game from "../game/Game";
import GameBG from "../game/GameBG";
import Rocker from "../game/GameRocker";
import GameMap0 from "../game/GameMap0";
import GameHitBox from "../game/GameHitBox";
import GamePro from "../game/GamePro";
import { SimpleGameMove, ArrowGameMove, PlaneGameMove } from "../game/GameMove";
import { HeroAI, HeroArrowAI, MonsterAI1 } from "../game/GameAI";
import GridType from "../game/bg/GridType";
import GameProType from "../game/GameProType";
import FootRotateScript from "../game/controllerScript/FootRotateScript";
import HeadTranslateScript from "../game/controllerScript/HeadTranslateScript";
import GameExecut from "../game/GameExecut";
import GameCameraNum from "../game/GameCameraNum";
export default class GameUI2 extends ui.test.TestSceneUI {

    constructor() {
        super();
        Game.executor = new GameExecut();
        var bg: GameBG = new GameBG();

        //bg.y = 1.5 * GameBG.ww;
        //bg.alpha = 0;
        Laya.stage.addChild(bg);
        Game.bg = bg;
        //脚底层
        Laya.stage.addChild(Game.footLayer);
        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        scene.addChild(Game.layer3d);
        Game.scene3d = scene;
        //血条层
        Laya.stage.addChild(Game.bloodLayer);
        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        // camera.transform.translate(new Laya.Vector3(0, 10, 10));
        //camera.transform.translate(new Laya.Vector3(0, 10, 10 * Math.sqrt(3)));
        //camera.transform.rotate(new Laya.Vector3(-90, 0, 0), true, false);
        //camera.transform.rotate(new Laya.Vector3(-45, 0, 0), true, false);
        Game.cameraCN = new GameCameraNum(-45,10);
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

        //添加自定义模型
        var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        Game.material_blinn = material;
        Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function (tex: Laya.Texture2D) {
            material.albedoTexture = tex;
        }));

        var map0: GameMap0 = new GameMap0();
        map0.drawMap();
        // Laya.stage.addChild(map0);        
        Game.map0 = map0;
        Game.updateMap();
        this.heroUrl = "h5/ToonSkeletons/ToonSkeletons.lh";
        this.heroUrl = "h5/hero/hero.lh";
        Laya.loader.create(["h5/monsters/10001/monster.lh", this.heroUrl, "h5/ArrowBlue/monster.lh", "h5/gong/hero.lh", "h5/wall/wall.lh", "h5/zhalan/hero.lh", "h5/selectEnemy/foot/hero.lh", "h5/selectEnemy/head/hero.lh", "h5/gunEffect/hero.lh"], Laya.Handler.create(this, this.onComplete))

    }

    private heroUrl: string;

    getMonster(): GamePro {
        var sp = Laya.Sprite3D.instantiate(Game.e0_.sp3d);
        var gpro = new GamePro(GameProType.RockGolem_Blue);
        gpro.setSp3d(sp);
        gpro.setGameAi(new MonsterAI1(gpro));
        gpro.setGameMove(new PlaneGameMove());

        Game.map0.Eharr.push(gpro.hbox);//加入敌人组
        Game.map0.Fharr.push(gpro.hbox);//加入碰撞伤害组
        Game.map0.addChild(gpro.sp2d);
        Game.layer3d.addChild(sp);
        return gpro;
    }

    onComplete(): void {
        Game.selectFoot = Laya.loader.getRes("h5/selectEnemy/foot/hero.lh");
        Game.selectFoot.addComponent(FootRotateScript);

        Game.selectHead = Laya.loader.getRes("h5/selectEnemy/head/hero.lh");
        Game.selectHead.addComponent(HeadTranslateScript);
        //克隆墙的母体
        var aa = Laya.loader.getRes("h5/wall/wall.lh");
        Game.box = aa;

        var aa = Laya.loader.getRes("h5/zhalan/hero.lh");
        Game.fence = aa;

        let k: number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                //console.log(i,j);
                let type:number = GameBG.arr0[k];
                if (k < GameBG.arr0.length) {
                    if((GridType.isWall(type) || (type == 1)))
                    {
                        let v3 = GameBG.get3D(i, j);
                        let box:Laya.Sprite3D = Laya.Sprite3D.instantiate(Game.box);
                        box.transform.scale = Game.cameraCN.boxscale0;
                        box.transform.translate(v3);
                        Game.layer3d.addChild(box)
                    }
                    else if(GridType.isFence(type))
                    {
                        let v3 = GameBG.get3D(i, j);
                        let box:Laya.Sprite3D = Laya.Sprite3D.instantiate(Game.fence);
                        box.transform.translate(v3);
                        Game.layer3d.addChild(box)
                    }
                }
                k++;
            }
        }

        Game.bg.drawR();

        let sp: Laya.Sprite3D = Laya.loader.getRes("h5/monsters/10001/monster.lh");
        //Game.layer3d.addChild(sp);        
        var gpro = new GamePro(GameProType.RockGolem_Blue);
        gpro.setSp3d(sp);
        Game.e0_ = gpro;



        sp = Laya.loader.getRes("h5/ArrowBlue/monster.lh");
        var gpro = new GamePro(GameProType.HeroArrow);
        gpro.setSp3d(sp);
        Game.a0 = gpro;

        //得到原始Sprite3D   
        sp = Laya.loader.getRes(this.heroUrl);
        Game.layer3d.addChild(sp);
        Game.hero = new GamePro(GameProType.Hero);
        Game.hero.setSp3d(sp as Laya.Sprite3D);

        Game.ro = new Rocker();
        Game.ro.x = Laya.stage.width / 2;
        Game.ro.y = Laya.stage.height - 200;
        this.addChild(Game.ro);
        Laya.MouseManager.multiTouchEnabled = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
        Game.hero.play("Idle");
        Game.map0.addChild(Game.hero.sp2d);
        Game.hero.setGameMove(new PlaneGameMove());
        Game.hero.setGameAi(new HeroAI());
        Game.hero.addWeapon();

        Game.hero.setXY2DBox(GameBG.ww * 6, (GameBG.arr0.length / 13 - 1) * GameBG.ww);
        Game.bg.updateY();
        Game.map0.Hharr.push(Game.hero.hbox);

        // gpro = this.getMonster();
        // gpro.setXY2DBox(GameBG.ww*6 , (GameBG.arr0.length/13 - 5) * GameBG.ww );
        // gpro.startAi();
        // gpro.setUI();

        // gpro = this.getMonster();
        // gpro.setXY2DBox(GameBG.ww*7 , (GameBG.arr0.length/13 - 5) * GameBG.ww );
        // gpro.startAi();
        // gpro.setUI();

         gpro = this.getMonster();
         gpro.setXY2DBox(GameBG.ww * 7, (GameBG.arr0.length / 13 - 6) * GameBG.ww);
         gpro.startAi();
         gpro.setUI();
        Game.e0_ = gpro;


        Game.hero.setUI();
        Game.hero.startAi();
        Game.executor.start();
        Laya.stage.on(Laya.Event.KEY_DOWN , this ,this.kd );
    }

    kd(eve: KeyboardEvent): void {
        if(Game.executor.isRun){
            Game.executor.stop_();
        }else{
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
        if(Game.executor.isRun){
            ( <HeroAI>Game.hero.getGameAi() ).run = true; 
        }
        
        
        
    }

    up(eve: Event): void {        
        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.up);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
        if (Game.ro && Game.ro.parent) {
            Game.ro.reset();
            Game.ro.x = Laya.stage.width / 2;
            Game.ro.y = Laya.stage.height - 200;
        }
        Laya.stage.clearTimer(this, this.moves);

        if(Game.executor.isRun){
            ( <HeroAI>Game.hero.getGameAi() ).run = false; 
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