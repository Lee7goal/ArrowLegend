export default class PlayerData{
    constructor() {}

    exp:number = 0;
    level:number;
    lastLevel:number;
    /**
     * 千分比
     */
    baseAttackPower:number = 200;
    attackSpeed:number = 650;
    
    /**
     * 移速 每桢移动6个单位
     */
    moveSpeed:number = 6;

    public copy():PlayerData{
        let p = new PlayerData();
        p.exp = this.exp;
        p.level = this.level;
        p.lastLevel = this.lastLevel;
        p.baseAttackPower = this.baseAttackPower;
        p.attackSpeed = this.attackSpeed;
        p.moveSpeed = this.moveSpeed;
        return p;
    }

    public add( p:PlayerData ):void{
        this.exp += p.exp;
        this.level += p.level;
        this.lastLevel += p.lastLevel;
        this.baseAttackPower += p.baseAttackPower;
        this.attackSpeed += p.attackSpeed;
        this.moveSpeed += p.moveSpeed;
    }

    public reduce( p:PlayerData ):void{
        this.exp -= p.exp;
        this.level -= p.level;
        this.lastLevel -= p.lastLevel;
        this.baseAttackPower -= p.baseAttackPower;
        this.attackSpeed -= p.attackSpeed;
        this.moveSpeed -= p.moveSpeed;
    }

    public reset():void{
        
    }
}