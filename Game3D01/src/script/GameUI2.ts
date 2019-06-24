import { ui } from "./../ui/layaMaxUI";
import Game from "../game/Game";
import GameBG from "../game/GameBG";
export default class GameUI2 extends  ui.test.TestSceneUI {
    
    constructor() {
        super();
        
        var bg:GameBG = new GameBG();
        bg.drawR();
        bg.y = 1.5 * GameBG.ww;
        //bg.alpha = 0;
        Laya.stage.addChild(bg);
        Game.bg = bg;

        //添加3D场景
        var scene: Laya.Scene3D = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        scene.addChild(Game.sp3d);
        Game.scene3d = scene;

        var sp2d:Laya.Sprite = new Laya.Sprite();
        Laya.stage.addChild(sp2d);
        sp2d.graphics.drawLine(Laya.stage.width/2,0,Laya.stage.width/2,Laya.stage.height,"#ff0000");
        sp2d.graphics.drawLine(0,Laya.stage.height/2,Laya.stage.width,Laya.stage.height/2,"#ff0000");

        
       
        
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

        var box: Laya.Sprite3D;
        box = this.getBox();    
        box.transform.translate(new Laya.Vector3(0,0.5,0));

        box = this.getBox();    
        box.transform.translate(new Laya.Vector3(-1,0.5,0));

        box = this.getBox();    
        box.transform.translate(new Laya.Vector3(1,0.5,0));

        box = this.getBox();    
        box.transform.translate(new Laya.Vector3(0,0.5,-2));

        // box = Game.sp3d.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 0, 2))) as Laya.MeshSprite3D;
        // box.meshRenderer.material = material;    
        // box.transform.translate(new Laya.Vector3(0,0,-3));
        
        // for (let i = 0; i < 3; i++) {
        //     var box: Laya.MeshSprite3D = Game.sp3d.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 0, 2))) as Laya.MeshSprite3D;
        //     box.meshRenderer.material = material;    
        //     box.transform.translate(new Laya.Vector3(i*-1,1,0));
        // }

        // for (let i = 0; i < 3; i++) {
        //     var box: Laya.MeshSprite3D = Game.sp3d.addChild(new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 0, 2))) as Laya.MeshSprite3D;
        //     box.meshRenderer.material = material;    
        //     box.transform.translate(new Laya.Vector3(0,1,i*-2));
        // }
        //Laya.timer.frameLoop(1, this, this.onKeyDown); 
        Laya.Sprite3D.load("https://img.kuwan511.com/h5/LayaMonkey/LayaMonkey.lh",Laya.Handler.create(this,this.ok1));

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
        sp.transform.scale = new Laya.Vector3(0.5,0.5,0.5);
        sp.transform.translate(new Laya.Vector3(0, 0, 2));
        Game.hero = sp as Laya.Sprite3D;        
        Laya.stage.on(Laya.Event.KEY_DOWN,this,this.kd);
    }

    kd(k:Laya.Event):void{
        console.log("k : "+k.keyCode);        
        if(k.keyCode == 38){
            Game.hero.transform.translate(new Laya.Vector3(0,0,-0.2));
            Game.camera.transform.localPositionZ-=0.2
            Game.bg.y += 0.1*GameBG.ww
            
        }
        else if(k.keyCode == 40){
            Game.hero.transform.translate(new Laya.Vector3(0,0,+0.2));
            Game.camera.transform.localPositionZ+=0.2
            Game.bg.y -= 0.1*GameBG.ww
        }
        else if(k.keyCode == 37){
            Game.hero.transform.translate(new Laya.Vector3(-0.2,0,0));
        }
        else if(k.keyCode == 39){
            Game.hero.transform.translate(new Laya.Vector3(0.2,0,0));
        }
        
        
    }
}