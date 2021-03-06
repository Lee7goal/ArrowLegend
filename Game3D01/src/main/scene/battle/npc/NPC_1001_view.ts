import { ui } from "./../../../../ui/layaMaxUI";
import Game from "../../../../game/Game";
import { SkillSelector } from "../SelectNewSkill";
import SkillGrid from "../SkillGrid";
import SysSkill from "../../../sys/SysSkill";
import SysNpc from "../../../sys/SysNpc";
import App from "../../../../core/App";
import SysBuff from "../../../sys/SysBuff";
    export default class NPC_1001_view extends ui.test.tianshi_1UI {
    
    private selector:SkillSelector;
    private grid:SkillGrid;

    constructor() { 
        super(); 
        this.selector = new SkillSelector([1001,1002,2001,2003,2006,3001,3002,3005,4001]);
        this.selector.clickHandler = new Laya.Handler(this,this.onClick);
        this.box1.addChild(this.selector);

        this.grid = new SkillGrid();
        this.box2.addChild(this.grid);
        this.grid.on(Laya.Event.CLICK,this,this.onClick2);

        this.on(Laya.Event.DISPLAY,this,this.onDis);
    }

    private onDis():void
    {
        let sysNpc:SysNpc = App.tableManager.getDataByNameAndId(SysNpc.NAME,1001);
        this.selector.setResult(Game.skillManager.getRandomSkillByNpcId(1001));
        
        setTimeout(() => {
            this.selector.play();
        }, 50);

        this.grid.update(sysNpc.skillId);
    }

    private onClick2(e:Laya.Event):void
    {
        let grid:SkillGrid = e.currentTarget as SkillGrid;
        this.onClick(grid.sys);
    }

    private onClick(sys:SysSkill):void
    {
        if(!Game.hero.changeBlood(sys))
        {
            Game.skillManager.addSkill(sys);
        }

        Game.bg.clearNpc();
        this.removeSelf();
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}