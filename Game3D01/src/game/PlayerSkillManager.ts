
import SysSkill from "../main/sys/SysSkill";

export default class PlayerSkillManager {
    /**已经获得技能 */
    public skillList: SysSkill[] = [];
    constructor() { }

    addSkill(data:SysSkill): void {
        this.skillList.push(data);
    }

    isHas(id:number):SysSkill
    {
        for(let i = 0 ; i < this.skillList.length; i++)
        {
            if(this.skillList[i].id == id)
            {
                return this.skillList[i];
            }
        }
        return null;
    }
}