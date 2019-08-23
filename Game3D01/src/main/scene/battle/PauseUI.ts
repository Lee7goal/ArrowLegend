import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
    export default class PauseUI extends ui.test.battlestop2UI{
    constructor() { 
        super(); 
        this.btnHome.clickHandler = new Laya.Handler(this,this.onHome);
        this.btnSound.clickHandler = new Laya.Handler(this,this.onSound);
        this.btnPlay.clickHandler = new Laya.Handler(this,this.onBattle);
    }

    private onHome():void
    {
        Game.alert.onShow("确定返回主页吗?",new Laya.Handler(this,this.onGo),null,"本局将不会产生任何收益。")
    }

    private onGo():void
    {
        Game.addCoins = 0;
        Game.showMain();
        this.removeSelf();
    }

    private onSound():void
    {

    }

    private onBattle():void
    {
        this.removeSelf();
        Game.executor.start();
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}