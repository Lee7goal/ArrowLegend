import { ui } from "./../../../ui/layaMaxUI";
import SysSkill from "../../sys/SysSkill";
import App from "../../../core/App";
export default class SkillGrid extends ui.test.SkillGridUI {

    private img:Laya.Image = new Laya.Image();
    public sys:SysSkill;
    constructor() { 
        super();
        this.imgBox.addChild(this.img);
    }

    update(skillId:number):void
    {
        this.sys = App.tableManager.getDataByNameAndId(SysSkill.NAME,skillId);
        this.txt.text = this.sys.skillName;
        let t:Laya.Texture = Laya.loader.getRes('icons/skill/' + this.sys.id + ".jpg");
        this.img.texture = t;
    }
}