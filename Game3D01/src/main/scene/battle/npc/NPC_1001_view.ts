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
        this.on(Laya.Event.CLICK,this,this.onClick);

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
        let randAry:string[] = sysNpc.skillRandom.split(",");
        let rand:number = Math.floor(randAry.length * Math.random());
        this.selector.setResult(Number(randAry[rand]));
        setTimeout(() => {
            this.selector.play();
        }, 50);

        this.grid.update(sysNpc.skillId);
    }

    private onClick2(e:Laya.Event):void
    {
        let grid:SkillGrid = e.currentTarget as SkillGrid;
        Game.skillManager.addSkill(grid.sys);
        Game.bg.clearNpc();
        this.removeSelf();
    }

    private onClick(e:Laya.Event):void
    {
        let grid:SkillGrid = e.target as SkillGrid;
        let sys:SysSkill = grid.sys;
        let buff4002: SysBuff = App.tableManager.getDataByNameAndId(SysBuff.NAME, sys.skillEffect1);
        let changeValue:number = sys.id == 4003 ? buff4002.hpLimit : buff4002.addHp;
        Game.hero.addBlood(Math.floor(Game.hero.gamedata.maxhp * changeValue / 1000));

        Game.bg.clearNpc();
        this.removeSelf();
    }

    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}