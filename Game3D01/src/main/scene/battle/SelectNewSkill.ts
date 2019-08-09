import { ui } from "./../../../ui/layaMaxUI";
import Game from "../../../game/Game";
import SkillGrid from "./SkillGrid";
    export default class SelectNewSkill extends ui.test.battlestopUI {
    
    private grids:SkillGrid[];
    private ids:number[] = [1001,1002,1003];
    constructor() { 
        super(); 
        this.on(Laya.Event.DISPLAY,this,this.onDis);


        for(let i = 0; i < 3; i++)
        {
            let grid1 = new SkillGrid();
            this.viewBox.addChild(grid1);
            grid1.update(this.ids[i]);
            grid1.pos(this.box.x + 200 * i,this.box.y);
            grid1.on(Laya.Event.CLICK,this,this.onClick);
        }
    }

    private onClick(e:Laya.Event):void
    {
        let grid:SkillGrid = e.currentTarget as SkillGrid;
        this.removeSelf();
    }

    private onDis():void
    {
        this.baioti.text = "本次冒险升到了" + Game.hero.playerData.level + "级";
    }


    removeSelf():Laya.Node
    {
        Game.state = 0;
        return super.removeSelf();
    }
}