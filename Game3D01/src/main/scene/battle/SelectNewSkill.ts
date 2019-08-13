import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import SkillGrid from "./SkillGrid";
import SysSkill from "../../sys/SysSkill";
import App from "../../../core/App";
    export default class SelectNewSkill extends ui.test.battlestopUI {
    
    private grids:SkillSelector[] = [];
    private ids:number[][] = [
                            [1001,1002,2001,2003,2006,3001,3002,3005,4001],
                            [1001,1002,2001,2003,2006,3001,3002,3005,4001],
                            [1001,1002,2001,2003,2006,3001,3002,3005,4001]
    ];
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);

        for(let i = 0; i < 3; i++)
        {
            let selector = new SkillSelector(this.ids[i]);
            selector.clickHandler = new Laya.Handler(this,this.onClick);
            this.viewBox.addChild(selector);
            selector.pos(this.box.x + 200 * i,this.box.y);
            this.grids.push(selector);
        }
    }

    private onClick(sys:SysSkill):void
    {
        Game.skillManager.addSkill(sys);
        this.removeSelf();
    }

    private onDis():void
    {
        this.baioti.text = "本次冒险升到了" + Game.hero.playerData.level + "级";

        let ary:SysSkill[] = App.tableManager.getTable(SysSkill.NAME);
        for(let i = 0; i < 3; i++)
        {
            let selector = this.grids[i];
            let rand:number = Math.floor(ary.length * Math.random());
            selector.setResult(ary[rand].id);
            // selector.setResult(3004);

            setTimeout(() => {
                selector.play();
            }, i * 50);
        }
    }


    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}

export class SkillSelector extends Laya.Box
{
    private _content:Laya.Box = new Laya.Box();
    private gridList:SkillGrid[] = [];
    public clickHandler:Laya.Handler;
    constructor(ids:number[]){
        super();
        this.addChild(this._content);
        for(let i = 0; i < 9; i++)
        {
            let grid:SkillGrid = new SkillGrid();
            this._content.addChild(grid);
            grid.update(ids[i]);
            grid.y = 190 * i;
            this.gridList.push(grid);
            if(i == 8)
            {
                grid.on(Laya.Event.CLICK,this,this.onClick);
            }
        }
        this.scrollRect = new Laya.Rectangle(0,0,160,190);
    }

    private onClick(e:Laya.Event):void
    {
        let grid:SkillGrid = e.currentTarget as SkillGrid;
        this.clickHandler && this.clickHandler.runWith(grid.sys);
    }

    setResult(id:number):void
    {
        this.gridList[8].update(id);
        this._content.y = 0;
    }

    play():void
    {
        Laya.Tween.to(this._content,{y: -8 * 190},800,Laya.Ease.circOut,null,300);
    }
}