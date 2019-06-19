import { ui } from "./../ui/layaMaxUI";
import Scene3D = Laya.Scene3D;
import Camera = Laya.Camera;
import Sprite3D = Laya.Sprite3D;
import GameBG from "../game/GameBG";
import Rocker from "../game/GameRocker";
import GameObj from "../game/GameObj";
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
export default class GameUI extends ui.test.TestSceneUI {
    private scene3d:Scene3D;
    private camera3d:Camera;

    private hero:GameObj;
    private enemy:GameObj;

    private ro:Rocker;
    private bg:GameBG;
    private sp:Sprite3D;
    private sp2:Sprite3D;

    private translateA = new Laya.Vector3(-0.2, 0, 0);
    private translateD = new Laya.Vector3( 0.2, 0, 0);
    
    private box:Laya.MeshSprite3D;

    constructor() {
        super();
        var bg:GameBG = new GameBG();
        bg.drawR();
        Laya.stage.addChild(bg);
        this.bg = bg;
        //添加3D场景
        this.scene3d = Laya.stage.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        //添加照相机
        this.camera3d = (this.scene3d.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        this.camera3d.transform.translate(new Laya.Vector3(0, 0, 3));
        this.camera3d.transform.rotate(new Laya.Vector3(30, 0, 0), true, false);
        this.camera3d.orthographic = true;
        //正交投影垂直矩阵尺寸
        this.camera3d.orthographicVerticalSize = GameBG.orthographicVerticalSize;
        this.camera3d.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
        GameObj.gameCamera = this.camera3d;
        //Laya.Sprite3D.load("https://img.kuwan511.com/h5/LayaMonkey/LayaMonkey.lh",Laya.Handler.create(this,this.ok));
        Laya.Sprite3D.load("h5/toonbat1/toonbat1.lh",Laya.Handler.create(this,this.ok));
    }

    ok(sp:Laya.Sprite3D):void{
        this.hero = new GameObj(this.scene3d,sp);
        this.hero.setIsMy(true);
        this.hero.setGameScale(1);
        this.camera3d.transform.lookAt(this.hero.getSp().transform.position,new Laya.Vector3(0,1,0));
        this.ro = new Rocker();
		this.ro.x = Laya.stage.width/2;
		this.ro.y = Laya.stage.height - 200;        
		this.addChild(this.ro);		
		Laya.MouseManager.multiTouchEnabled = false;
        Laya.stage.on(Laya.Event.MOUSE_DOWN , this, this.md);

        this.enemy = new GameObj(this.scene3d,sp,true);
        GameObj.earr.push(this.enemy);

        //Laya.stage.frameLoop(1,this,this.ai);

        var box: Laya.MeshSprite3D = new Laya.MeshSprite3D(Laya.PrimitiveMesh.createBox(1, 1, 1));
        this.scene3d.addChild(box);
        //box.transform.rotate(new Laya.Vector3(0, 45, 0), false, false);
        this.box = box;

        var pos:Laya.Vector3 = new Laya.Vector3(GameBG.ww*2,GameBG.ww*1+GameBG.ww2,0);
        var pos2:Laya.Vector3 = new Laya.Vector3(0,0,0);
        GameObj.gameCamera.convertScreenCoordToOrthographicCoord(pos, pos2);
        this.box.transform.position = pos2;

        //var material: Laya.BlinnPhongMaterial = new Laya.BlinnPhongMaterial();
        var material = new Laya.UnlitMaterial();
        box.meshRenderer.material = material;
        Laya.Texture2D.load("res/layabox.png", Laya.Handler.create(null, function(tex:Laya.Texture2D) {
            material.albedoTexture = tex;

            //this._pos.y =  this._pos2.y + GameBG.gameBG.y;
            //console.log("this._pos.y " ,this._pos.y);
            //this._pos.x  = this._pos2.x;
            
            
        }));
    }

    md(eve:MouseEvent):void{	    
		Laya.stage.off(Laya.Event.MOUSE_DOWN , this, this.md);        
		Laya.stage.on(Laya.Event.MOUSE_UP , this, this.up);
		let xx:number = Laya.stage.mouseX;
		let yy:number = Laya.stage.mouseY;
		this.ro.x = xx;
		this.ro.y = yy;
		Laya.stage.addChild( this.ro );
        Laya.stage.frameLoop(1,this,this.moves);
        Laya.stage.clearTimer(this,this.ai);
	}

    up(eve:Event):void{
        Laya.stage.off(Laya.Event.MOUSE_UP , this, this.up);
        Laya.stage.on(Laya.Event.MOUSE_DOWN , this, this.md);
		if(this.ro && this.ro.parent){			
			this.ro.reset();
			this.ro.x = Laya.stage.width/2;
            this.ro.y = Laya.stage.height - 200;
            
            //this.hero.reset();
		}
        Laya.stage.clearTimer(this,this.moves);
        Laya.stage.frameOnce(0,this,this.ai);
    }
    
    moves():void{
		let xx:number = Laya.stage.mouseX;
		let yy:number = Laya.stage.mouseY;
		let n:number;
		this.ro.setSp0(xx,yy);		
		var speed:number = this.ro.getSpeed();
		if(speed>0){
            n = this.ro.getA3d();
            this.hero.rotation(n/Math.PI*180 +90);
            n = this.ro.getA();
            this.hero.move(n);
		}else{

        }
        this.enemy.update();		
    }


    ai():void{
        if(this.hero){
            this.hero.play("BiteAttack");
        }
    }

    /*
    ok_(sp:Laya.Sprite3D):void{
        //this.hero = new GameObj(this.scene3d,sp);
        this.sp = sp;
        sp.transform.localScale = new Laya.Vector3(0.5,0.5,0.5);
        this.scene3d.addChild(sp);
        this.camera3d.transform.lookAt(sp.transform.position,new Laya.Vector3(0,1,0));
        this.sp2 = Laya.Sprite3D.instantiate(this.sp,null,false);        
        this.scene3d.addChild(this.sp2);
        this.sp2.transform.translate(new Laya.Vector3(-2, 0, 0));
        Laya.timer.frameLoop(1, this, this.onKeyDown);    
    }

    onKeyDown() {
		// Laya.KeyBoardManager.hasKeyDown(87) && this.sp.transform.translate(this.translateW);//W
		// Laya.KeyBoardManager.hasKeyDown(83) && this.sp.transform.translate(this.translateS);//S
		Laya.KeyBoardManager.hasKeyDown(65) && this.sp.transform.translate(this.translateA);//A
        Laya.KeyBoardManager.hasKeyDown(68) && this.sp.transform.translate(this.translateD);//D
        Laya.KeyBoardManager.hasKeyDown(65) && this.sp2.transform.translate(this.translateA);//A
        Laya.KeyBoardManager.hasKeyDown(68) && this.sp2.transform.translate(this.translateD);//D
    }
    */
}