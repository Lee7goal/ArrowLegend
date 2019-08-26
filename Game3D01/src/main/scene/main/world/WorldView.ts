import { ui } from "../../../../ui/layaMaxUI";
import GameBG from "../../../../game/GameBG";
import Game from "../../../../game/Game";
import GameEvent from "./../../../GameEvent";
import SysChapter from "../../../sys/SysChapter";
import App from "../../../../core/App";
import Session from "../../../Session";
import SysMap from "../../../sys/SysMap";
import MainUI from "../MainUI";
import GameCameraNum from "../../../../game/GameCameraNum";
    export default class WorldView extends ui.test.worldUI {
    private _gameScene:Laya.Scene3D;
    constructor() { 
        super();
        this.height = GameBG.height;
        this.btn_start.clickHandler = new Laya.Handler(this,this.onStart); 
        this.jinbishu.value = "" + MainUI.xiaohao;

        // this.layer3d = new Laya.Sprite3D();
        // //添加3D场景
        // var scene: Laya.Scene3D = this.addChild(new Laya.Scene3D()) as Laya.Scene3D;
        // scene.addChild(this.layer3d);
        // //添加照相机
        // var camera: Laya.Camera = (scene.addChild(new Laya.Camera(0, 0.1, 100))) as Laya.Camera;
        // let cameraCN:GameCameraNum = new GameCameraNum(-45, 10);
        // camera.transform.translate(new Laya.Vector3(0, cameraCN.z));
        // camera.transform.rotate(new Laya.Vector3(cameraCN.a, 0, 0), true, false);

        // camera.orthographic = true;
        // Game.camera = camera;
        // //正交投影垂直矩阵尺寸
        // GameBG.orthographicVerticalSize = GameBG.wnum * Laya.stage.height / Laya.stage.width;
        // camera.orthographicVerticalSize = GameBG.orthographicVerticalSize;
        // camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
        // //添加方向光
        // var directionLight: Laya.DirectionLight = scene.addChild(new Laya.DirectionLight()) as Laya.DirectionLight;
        // directionLight.color = new Laya.Vector3(0.6, 0.6, 0.6);
        // directionLight.transform.worldMatrix.setForward(new Laya.Vector3(1, -1, 0));

        //创建场景
		this._gameScene = new Laya.Scene3D();
		this.box.addChild(this._gameScene);
		
		//创建相机
		let camera = new Laya.Camera(0, 0.1, 100);
		this._gameScene.addChild(camera);
		camera.transform.translate(new Laya.Vector3(0, 0.5, 1));
        camera.transform.rotate(new Laya.Vector3(-15, 0, 0), true, false);
        camera.clearFlag = Laya.BaseCamera.CLEARFLAG_DEPTHONLY;
		
		//添加光照
		let directionLight = new Laya.DirectionLight();
		this._gameScene.addChild(directionLight);
		directionLight.color = new Laya.Vector3(1, 1, 1);
        directionLight.transform.rotate(new Laya.Vector3( -3.14 / 3, 0, 0));
        
        this.box.addChild(this.btn_start);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    onComplete1() {
        let dude:Laya.Sprite3D = this._gameScene.addChild(Laya.Loader.getRes("h5/heroview/hero.lh")) as Laya.Sprite3D;
		let scale = new Laya.Vector3(0.3, 0.3, 0.3);
        dude.transform.localScale = scale;
        dude.transform.localRotationEulerY = 0;
        let aniSprite3d = dude.getChildAt(0) as Laya.Sprite3D;
        if (aniSprite3d) {
            let ani_:Laya.Animator = aniSprite3d.getComponent(Laya.Animator) as Laya.Animator;
            ani_.speed = 0.5;
            ani_.play("Idle");
        }
	}

    private layer3d: Laya.Sprite3D 
    private onDis():void{
        let sys:SysChapter = App.tableManager.getDataByNameAndId(SysChapter.NAME,Session.homeData.chapterId);
        this.baioti.text = Session.homeData.chapterId + "." + sys.name;
        this.biaoti2.text = this.baioti.text;
        this.zuigao.text = "最高层数:" + Session.homeData.mapIndex + "/" + SysMap.getTotal(Session.homeData.chapterId);

        this.baioti.visible = false;
        this.biaoti2.visible = false;
        this.zuigao.visible = false;

        //预加载资源
        Laya.loader.create("h5/heroview/hero.lh", Laya.Handler.create(this, this.onComplete1));
    }

    private onStart():void
    {
        Laya.stage.event(GameEvent.START_BATTLE);
    }
}