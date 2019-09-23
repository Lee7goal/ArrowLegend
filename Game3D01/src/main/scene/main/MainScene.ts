import { ui } from "../../../ui/layaMaxUI";
import MainUI from "./MainUI";
import MainView from "./MainView";
import WorldView from "./world/WorldView";
import GameBG from "../../../game/GameBG";
import GameEvent from "../../GameEvent";
import Game from "../../../game/Game";
import App from "../../../core/App";

export default class MainScene extends Laya.Sprite{
    public mainUI:MainUI;
    private mainView:MainView;

    public coinClip:Laya.FontClip;
    
    private verLabel:Laya.Label = new Laya.Label();
    constructor() { 
        super(); 
        this.height = GameBG.height;
        this.initUI();
    }

    private initUI():void{
        this.mainView = new MainView();
        this.mainUI = new MainUI();
        this.addChild(this.mainView);
        this.addChild(this.mainUI);

        this.coinClip = this.mainUI.topUI.coinClip;

        this.addChild(this.verLabel);
        this.verLabel.fontSize = 16;
        this.verLabel.color = "#ffffff";
        // this.verLabel.bold = true;


        Laya.stage.on("switchView",this,this.switchView);
        this.switchView();

        Laya.stage.on(GameEvent.START_BATTLE,this,this.onStartBattle);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis(e):void
    {
        // Game.battleLoader.init();
    }

    private onStartBattle():void
    {
        if(Game.isStartBattle)
        {
            return;
        }
        Game.isStartBattle = true;
        this.mainUI.appEnergy();
    }

    private switchView():void{
        this.mainView.selectIndex = this.mainUI.selectIndex;
    }
}