import { ui } from "./../ui/layaMaxUI";
import Game from "../game/Game";
import GameBG from "../game/GameBG";
import Rocker from "../game/GameRocker";
import GameMap0 from "../game/GameMap0";
export default class GameUI2 extends  ui.test.TestSceneUI {

    
    
    constructor() {
        super();
        
        var bg:GameBG = new GameBG();
        bg.drawR();
        //bg.y = 1.5 * GameBG.ww;
        //bg.alpha = 0;
        Laya.stage.addChild(bg);
        Game.bg = bg;

        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        scene.addChild(Game.sp3d);
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
                if( k < GameBG.arr0.length && GameBG.arr0[k]>=1){
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
        Laya.Sprite3D.load("h5/ToonDeathKnight/ToonDeathKnight.lh",Laya.Handler.create(this,this.ok1));
        //Laya.Sprite3D.load("h5/game1/game1.lh",Laya.Handler.create(this,this.ok1));
    }

    getBox():Laya.Sprite3D{        
        if(Game.box==null){
            Game.box = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 2)) as Laya.MeshSprite3D;            
        }
        var box:Laya.MeshSprite3D;
        box = Game.sp3d.addChild(Laya.Sprite3D.instantiate(Game.box)) as Laya.MeshSprite3D;        
        box.meshRenderer.material = Game.material_blinn;
        return box;
    }

    ok1(sp:Laya.Sprite3D):void{        
        //得到原始Sprite3D
        //this.sp3d = sp;        
        Game.sp3d.addChild(sp);
        sp.transform.scale = new Laya.Vector3(1.5,1.5,1.5);
        //sp.transform.translate(new Laya.Vector3(0, 0, 2));
        Game.hero = sp as Laya.Sprite3D;
        //Game.hero.transform.localPositionY = 2; 
        //Laya.stage.on(Laya.Event.KEY_DOWN,this,this.kd);
        Game.ro = new Rocker();
		Game.ro.x = Laya.stage.width/2;
		Game.ro.y = Laya.stage.height - 200;        
		this.addChild(Game.ro);		
		Laya.MouseManager.multiTouchEnabled = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN , this, this.md);

        
        var aniSprite3d:Laya.Sprite3D = Game.hero.getChildAt(0) as Laya.Sprite3D;       
        Game.ani = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;        
        Game.ani.play("Idle");
    }

    md(eve:MouseEvent):void{
        Game.ani.play("Run");	    
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
        Game.ani.play("Idle");
        Laya.stage.off(Laya.Event.MOUSE_UP , this, this.up);
        Laya.stage.on(Laya.Event.MOUSE_DOWN , this, this.md);
		if(Game.ro && Game.ro.parent){			
			Game.ro.reset();
			Game.ro.x = Laya.stage.width/2;
            Game.ro.y = Laya.stage.height - 200;
            
            //this.hero.reset();
		}
        Laya.stage.clearTimer(this,this.moves);
        Game.map0.drawBallistic(this.heron);
        //Laya.stage.frameOnce(0,this,this.ai);
    }

    speed:number = 5;
    _pos2:Laya.Vector3 = new Laya.Vector3(0,0,0);
    heron:number = 0;
    
    public move2d(n:number):void{
        this.heron = n;
        //2D移动计算
        var vx:number = this.speed * Math.cos(n);
        var vz:number = this.speed * Math.sin(n);

        if( Game.map0.chechHit(vx,vz) ){
            if( vz!=0 && Game.map0.chechHit(vx,0) ){
                vx = 0;
                vz = (vz<0?-1:1) * this.speed;
            }
            if( vx!=0 && Game.map0.chechHit(0,vz) ){
                vz = 0;
                vx = (vx<0?-1:1) * this.speed;
            }
            if( Game.map0.chechHit(vx,vz) ){
                return;
            }
        }

        var dx:number = this._pos2.x + vx;
        var dz:number = this._pos2.z + vz;

        // if(dx>=Laya.stage.width*-0.5+GameBG.mw2+GameBG.ww2 && dx<Laya.stage.width*0.5-GameBG.mw2-GameBG.ww2){
        //     this._pos2.x = dx;
        // }
        // if(dz>=Game.bg.getBgh()*-0.5+GameBG.ww+GameBG.mw2 && dz<Game.bg.getBgh()*0.5-GameBG.ww-GameBG.mw2){
        //     this._pos2.z = dz;
        // }
        this._pos2.x = dx;
        this._pos2.z = dz;

        //2D转3D坐标 给主角模型
        Game.hero.transform.localPositionX = this._pos2.x / GameBG.ww;
        Game.hero.transform.localPositionZ = this._pos2.z * 2 / GameBG.ww;

        var bgy:number = GameBG.cy - this._pos2.z;
        if(bgy<=0 && bgy>=Laya.stage.height-Game.bg.getBgh()){
            //移动2D背景板
            Game.bg.y = bgy;
            //摄像机跟随主角
            Game.camera.transform.localPositionZ = Game.sqrt3 + Game.hero.transform.localPositionZ;
            Game.updateMap();
        }
        Game.map0.updateMy(this._pos2);
    }

    moves():void{
		let xx:number = Laya.stage.mouseX;
		let yy:number = Laya.stage.mouseY;
		let n:number;
		Game.ro.setSp0(xx,yy);		
        var speed:number = Game.ro.getSpeed();
        n = Game.ro.getA3d();            
        Game.hero.transform.localRotationEulerY = ((n+Math.PI/2)/Math.PI*180);
		if(speed>0){            
            this.move2d(Game.ro.getA());
		}else{

        }
    }

    kd(k:Laya.Event):void{
        console.log("k : "+k.keyCode);        
        if(k.keyCode == 38){
            Game.hero.transform.translate(new Laya.Vector3(0,0,-0.2));
            Game.camera.transform.localPositionZ-=0.2;
            Game.bg.y += 0.1*GameBG.ww;
            
        }
        else if(k.keyCode == 40){
            Game.hero.transform.translate(new Laya.Vector3(0,0,+0.2));
            Game.camera.transform.localPositionZ+=0.2;
            Game.bg.y -= 0.1*GameBG.ww;
        }
        else if(k.keyCode == 37){
            Game.hero.transform.translate(new Laya.Vector3(-0.2,0,0));
        }
        else if(k.keyCode == 39){
            Game.hero.transform.translate(new Laya.Vector3(0.2,0,0));
        }        
    }
}