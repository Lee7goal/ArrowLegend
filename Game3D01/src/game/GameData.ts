export default class GameData{
    constructor(){}
    
    public bounce:number = 0;
    public proType:number = 0;

    public hp:number = 100;
    public maxhp:number = 100;

    public initData():void{
        this.bounce = 0;
    }
}