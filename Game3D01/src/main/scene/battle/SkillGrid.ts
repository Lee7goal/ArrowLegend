import { ui } from "./../../../ui/layaMaxUI";
import SysSkill from "../../sys/SysSkill";
import App from "../../../core/App";
export default class SkillGrid extends ui.test.SkillGridUI {
    public sys:SysSkill;
    private handler:Laya.Handler;
    constructor(handler:Laya.Handler) { 
        super();
        this.handler = handler;
        this.imgBox.addChild(this.img);
        this.imgBox.on(Laya.Event.CLICK,this,this.onClick);
    }

    private onClick():void
    {
        this.handler && this.handler.runWith(this.sys);
    }

    update(skillId:number):void
    {
        this.txt.text = "****";
        this.shuoming.text = "****";
        // let t:Laya.Texture = Laya.loader.getRes('');
        this.img.skin = "main/kawen.png";

        Laya.Tween.to(this.parent,{scaleX:0.1},150,null,new Laya.Handler(this,this.onFan,[skillId]));
    }

    private onFan(skillId:number):void
    {
        this.sys = App.tableManager.getDataByNameAndId(SysSkill.NAME,skillId);
        this.txt.text = this.sys.skillName;
        this.shuoming.text = this.sys.skillInfo;
        this.img.skin = 'icons/skill/' + this.sys.id + ".jpg";

        Laya.Tween.to(this.parent,{scaleX:1},150);
    }
}