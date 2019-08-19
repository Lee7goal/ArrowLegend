import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import { SkillSelector } from "../SelectNewSkill";
import SysNpc from "../../../sys/SysNpc";
import App from "../../../../core/App";
export default class NPC_1002_view extends ui.test.mogui_1UI {
    private selector:SkillSelector;
    constructor() {
        super();
        this.btn_hong.clickHandler = new Laya.Handler(this,this.onReject);
        this.btn_lv.clickHandler = new Laya.Handler(this,this.onEgree);

        this.selector = new SkillSelector([1001,1002,2001,2003,2006,3001,3002,3005,4001]);
        this.skillBox.addChild(this.selector);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        let hp:number = Math.floor(Game.hero.gamedata.maxhp * 0.2);
        this.txt.text  = "失去" +  hp + "生命上限";
        

        this.selector.setResult(Game.skillManager.getRandomSkillByNpcId(1002));
        this.tisheng.text = this.selector.getCurSys().skillName;
        
        setTimeout(() => {
            this.selector.play();
        }, 50);
    }

    private onReject():void
    {
        this.removeSelf();
    }

    private onEgree():void
    {
        Game.hero.changeMaxBlood();
        Game.skillManager.addSkill(this.selector.getCurSys());
        this.removeSelf();
    }

    private onClick(): void  {
        this.removeSelf();
    }

    removeSelf(): Laya.Node  {
        Game.state = 0;
        Game.bg.clearNpc();
        return super.removeSelf();
    }
}