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
export default class GameUI2 extends ui.test.TestSceneUI {

    constructor() {
        super();

        var bg: GameBG = new GameBG();

        //bg.y = 1.5 * GameBG.ww;
        //bg.alpha = 0;
        Laya.stage.addChild(bg);
        Game.bg = bg;
        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        scene.addChild(Game.layer3d);
        Game.scene3d = scene;

        //添加照相机
        var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        // camera.transform.translate(new Laya.Vector3(0, 10, 10));
        camera.transform.translate(new Laya.Vector3(0, 10, 10 * Math.sqrt(3)));
        //camera.transform.rotate(new Laya.Vector3(-90, 0, 0), true, false);
        camera.transform.rotate(new Laya.Vector3(-30, 0, 0), true, false);

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

        //屏幕中心线
        // var sp2d:Laya.Sprite = new Laya.Sprite();
        // Laya.stage.addChild(sp2d);
        // sp2d.graphics.drawLine(Laya.stage.width/2,0,Laya.stage.width/2,Laya.stage.height,"#ff0000");
        // sp2d.graphics.drawLine(0,Laya.stage.height/2,Laya.stage.width,Laya.stage.height/2,"#ff0000");

        var map0: GameMap0 = new GameMap0();
        map0.drawMap();
        // Laya.stage.addChild(map0);        
        Game.map0 = map0;
        Game.updateMap();
        this.heroUrl = "h5/ToonSkeletons/ToonSkeletons.lh";
        // this.heroUrl = "h5/hero/hero.lh";
        Laya.loader.create(["h5/ToonRockGolem/ToonSkeletons.lh", this.heroUrl, "h5/ArrowBlue/ToonSkeletons.lh", "h5/maozi/hero.lh", "h5/wall/wall.lh"], Laya.Handler.create(this, this.onComplete))

    }

    private heroUrl: string;

    getBox(): Laya.Sprite3D {
        if (Game.box == null) {
            Game.box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 2)) as Laya.MeshSprite3D;
        }
        var box: Laya.MeshSprite3D;
        box = Game.layer3d.addChild(Laya.Sprite3D.instantiate(Game.box)) as Laya.MeshSprite3D;
        box.meshRenderer.material = Game.material_blinn;
        return box;
    }

    getMonster(): GamePro {
        var sp = Laya.Sprite3D.instantiate(Game.e0_.sp3d);
        var gpro = new GamePro(GameProType.RockGolem_Blue);
        gpro.setSp3d(sp);
        gpro.setGameAi(new MonsterAI1(gpro));
        gpro.setGameMove(new PlaneGameMove());
        Game.map0.Eharr.push(gpro.hbox);
        Game.map0.addChild(gpro.sp2d);
        Game.layer3d.addChild(sp);
        return gpro;
    }

    onComplete(): void {
        //克隆墙的母体
        var aa = Laya.loader.getRes("h5/wall/wall.lh");
        Game.box = aa;

        let k: number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {
            for (let i = 0; i < GameBG.wnum + 1; i++) {
                //console.log(i,j);
                if (k < GameBG.arr0.length && (GridType.isWall(GameBG.arr0[k]) || (GameBG.arr0[k] == 1))) {
                    let v3 = GameBG.get3D(i, j);
                    let box:Laya.Sprite3D = Laya.Sprite3D.instantiate(Game.box);
                    box.transform.translate(v3);
                    Game.layer3d.addChild(box)
                }
                k++;
            }
        }

        Game.bg.drawR();

        let sp: Laya.Sprite3D = Laya.loader.getRes("h5/ToonRockGolem/ToonSkeletons.lh");
        //Game.layer3d.addChild(sp);        
        var gpro = new GamePro(GameProType.RockGolem_Blue);
        gpro.setSp3d(sp);
        Game.e0_ = gpro;



        sp = Laya.loader.getRes("h5/ArrowBlue/ToonSkeletons.lh");
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

        // let maozi = Laya.loader.getRes("h5/maozi/hero.lh");
        // Game.hero.addSprite3DToAvatarNode("joint11",maozi);


        Game.hero.setXY2DBox(GameBG.ww * 6, (GameBG.arr0.length / 13 - 1) * GameBG.ww);
        Game.bg.updateY();
        Game.map0.Hharr.push(Game.hero.hbox);

        gpro = this.getMonster();
        gpro.setXY2DBox(GameBG.ww*6 , (GameBG.arr0.length/13 - 5) * GameBG.ww );
        gpro.startAi();

        gpro = this.getMonster();
        gpro.setXY2DBox(GameBG.ww*7 , (GameBG.arr0.length/13 - 5) * GameBG.ww );
        gpro.startAi();

        gpro = this.getMonster();
        gpro.setXY2DBox(GameBG.ww * 7, (GameBG.arr0.length / 13 - 6) * GameBG.ww);
        gpro.startAi();
        Game.e0_ = gpro;
    }

    md(eve: MouseEvent): void {
        Game.hero.stopAi();
        Game.hero.play("Run");
        //Game.hero.rotation(Game.hero.face3d);
        Laya.stage.off(Laya.Event.MOUSE_DOWN, this, this.md);
        Laya.stage.on(Laya.Event.MOUSE_UP, this, this.up);
        let xx: number = Laya.stage.mouseX;
        let yy: number = Laya.stage.mouseY;
        Game.ro.x = xx;
        Game.ro.y = yy;
        Laya.stage.addChild(Game.ro);
        Laya.stage.frameLoop(1, this, this.moves);
        //Laya.stage.clearTimer(this,this.ai);
    }

    up(eve: Event): void {
        Game.hero.play("Idle");
        var a: number = GameHitBox.faceTo3D(Game.hero.hbox, Game.e0_.hbox);
        Game.hero.rotation(a);
        //this.heron = GameHitBox.faceTo(Game.hero.hbox , Game.e0.hbox);

        Laya.stage.off(Laya.Event.MOUSE_UP, this, this.up);
        Laya.stage.on(Laya.Event.MOUSE_DOWN, this, this.md);
        if (Game.ro && Game.ro.parent) {
            Game.ro.reset();
            Game.ro.x = Laya.stage.width / 2;
            Game.ro.y = Laya.stage.height - 200;

            //this.hero.reset();
        }
        Laya.stage.clearTimer(this, this.moves);
        Game.hero.startAi();
        Game.map0.drawBallistic(Game.hero.face2d);
        //Laya.stage.frameOnce(0,this,this.ai);


        // //bo.setGameMove(new BulletGameMove(5,bo.face2d,bo));
        // bo.startAi();
    }

    public move2d(n: number): void {
        Game.hero.move2D(n);
        Game.bg.updateY();
    }

    moves(): void {
        let xx: number = Laya.stage.mouseX;
        let yy: number = Laya.stage.mouseY;
        let n: number;
        Game.ro.setSp0(xx, yy);
        var speed: number = Game.ro.getSpeed();
        n = Game.ro.getA3d();
        if (speed > 0) {
            Game.hero.rotation(n);
            this.move2d(Game.ro.getA());
        } else {

        }
    }
}