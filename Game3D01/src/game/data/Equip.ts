export default class Equip{
    constructor(){
        
    }

    public hp:number = 0;
    public atk:number = 0;
    public def:number = 0;
    public crit:number = 0;
    public moveSpeed:number = 0;
    public atkSpeed:number = 0;

    public initSkillId:number = 0;

    /**
     * 暴击效果
     */
    public critEffect:number = 0;
    /**
     * 闪避
     */
    public dodge:number = 0;

    public copy():Equip{
        let e = new Equip();
        e.hp = this.hp;
        e.atk = this.atk;
        e.def = this.def;
        e.crit = this.crit;
        e.moveSpeed = this.moveSpeed;
        e.atkSpeed = this.atkSpeed;
        e.critEffect = this.critEffect;
        e.initSkillId = this.initSkillId;
        return e;
    }

    public reset0():void{
        this.hp = 0;
        this.atk = 0;
        this.def = 0;
        this.crit = 0;
        this.moveSpeed = 0;
        this.atkSpeed = 0;
        this.critEffect = 0;
        this.initSkillId = 0;
    }
}