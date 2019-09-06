import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import CookieKey from "../../../gameCookie/CookieKey";
import App from "../../../core/App";
    export default class PauseUI extends ui.test.battlestop2UI{
    constructor() { 
        super(); 
        this.btnHome.clickHandler = new Laya.Handler(this,this.onHome);
        this.btnSound.clickHandler = new Laya.Handler(this,this.onSound);
        this.btnPlay.clickHandler = new Laya.Handler(this,this.onBattle);
        this.btnMusic.clickHandler = new Laya.Handler(this,this.onMusic);
        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
            this.musicImg.skin = res.state == 1 ? "bg/zhanting_1.png" : "bg/zhanting_0.png";
        });

        Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
            this.soundImg.skin = res.state == 1 ? "bg/zhanting_1.png" : "bg/zhanting_0.png";
        });
    }

    private onSound():void
    {
        Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
            if(res.state == 1)
            {
                Game.cookie.setCookie(CookieKey.SOUND_SWITCH,{"state":0});
                this.soundImg.skin = "bg/zhanting_0.png";
                App.soundManager.setSoundVolume(0);
            }
            else
            {
                Game.cookie.setCookie(CookieKey.SOUND_SWITCH,{"state":1});
                this.soundImg.skin = "bg/zhanting_1.png";
                App.soundManager.setSoundVolume(1);
            }
        });
    }

    private onMusic():void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
            if(res.state == 1)
            {
                Game.cookie.setCookie(CookieKey.MUSIC_SWITCH,{"state":0});
                this.musicImg.skin = "bg/zhanting_0.png";
                App.soundManager.setMusicVolume(0);
            }
            else
            {
                Game.cookie.setCookie(CookieKey.MUSIC_SWITCH,{"state":1});
                this.musicImg.skin = "bg/zhanting_1.png";
                App.soundManager.setMusicVolume(1);
                Game.playBattleMusic();
            }
        });
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