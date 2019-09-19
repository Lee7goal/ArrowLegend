export default class PlayerData{
    constructor() {}

    // exp:number = 0;
    // level:number;
    // lastLevel:number;

    public copy():PlayerData{
        let p = new PlayerData();
        // p.exp = this.exp;
        // p.level = this.level;
        // p.lastLevel = this.lastLevel;
        return p;
    }

    public add( p:PlayerData ):void{
        // this.exp += p.exp;
        // this.level += p.level;
        // this.lastLevel += p.lastLevel;
    }

    public reduce( p:PlayerData ):void{
        // this.exp -= p.exp;
        // this.level -= p.level;
        // this.lastLevel -= p.lastLevel;
    }

    public reset():void{
        
    }
}