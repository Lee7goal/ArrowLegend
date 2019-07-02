import { ui } from "./../ui/layaMaxUI";
import Game from "../game/Game";
import GameBG from "../game/GameBG";
import Rocker from "../game/GameRocker";
import GameMap0 from "../game/GameMap0";
import GameHitBox from "../game/GameHitBox";
import GamePro from "../game/GamePro";
import { HeroGameMove, SimpleGameMove, ArrowGameMove } from "../game/GameMove";
import { HeroAI, HeroArrowAI } from "../game/GameAI";
import GridType from "../game/bg/GridType";
export default class GameUI2 extends  ui.test.TestSceneUI {

    constructor() {
        super();
        
        var bg:GameBG = new GameBG();
       
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
        camera.transform.translate(new Laya.Vector3(0, 10, 10*Math.sqrt(3) ));
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
		Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function(tex:Laya.Texture2D) {
				material.albedoTexture = tex;
        }));
        
        let k:number = 0;
        for (let j = 0; j < GameBG.hnum; j++) {            
            for (let i = 0; i < GameBG.wnum+1; i++) {                
                //console.log(i,j);
                if( k < GameBG.arr0.length && GridType.isWall(GameBG.arr0[k])){
                    let v3 = GameBG.get3D(i,j);
                    let box = this.getBox();    
                    box.transform.translate(v3);
                }
                k++;
            }
        }

        //屏幕中心线
        // var sp2d:Laya.Sprite = new Laya.Sprite();
        // Laya.stage.addChild(sp2d);
        // sp2d.graphics.drawLine(Laya.stage.width/2,0,Laya.stage.width/2,Laya.stage.height,"#ff0000");
        // sp2d.graphics.drawLine(0,Laya.stage.height/2,Laya.stage.width,Laya.stage.height/2,"#ff0000");

        var map0:GameMap0 = new GameMap0();
        map0.drawMap();
        Laya.stage.addChild(map0);        
        Game.map0 = map0;
        Game.updateMap();
        
        //Laya.Sprite3D.load("https://img.kuwan511.com/h5/LayaMonkey/LayaMonkey.lh",Laya.Handler.create(this,this.ok1));
       Laya.Sprite3D.load("h5/ToonRockGolem/ToonSkeletons.lh",Laya.Handler.create(this,this.ok2));
       
    }

    getBox():Laya.Sprite3D{        
        if(Game.box==null){
            Game.box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 2)) as Laya.MeshSprite3D;            
        }
        var box:Laya.MeshSprite3D;
        box = Game.layer3d.addChild(Laya.Sprite3D.instantiate(Game.box)) as Laya.MeshSprite3D;        
        box.meshRenderer.material = Game.material_blinn;
        return box;
    }

    

    ok3(sp:Laya.Sprite3D):void{  
        Game.layer3d.addChild(sp);
        var gpro = new GamePro();
        gpro.setSp3d(sp);
        Game.a0 = gpro;
        Laya.Sprite3D.load("h5/ToonSkeletons/ToonSkeletons.lh",Laya.Handler.create(this,this.ok1));//ToonSkeletons
    }

    ok2(sp:Laya.Sprite3D):void{  
        Game.bg.drawR();
        Game.layer3d.addChild(sp);
        var gpro = new GamePro();
        gpro.setSp3d(sp);               
        gpro.play("Idle");
        Game.e0 = gpro;
        Game.map0.Eharr.push(gpro.hbox);
        Game.map0.addChild(Game.e0.sp2d);
        //Game.e0.startAi();
        //Laya.Sprite3D.load("h5/ToonDeathKnight/ToonDeathKnight.lh",Laya.Handler.create(this,this.ok1));//ToonSkeletons
        //Laya.Sprite3D.load("h5/ToonSkeletons/ToonSkeletons.lh",Laya.Handler.create(this,this.ok1));//ToonSkeletons
        Laya.Sprite3D.load("h5/ArrowBlue/ToonSkeletons.lh",Laya.Handler.create(this,this.ok3));
    }

    ok1(sp:Laya.Sprite3D):void{        
        //得到原始Sprite3D
        //this.sp3d = sp;        
        Game.layer3d.addChild(sp);
        //sp.transform.scale = new Laya.Vector3(1.5,1.5,1.5);
        //sp.transform.translate(new Laya.Vector3(0, 0, 2));
        Game.hero = new GamePro();
        Game.hero.setSp3d( sp as Laya.Sprite3D );
        //Game.hero.transform.localPositionY = 2; 
        //Laya.stage.on(Laya.Event.KEY_DOWN,this,this.kd);
        Game.ro = new Rocker();
		Game.ro.x = Laya.stage.width/2;
		Game.ro.y = Laya.stage.height - 200;        
		this.addChild(Game.ro);		
		Laya.MouseManager.multiTouchEnabled = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN , this, this.md);
        Game.hero.play("Idle");
        Game.map0.addChild(Game.hero.sp2d);
        Game.hero.setGameMove(new HeroGameMove());
        Game.hero.setGameAi(new HeroAI());

        Game.e0.setXY2DBox(GameBG.ww*6 , (GameBG.arr0.length/13 - 5) * GameBG.ww );
        Game.hero.setXY2DBox(GameBG.ww*6 , (GameBG.arr0.length/13 - 1) * GameBG.ww );
        Game.bg.updateY();

        //Game.hero.on(Game.Event_Short,this,this.short)
    }

    

    md(eve:MouseEvent):void{
        Game.hero.stopAi();        
        Game.hero.play("Run");
        //Game.hero.rotation(Game.hero.face3d);
		Laya.stage.off(Laya.Event.MOUSE_DOWN , this, this.md);        
		Laya.stage.on(Laya.Event.MOUSE_UP , this, this.up);
		let xx:number = Laya.stage.mouseX;
		let yy:number = Laya.stage.mouseY;
		Game.ro.x = xx;
		Game.ro.y = yy;
		Laya.stage.addChild( Game.ro );
        Laya.stage.frameLoop(1,this,this.moves);
        //Laya.stage.clearTimer(this,this.ai);
    }
    
    up(eve:Event):void{
        Game.hero.play("Idle");
        var a:number = GameHitBox.faceTo3D(Game.hero.hbox ,  Game.e0.hbox);
        Game.hero.rotation(a);
        //this.heron = GameHitBox.faceTo(Game.hero.hbox , Game.e0.hbox);

        Laya.stage.off(Laya.Event.MOUSE_UP , this, this.up);
        Laya.stage.on(Laya.Event.MOUSE_DOWN , this, this.md);
		if(Game.ro && Game.ro.parent){			
			Game.ro.reset();
			Game.ro.x = Laya.stage.width/2;
            Game.ro.y = Laya.stage.height - 200;
            
            //this.hero.reset();
		}
        Laya.stage.clearTimer(this,this.moves);
        Game.hero.startAi();
        Game.map0.drawBallistic(Game.hero.face2d);
        //Laya.stage.frameOnce(0,this,this.ai);
        
        
        // //bo.setGameMove(new BulletGameMove(5,bo.face2d,bo));
        // bo.startAi();
    }

    public move2d(n:number):void{
        Game.hero.move2D(n);
        Game.bg.updateY();
    }

    moves():void{
		let xx:number = Laya.stage.mouseX;
		let yy:number = Laya.stage.mouseY;
		let n:number;
		Game.ro.setSp0(xx,yy);		
        var speed:number = Game.ro.getSpeed();
        n = Game.ro.getA3d();        
		if(speed>0){         
            Game.hero.rotation(n);   
            this.move2d(Game.ro.getA());
		}else{

        }
    }

    // kd(k:Laya.Event):void{
    //     console.log("k : "+k.keyCode);        
    //     if(k.keyCode == 38){
    //         Game.hero.transform.translate(new Laya.Vector3(0,0,-0.2));
    //         Game.camera.transform.localPositionZ-=0.2;
    //         Game.bg.y += 0.1*GameBG.ww;
            
    //     }
    //     else if(k.keyCode == 40){
    //         Game.hero.transform.translate(new Laya.Vector3(0,0,+0.2));
    //         Game.camera.transform.localPositionZ+=0.2;
    //         Game.bg.y -= 0.1*GameBG.ww;
    //     }
    //     else if(k.keyCode == 37){
    //         Game.hero.transform.translate(new Laya.Vector3(-0.2,0,0));
    //     }
    //     else if(k.keyCode == 39){
    //         Game.hero.transform.translate(new Laya.Vector3(0.2,0,0));
    //     }        
    // }
}