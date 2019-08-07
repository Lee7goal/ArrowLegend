import SkillData from "./data/SkillData";

export default class PlayerSkillManager {
    /**已经获得技能 */
    private getedDic: any = {};
    constructor() { }

    addSkill(data: SkillData): void {
        this.getedDic[data.skillId] = data;
    }

    getSkills(): SkillData[]  {
        let ary: SkillData[] = [];
        for (let key in this.getedDic)  {
            ary.push(this.getedDic[key]);
        }
        return ary;
    }

    resetSkill(): void  {
        this.getedDic = {};
    }
}