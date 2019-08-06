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
        this.removeSelf();
        Game.battleLoader.index = -1;
        Game.hero.reset();
        Game.battleLoader.destroyMonsterRes();
        Game.scenneM.showMain();
    }

    private onSound():void
    {

    }


    private onBattle():void
    {
        this.removeSelf();
        Game.executor.start();
    }
}