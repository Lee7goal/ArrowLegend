import App from "../../core/App";

export default class SysSkill{
    static NAME:string = 'sys_roleskill.txt';
    constructor() { }

    id:number = 0;
    skillName:string = '';
    skillInfo:string = '';
    skillType:number = 0;
    triggerComparison:number = 0;
    skilltarget:number = 0;
    skillcondition:string = '';
    damagePercent:number = 0;
    skillEffect1:number = 0;

    upperLimit:number = 0;
    curTimes:number = 0;

    reset():void
    {
        let ary:SysSkill[] = App.tableManager.getTable(SysSkill.NAME);
        for(let i = 0; i < ary.length; i++)
        {
            ary[i].curTimes = 0;
        }
    }
}