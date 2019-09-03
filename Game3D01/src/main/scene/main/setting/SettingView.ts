import { ui } from "../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import CookieKey from "../../../../gameCookie/CookieKey";
import App from "../../../../core/App";
    export default class SettingView extends ui.test.settingUI {
    
    constructor() { 
        super(); 
        this.yuyan.clickHandler = new Laya.Handler(this,this.onLanguage);
        this.yinxiao.clickHandler = new Laya.Handler(this,this.onSound);
        this.yinyue.clickHandler = new Laya.Handler(this,this.onMusic);

        this.ver.text = "VER:" + Game.resVer;

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
            this.musicImg.skin = res == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
        });

        Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
            this.soundImg.skin = res == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
        });
    }

    private onLanguage():void
    {

    }

    private onSound():void
    {
        Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
            if(res == 1)
            {
                res = 0;
            }
            else
            {
                res = 1;
            }
            Game.cookie.setCookie(CookieKey.SOUND_SWITCH,res);
            this.soundImg.skin = res == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
        });
    }

    private onMusic():void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
            if(res == 1)
            {
                res = 0;
            }
            else
            {
                res = 1;
            }
            Game.cookie.setCookie(CookieKey.MUSIC_SWITCH,res);
            this.musicImg.skin = res == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
            App.soundManager.setMusicVolume(res);
            Game.playMusic("menu.wav");
        });
    }
}