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
            this.musicImg.skin = res.state == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
            this.yinyue.skin = res.state == 1 ? "main/btn_lv.png" : "main/btn_hong.png";
        });

        Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
            this.soundImg.skin = res.state == 1 ? "shezhi/kai.png" : "shezhi/guan.png";
            this.yinxiao.skin = res.state == 1 ? "main/btn_lv.png" : "main/btn_hong.png";
        });
    }

    private onLanguage():void
    {

    }

    private onSound():void
    {
        Game.cookie.getCookie(CookieKey.SOUND_SWITCH, (res) => {
            if(res.state == 1)
            {
                Game.cookie.setCookie(CookieKey.SOUND_SWITCH,{"state":0});
                this.soundImg.skin = "shezhi/guan.png";
                App.soundManager.setSoundVolume(0);
                this.yinxiao.skin = "main/btn_hong.png";
            }
            else
            {
                Game.cookie.setCookie(CookieKey.SOUND_SWITCH,{"state":1});
                this.soundImg.skin = "shezhi/kai.png";
                App.soundManager.setSoundVolume(1);
                this.yinxiao.skin = "main/btn_lv.png";
            }
        });
    }

    private onMusic():void
    {
        Game.cookie.getCookie(CookieKey.MUSIC_SWITCH, (res) => {
            if(res.state == 1)
            {
                Game.cookie.setCookie(CookieKey.MUSIC_SWITCH,{"state":0});
                this.musicImg.skin = "shezhi/guan.png";
                App.soundManager.setMusicVolume(0);
                this.yinyue.skin = "main/btn_hong.png";
            }
            else
            {
                Game.cookie.setCookie(CookieKey.MUSIC_SWITCH,{"state":1});
                this.musicImg.skin = "shezhi/kai.png";
                App.soundManager.setMusicVolume(1);
                Game.playBgMusic();
                this.yinyue.skin = "main/btn_lv.png";
            }
        });
    }
}