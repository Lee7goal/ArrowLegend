import GameConfig from "./GameConfig";
import GameBG from "./game/GameBG";
import GameMain from "./main/GameMain";

class Main {
	constructor() {
		//根据IDE设置初始化引擎	
		if (Laya.Browser.window.wx) {
			var win = Laya.Browser.window.wx.getSystemInfoSync();
			GameBG.height = GameBG.width / win.windowWidth * win.windowHeight;
		}	
		if (window["Laya3D"]) Laya3D.init(GameBG.width, GameBG.height);
		else Laya.init(GameBG.width, GameBG.height, Laya["WebGL"]);
		Laya["Physics"] && Laya["Physics"].enable();
		Laya["DebugPanel"] && Laya["DebugPanel"].enable();
		//Laya.stage.scaleMode = GameConfig.scaleMode;
		//console.log(Laya.Stage.SCALE_FIXED_WIDTH);
		Laya.stage.bgColor = "#ffffff";
		Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_WIDTH;
		//Laya.stage.screenMode = GameConfig.screenMode;
		Laya.stage.screenMode = Laya.Stage.SCREEN_NONE;
		//兼容微信不支持加载scene后缀场景
		Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;

		//打开调试面板（通过IDE设置调试模式，或者url地址增加debug=true参数，均可打开调试面板）
		if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true") Laya.enableDebugPanel();
		if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"]) Laya["PhysicsDebugDraw"].enable();
		if (GameConfig.stat) Laya.Stat.show();
		Laya.alertGlobalError = true;

		if (Laya.Browser.window.wx) {
			Laya.URL.basePath = "https://img.kuwan511.com/arrowLegend05/";
		}
		

		//激活资源版本控制，version.json由IDE发布功能自动生成，如果没有也不影响后续流程
		Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
	}

	onVersionLoaded(): void {
		//激活大小图映射，加载小图的时候，如果发现小图在大图合集里面，则优先加载大图合集，而不是小图
		Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
	}

	onConfigLoaded(): void {
		
		Laya.loader.load(["res/atlas/main.atlas"],new Laya.Handler(this,this.onHandler));
		
	}

	private onHandler():void{
		console.log(Laya.loader.getRes('bg/rockerBall.png'));
		//加载IDE指定的场景
		new GameMain();
	}
}
//激活启动类
new Main();
