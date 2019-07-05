export default class GameData{
    constructor(){}
    
    public bounce:number = 0;
    public proType:number = 0;

    public hp:number = 600;
    public maxhp:number = 600;

    public initData():void{
        this.bounce = 0;
    }
}